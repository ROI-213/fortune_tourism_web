import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { FieldDef, ResourceConfig } from "@/lib/business-schema";

interface RecordFormDialogProps {
  resource: ResourceConfig;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues?: Record<string, unknown>;
  onSaved: (row: Record<string, unknown>) => void;
}

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  const label = (
    <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
      {field.label}
      {field.required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );

  const inputClass =
    "mt-1 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--color-navy)]/30";

  switch (field.type) {
    case "textarea":
      return (
        <div>
          {label}
          <textarea
            rows={3}
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value || null)}
            className={inputClass}
          />
        </div>
      );
    case "money":
    case "number":
      return (
        <div>
          {label}
          <input
            type="number"
            step={field.type === "money" ? "0.01" : "1"}
            value={value === null || value === undefined ? "" : String(value)}
            onChange={(e) => onChange(e.target.value === "" ? null : Number(e.target.value))}
            className={inputClass}
          />
        </div>
      );
    case "date":
      return (
        <div>
          {label}
          <input
            type="date"
            value={value ? String(value).slice(0, 10) : ""}
            onChange={(e) => onChange(e.target.value || null)}
            className={inputClass}
          />
        </div>
      );
    case "time":
      return (
        <div>
          {label}
          <input
            type="time"
            value={value ? String(value).slice(0, 5) : ""}
            onChange={(e) => onChange(e.target.value || null)}
            className={inputClass}
          />
        </div>
      );
    case "boolean":
      return (
        <div className="flex items-center gap-2 mt-1">
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => onChange(e.target.checked)}
            className="h-4 w-4 accent-[color:var(--color-navy)]"
          />
          {label}
        </div>
      );
    case "select":
      return (
        <div>
          {label}
          <select
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value || null)}
            className={inputClass}
          >
            <option value="">— Select —</option>
            {(field.options || []).map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      );
    case "reference":
      return (
        <div>
          {label}
          <input
            type="number"
            placeholder={`Enter ${field.ref} id`}
            value={value === null || value === undefined ? "" : String(value)}
            onChange={(e) => onChange(e.target.value === "" ? null : Number(e.target.value))}
            className={inputClass}
          />
        </div>
      );
    case "email":
      return (
        <div>
          {label}
          <input
            type="email"
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value || null)}
            className={inputClass}
          />
        </div>
      );
    case "text":
    default:
      if (field.name === "allowed_sections") {
        const currentList = String(value || "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);

        const availableSections = [
          { key: "cab_bookings", label: "Cab Bookings" },
          { key: "package_trips", label: "Package Trips" },
          { key: "day_book_entries", label: "Day Book" },
          { key: "hourly_bookings", label: "Hourly Rental" },
          { key: "expenses", label: "Expenses / Fuel" },
          { key: "repairs", label: "Vehicle Repairs" },
          { key: "customers", label: "Customers" },
          { key: "drivers", label: "Drivers List" },
          { key: "vehicles", label: "Vehicle Registry" },
          { key: "bus_bookings", label: "Bus Bookings" },
          { key: "train_bookings", label: "Train Bookings" },
          { key: "flight_bookings", label: "Flight Bookings" },
        ];

        const toggleSection = (key: string) => {
          let updated: string[];
          if (currentList.includes(key)) {
            updated = currentList.filter((k) => k !== key);
          } else {
            updated = [...currentList, key];
          }
          onChange(updated.join(", "));
        };

        return (
          <div className="col-span-full rounded-2xl bg-slate-50/90 p-5 border border-slate-200">
            {label}
            {field.hint && <p className="text-xs text-muted-foreground mt-0.5 mb-3">{field.hint}</p>}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 mt-2">
              {availableSections.map((sec) => {
                const isChecked = currentList.includes(sec.key);
                return (
                  <label
                    key={sec.key}
                    title={sec.label}
                    className={`flex items-center gap-2.5 rounded-xl border px-3.5 py-3 text-xs font-semibold cursor-pointer transition select-none min-w-0 ${
                      isChecked
                        ? "border-[color:var(--color-navy)] bg-white text-[color:var(--color-navy)] shadow-sm ring-1 ring-[color:var(--color-navy)]/30"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-100/50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleSection(sec.key)}
                      className="h-4 w-4 shrink-0 rounded border-slate-300 text-[color:var(--color-navy)] accent-[color:var(--color-navy)]"
                    />
                    <span className="truncate flex-1 min-w-0">{sec.label}</span>
                  </label>
                );
              })}
            </div>
          </div>
        );
      }

      return (
        <div>
          {label}
          <input
            type="text"
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value || null)}
            className={inputClass}
          />
        </div>
      );
  }
}

export function RecordFormDialog({
  resource,
  open,
  onOpenChange,
  initialValues,
  onSaved,
}: RecordFormDialogProps) {
  const [values, setValues] = useState<Record<string, unknown>>(() =>
    Object.fromEntries(resource.fields.map((f) => [f.name, initialValues?.[f.name] ?? null])),
  );
  const [saving, setSaving] = useState(false);

  const setValue = (name: string, value: unknown) =>
    setValues((prev) => ({ ...prev, [name]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = initialValues?.id;
    setSaving(true);
    try {
      const res = await fetch(`/api/business/${resource.key}`, {
        method: id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, ...(id ? { id } : {}) }),
      });
      const d = await res.json();
      if (!d.success) throw new Error(d.error || "Save failed");
      toast.success(id ? `${resource.label} updated` : `${resource.label} created`);
      onSaved(d.row);
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] w-full max-w-2xl sm:max-w-3xl overflow-y-auto p-6 sm:p-8">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">
            {initialValues?.id ? `Edit ${resource.label}` : `Add ${resource.label}`}
          </DialogTitle>
          {resource.description && (
            <p className="text-xs text-muted-foreground">{resource.description}</p>
          )}
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2 mt-2">
          {resource.fields
            .filter((f) => !f.readOnly)
            .map((field) => (
              <div
                key={field.name}
                className={
                  field.gridSpan === 2 || field.name === "allowed_sections"
                    ? "sm:col-span-2"
                    : ""
                }
              >
                <FieldInput
                  field={field}
                  value={values[field.name]}
                  onChange={(v) => setValue(field.name, v)}
                />
                {field.hint && field.name !== "allowed_sections" && (
                  <p className="mt-1 text-[11px] text-muted-foreground">{field.hint}</p>
                )}
              </div>
            ))}

          <DialogFooter className="sm:col-span-2 mt-4 gap-2 border-t border-border pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="bg-[color:var(--color-navy)] text-white hover:brightness-110 px-6"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {saving ? "Saving..." : initialValues?.id ? "Save Changes" : "Create Record"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
