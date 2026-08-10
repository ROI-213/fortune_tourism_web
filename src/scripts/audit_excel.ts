// src/scripts/audit_excel.ts
/**
 * Script to audit the Excel workbook `DAY BOOK (2).xlsx`.
 * It reads all sheets, extracts column headers, detects merged cells,
 * identifies subtotals, formulas and data types, and generates a JSON
 * schema that can be used for database migration.
 */
import * as fs from "fs";
import * as path from "path";
import * as XLSX from "xlsx";

interface SheetInfo {
  name: string;
  columns: string[]; // header row values
  mergedRanges: XLSX.Range[];
  rowCount: number;
  formulas: Record<number, string[]>; // row -> list of formula strings
  sampleData: Record<string, any>[]; // first few rows of data
}

function auditWorkbook(filePath: string): SheetInfo[] {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Workbook not found at ${filePath}`);
  }
  const workbook = XLSX.readFile(filePath, { cellFormula: true, cellNF: true, cellDates: true });
  const result: SheetInfo[] = [];
  workbook.SheetNames.forEach((sheetName) => {
    const ws = workbook.Sheets[sheetName];
    const range = XLSX.utils.decode_range(ws["!ref"]!);
    const merged = ws["!merges"] || [];
    // Get header row (first non‑empty row)
    let headerRow = range.s.r;
    while (headerRow <= range.e.r) {
      const firstCell = ws[XLSX.utils.encode_cell({ r: headerRow, c: range.s.c })];
      if (firstCell && firstCell.v !== undefined && firstCell.v !== null && firstCell.v !== "") {
        break;
      }
      headerRow++;
    }
    const headers: string[] = [];
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellAddress = { r: headerRow, c: C };
      const cellRef = XLSX.utils.encode_cell(cellAddress);
      const cell = ws[cellRef];
      headers.push(cell && cell.v ? String(cell.v).trim() : `Column${C + 1}`);
    }
    // Collect formulas per row
    const formulas: Record<number, string[]> = {};
    for (let R = headerRow + 1; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
        const cell = ws[cellRef];
        if (cell && cell.f) {
          const rowNum = R + 1; // 1‑based for readability
          if (!formulas[rowNum]) formulas[rowNum] = [];
          formulas[rowNum].push(cell.f);
        }
      }
    }
    // Sample first 5 data rows
    const sampleData: Record<string, any>[] = [];
    for (let R = headerRow + 1; R <= Math.min(headerRow + 5, range.e.r); ++R) {
      const rowObj: Record<string, any> = {};
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
        const cell = ws[cellRef];
        const header = headers[C - range.s.c] || `Column${C + 1}`;
        rowObj[header] = cell ? cell.v : null;
      }
      sampleData.push(rowObj);
    }
    result.push({
      name: sheetName,
      columns: headers,
      mergedRanges: merged,
      rowCount: range.e.r - headerRow,
      formulas,
      sampleData,
    });
  });
  return result;
}

// When run directly, output JSON to console or a file.
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error("Usage: ts-node src/scripts/audit_excel.ts <path-to-workbook.xlsx>");
    process.exit(1);
  }
  const filePath = path.resolve(args[0]);
  try {
    const audit = auditWorkbook(filePath);
    const outPath = path.join(process.cwd(), "artifacts", "excel_audit_report.json");
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, JSON.stringify(audit, null, 2));
    console.log("Audit report generated at", outPath);
  } catch (e: any) {
    console.error("Error auditing workbook:", e.message);
    process.exit(1);
  }
}
