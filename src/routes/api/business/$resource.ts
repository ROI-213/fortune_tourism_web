import { createFileRoute } from "@tanstack/react-router";
import { query } from "@/lib/db";
import {
  getResourceConfig,
  isResourceWhitelisted,
  coerceValue,
  type ResourceConfig,
} from "@/lib/business-schema";

export const Route = createFileRoute("/api/business/$resource")({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        try {
          const resource = params.resource;
          const cfg = getResourceConfig(resource);

          if (!cfg) {
            return new Response(
              JSON.stringify({ success: false, error: `Unknown business resource: ${resource}` }),
              { status: 404, headers: { "Content-Type": "application/json" } },
            );
          }

          const url = new URL(request.url);

          // Return schema metadata (for the admin UI form builder)
          if (url.searchParams.get("meta") === "1") {
            return new Response(JSON.stringify({ success: true, schema: cfg }), {
              headers: { "Content-Type": "application/json" },
            });
          }

          const limit = Math.min(Number(url.searchParams.get("limit")) || 500, 1000);
          const offset = Number(url.searchParams.get("offset")) || 0;
          const q = url.searchParams.get("q")?.trim();

          const { sql, whereParams } = buildListQuery(cfg, q);

          const sqlFinal = `${sql} ORDER BY r.${cfg.orderBy} ${cfg.orderDir || "DESC"} LIMIT ${limit} OFFSET ${offset}`;

          let countSql = `SELECT COUNT(*)::int AS n FROM ${cfg.table} r`;
          const countParams: unknown[] = [];
          if (q && cfg.searchCols.length > 0) {
            countSql += ` WHERE ${cfg.searchCols.map((c, i) => `r."${c}"::text ILIKE $${i + 1}`).join(" OR ")}`;
            countParams.push(...Array.from({ length: cfg.searchCols.length }, () => `%${q}%`));
          }

          // Execute data query and count query concurrently
          const [res, countRes] = await Promise.all([
            query(sqlFinal, whereParams),
            query(countSql, countParams),
          ]);

          return new Response(
            JSON.stringify({
              success: true,
              rows: res.rows,
              count: countRes.rows[0]?.n ?? res.rows.length,
              columns: buildColumns(cfg),
            }),
            { headers: { "Content-Type": "application/json" } },
          );
        } catch (error: any) {
          console.error(`GET /api/business/$resource error:`, error);
          return new Response(
            JSON.stringify({ success: false, error: error.message || "Failed to fetch records" }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }
      },

      POST: async ({ request, params }) => {
        try {
          const resource = params.resource;
          if (!isResourceWhitelisted(resource)) {
            return new Response(
              JSON.stringify({ success: false, error: `Unknown business resource: ${resource}` }),
              { status: 404, headers: { "Content-Type": "application/json" } },
            );
          }
          const cfg = getResourceConfig(resource)!;
          const body = await request.json();

          const columns: string[] = [];
          const placeholders: string[] = [];
          const values: unknown[] = [];

          for (const field of cfg.fields) {
            if (field.readOnly) continue;
            let raw = body[field.name];
            if (raw === undefined || raw === null || raw === "") {
              if (cfg.insertDefaults && field.name in cfg.insertDefaults) {
                raw = cfg.insertDefaults[field.name];
              } else {
                continue;
              }
            }
            columns.push(field.name);
            placeholders.push(`$${values.length + 1}`);
            values.push(coerceValue(field, raw));
          }

          if (columns.length === 0) {
            return new Response(
              JSON.stringify({ success: false, error: "No valid fields provided." }),
              { status: 400, headers: { "Content-Type": "application/json" } },
            );
          }

          const res = await query(
            `INSERT INTO ${cfg.table} (${columns.map((c) => `"${c}"`).join(", ")})
             VALUES (${placeholders.join(", ")}) RETURNING *`,
            values,
          );

          return new Response(JSON.stringify({ success: true, row: res.rows[0] }), {
            status: 201,
            headers: { "Content-Type": "application/json" },
          });
        } catch (error: any) {
          console.error(`POST /api/business/$resource error:`, error);
          return new Response(
            JSON.stringify({ success: false, error: error.message || "Failed to create record" }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }
      },

      PUT: async ({ request, params }) => {
        try {
          const resource = params.resource;
          if (!isResourceWhitelisted(resource)) {
            return new Response(
              JSON.stringify({ success: false, error: `Unknown business resource: ${resource}` }),
              { status: 404, headers: { "Content-Type": "application/json" } },
            );
          }
          const cfg = getResourceConfig(resource)!;
          const body = await request.json();
          const id = body.id;

          if (id === undefined || id === null || id === "") {
            return new Response(
              JSON.stringify({ success: false, error: "ID is required for update." }),
              { status: 400, headers: { "Content-Type": "application/json" } },
            );
          }

          const sets: string[] = [];
          const values: unknown[] = [];

          for (const field of cfg.fields) {
            if (field.readOnly) continue;
            if (!(field.name in body)) continue;
            values.push(coerceValue(field, body[field.name]));
            sets.push(`"${field.name}" = $${values.length}`);
          }

          if (sets.length === 0) {
            return new Response(
              JSON.stringify({ success: false, error: "No fields provided for update." }),
              { status: 400, headers: { "Content-Type": "application/json" } },
            );
          }

          values.push(id);
          const res = await query(
            `UPDATE ${cfg.table} SET ${sets.join(", ")} WHERE id = $${values.length} RETURNING *`,
            values,
          );

          if (res.rowCount === 0) {
            return new Response(JSON.stringify({ success: false, error: "Record not found." }), {
              status: 404,
              headers: { "Content-Type": "application/json" },
            });
          }

          return new Response(JSON.stringify({ success: true, row: res.rows[0] }), {
            headers: { "Content-Type": "application/json" },
          });
        } catch (error: any) {
          console.error(`PUT /api/business/$resource error:`, error);
          return new Response(
            JSON.stringify({ success: false, error: error.message || "Failed to update record" }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }
      },

      DELETE: async ({ request, params }) => {
        try {
          const resource = params.resource;
          if (!isResourceWhitelisted(resource)) {
            return new Response(
              JSON.stringify({ success: false, error: `Unknown business resource: ${resource}` }),
              { status: 404, headers: { "Content-Type": "application/json" } },
            );
          }
          const cfg = getResourceConfig(resource)!;
          const url = new URL(request.url);
          const id = url.searchParams.get("id");

          if (!id) {
            return new Response(JSON.stringify({ success: false, error: "ID is required." }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          await query(`DELETE FROM ${cfg.table} WHERE id = $1`, [id]);
          return new Response(JSON.stringify({ success: true }), {
            headers: { "Content-Type": "application/json" },
          });
        } catch (error: any) {
          console.error(`DELETE /api/business/$resource error:`, error);
          return new Response(
            JSON.stringify({ success: false, error: error.message || "Failed to delete record" }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }
      },
    },
  },
});

function buildColumns(cfg: ResourceConfig): string[] {
  const seen = new Set<string>();
  const cols: string[] = [];
  for (const name of cfg.tableColumns) {
    if (seen.has(name)) continue;
    seen.add(name);
    cols.push(name);
  }
  return cols;
}

function buildSearchParams(cfg: ResourceConfig, q: string): unknown[] {
  return Array.from({ length: cfg.searchCols.length }, () => `%${q}%`);
}

function buildListQuery(cfg: ResourceConfig, q?: string): { sql: string; whereParams: unknown[] } {
  // LEFT JOIN every reference field so the UI can display friendly labels.
  const joins: string[] = [];
  const selectCols = [`r.*`];

  for (const field of cfg.fields) {
    if (field.type === "reference" && field.ref && field.refLabel) {
      const refCfg = getResourceConfig(field.ref);
      if (!refCfg) continue;
      const alias = `ref__${field.name}`;
      joins.push(`LEFT JOIN ${refCfg.table} ${alias} ON ${alias}.id = r."${field.name}"`);
      selectCols.push(`${alias}."${field.refLabel}" AS "ref__${field.name}"`);
    }
  }

  let where = "";
  const whereParams: unknown[] = [];
  if (q && cfg.searchCols.length > 0) {
    where = ` WHERE ${cfg.searchCols.map((c, i) => `r."${c}"::text ILIKE $${i + 1}`).join(" OR ")}`;
    whereParams.push(...Array.from({ length: cfg.searchCols.length }, () => `%${q}%`));
  }

  return {
    sql: `SELECT ${selectCols.join(", ")} FROM ${cfg.table} r${joins.length ? " " + joins.join(" ") : ""}${where}`,
    whereParams,
  };
}
