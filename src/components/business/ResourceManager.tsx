import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, RefreshCw, Search, Loader2 } from "lucide-react";
import { RecordFormDialog } from "@/components/business/RecordFormDialog";
import type { ResourceConfig } from "@/lib/business-schema";

interface RowData {
  id: string | number;
  [key: string]: unknown;
}

const FRIENDLY_COLUMNS: Record<string, string> = {
  created_at: "Created",
  booking_date: "Booking Date",
  travel_date: "Travel Date",
  journey_date: "Journey Date",
  payment_date: "Payment Date",
  due_date: "Due Date",
  expense_date: "Expense Date",
  repair_date: "Repair Date",
  transaction_date: "Txn Date",
  booking_number: "Booking No.",
  serial_number: "Serial No.",
  passenger_name: "Passenger",
  from_location: "From",
  to_location: "To",
  due_amount: "Due",
  paid_amount: "Paid",
  remaining_amount: "Remaining",
  total_amount: "Total",
  booking_amount: "Booking Amt",
  settled_amount: "Settled",
  to_pay: "To Pay",
};

function formatCell(cfg: ResourceConfig, column: string, value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";

  if (column.startsWith("ref__")) return String(value);

  const field = cfg.fields.find((f) => f.name === column);

  if (field?.type === "money") {
    const n = Number(value);
    if (Number.isNaN(n)) return String(value);
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(n);
  }
  if (field?.type === "boolean") return value ? "Yes" : "No";
  if (
    field?.type === "date" ||
    column.endsWith("_date") ||
    column.endsWith("_expiry") ||
    column.endsWith("_expiry_date")
  ) {
    return String(value).slice(0, 10);
  }
  return String(value);
}

function columnLabel(column: string): string {
  if (FRIENDLY_COLUMNS[column]) return FRIENDLY_COLUMNS[column];
  return column.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function ResourceManager({ resource }: { resource: ResourceConfig }) {
  const [rows, setRows] = useState<RowData[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [queryText, setQueryText] = useState("");
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<RowData | null>(null);

  const fetchRows = useCallback(
    async (q?: string) => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/business/${resource.key}?limit=500${q ? `&q=${encodeURIComponent(q)}` : ""}`,
        );
        const d = await res.json();
        if (!d.success) throw new Error(d.error || "Failed to load");
        setRows(d.rows || []);
        setColumns(d.columns || []);
      } catch (err: any) {
        toast.error(err.message || "Failed to load records");
      } finally {
        setLoading(false);
      }
    },
    [resource.key],
  );

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  const handleDelete = async (row: RowData) => {
    if (!confirm(`Delete this ${resource.label.toLowerCase()} record? This cannot be undone.`))
      return;
    try {
      const res = await fetch(
        `/api/business/${resource.key}?id=${encodeURIComponent(String(row.id))}`,
        {
          method: "DELETE",
        },
      );
      const d = await res.json();
      if (!d.success) throw new Error(d.error || "Delete failed");
      toast.success(`${resource.label} deleted`);
      setRows((prev) => prev.filter((r) => r.id !== row.id));
    } catch (err: any) {
      toast.error(err.message || "Delete failed");
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-white shadow-sm overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-border p-5 bg-slate-50/50">
        <div>
          <h2 className="font-heading text-lg font-bold">{resource.plural}</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{resource.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={queryText}
              onChange={(e) => setQueryText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && setSearch(queryText)}
              placeholder="Search records..."
              className="pl-9 rounded-lg border border-border bg-white px-3 py-2 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-[color:var(--color-navy)]/30"
            />
          </div>
          <button
            onClick={() => fetchRows(search)}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-sm font-medium shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
            title="Refresh"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => {
              setEditing(null);
              setDialogOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-[color:var(--color-navy)] px-4 py-2 text-xs font-semibold text-white shadow transition hover:brightness-110"
          >
            <Plus className="h-4 w-4" /> Add {resource.label}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-12 flex items-center justify-center text-muted-foreground text-sm gap-2">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading {resource.plural.toLowerCase()}...
          </div>
        ) : rows.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground text-sm">No records found.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-100/70 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                {columns.map((col) => (
                  <th key={col} className="px-4 py-3 whitespace-nowrap">
                    {columnLabel(col)}
                  </th>
                ))}
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((row) => (
                <tr key={String(row.id)} className="hover:bg-slate-50/80 transition">
                  {columns.map((col) => (
                    <td key={col} className="px-4 py-3 whitespace-nowrap max-w-[240px] truncate">
                      {formatCell(resource, col, row[col])}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditing(row);
                          setDialogOpen(true);
                        }}
                        className="p-1.5 text-slate-500 hover:bg-blue-50 hover:text-blue-700 rounded"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(row)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {dialogOpen && (
        <RecordFormDialog
          resource={resource}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          initialValues={editing ?? undefined}
          onSaved={(row) => {
            if (editing) {
              setRows((prev) => prev.map((r) => (r.id === row.id ? (row as RowData) : r)));
            } else {
              setRows((prev) => [row as RowData, ...prev]);
            }
          }}
        />
      )}
    </div>
  );
}
