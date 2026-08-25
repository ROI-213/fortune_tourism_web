import { useState, useEffect } from "react";
import { UserCog, Phone, Car, Check, X } from "lucide-react";
import { toast } from "sonner";

interface DriverAssignPanelProps {
  bookingId: number;
  currentDriverId?: number | null;
  currentDriverName?: string;
  currentDriverPhone?: string;
  currentTaxiNumber?: string;
  currentVehicleType?: string;
  onDriverAssigned: () => void;
}

export function DriverAssignPanel({
  bookingId,
  currentDriverId,
  currentDriverName,
  currentDriverPhone,
  currentTaxiNumber,
  currentVehicleType,
  onDriverAssigned,
}: DriverAssignPanelProps) {
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [selectedDriverId, setSelectedDriverId] = useState<string>("");

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    setLoading(true);
    try {
      const key = sessionStorage.getItem("fortune_admin_key") || "";
      const res = await fetch("/api/business/drivers", {
        headers: { "x-admin-key": key },
      });
      const data = await res.json();
      if (data.success) {
        setDrivers(data.drivers || []);
      } else {
        toast.error("Failed to load drivers");
      }
    } catch (err) {
      toast.error("Error loading drivers");
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (driverIdToAssign: string | null = selectedDriverId) => {
    if (!driverIdToAssign && driverIdToAssign !== null) {
      toast.error("Please select a driver");
      return;
    }
    
    setAssigning(true);
    
    try {
      let driver = null;
      if (driverIdToAssign !== null) {
        driver = drivers.find((d) => String(d.id) === driverIdToAssign);
        if (!driver) {
          throw new Error("Driver not found");
        }
      }

      const key = sessionStorage.getItem("fortune_admin_key") || "";
      const res = await fetch("/api/bookings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": key,
        },
        body: JSON.stringify({
          id: bookingId,
          driver_id: driver ? driver.id : null,
          driver_name: driver ? driver.name : null,
          driver_phone: driver ? driver.phone : null,
          taxi_number: driver ? driver.vehicle_number : null,
          vehicle_type: driver ? driver.vehicle_type : null,
        }),
      });
      
      const data = await res.json();
      if (data.success) {
        toast.success(driver ? "Driver assigned successfully" : "Driver removed successfully");
        onDriverAssigned();
        if (driver) setSelectedDriverId("");
      } else {
        toast.error(data.error || "Failed to update driver assignment");
      }
    } catch (err) {
      toast.error("Error updating driver assignment");
    } finally {
      setAssigning(false);
    }
  };

  const hasCurrentDriver = currentDriverName || currentTaxiNumber;

  return (
    <div className="rounded-xl border border-border p-4 bg-white">
      <div className="flex items-center gap-2 mb-4">
        <UserCog className="h-5 w-5 text-slate-500" />
        <h3 className="font-bold text-[color:var(--color-navy)] uppercase text-xs tracking-wider">
          Driver & Vehicle Assignment
        </h3>
      </div>

      {hasCurrentDriver ? (
        <div className="rounded-lg bg-slate-50 border border-slate-200 p-4 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-semibold text-sm">{currentDriverName || "Unknown Driver"}</p>
              <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5" />
                  {currentDriverPhone || "N/A"}
                </span>
                <span className="flex items-center gap-1">
                  <Car className="h-3.5 w-3.5" />
                  {currentTaxiNumber || "N/A"} ({currentVehicleType || "N/A"})
                </span>
              </div>
            </div>
            <button
              onClick={() => handleAssign(null)}
              disabled={assigning}
              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-md transition-colors disabled:opacity-50"
              title="Remove Driver"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          <div className="border-t border-slate-200 pt-3">
            <p className="text-xs font-semibold mb-2 text-slate-600">Change Driver</p>
            <div className="flex gap-2">
              <select
                className="flex-1 rounded-md border border-slate-300 px-3 py-1.5 text-sm"
                value={selectedDriverId}
                onChange={(e) => setSelectedDriverId(e.target.value)}
                disabled={loading || assigning}
              >
                <option value="">Select a driver...</option>
                {drivers.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} - {d.vehicle_number} ({d.vehicle_type})
                  </option>
                ))}
              </select>
              <button
                onClick={() => handleAssign()}
                disabled={assigning || !selectedDriverId}
                className="px-3 py-1.5 bg-[color:var(--color-navy)] text-white text-xs font-bold rounded-md hover:brightness-110 disabled:opacity-50 flex items-center gap-1"
              >
                {assigning ? "Saving..." : "Change"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-slate-500">No driver assigned yet.</p>
          <div className="flex gap-2">
            <select
              className="flex-1 rounded-md border border-slate-300 px-3 py-1.5 text-sm"
              value={selectedDriverId}
              onChange={(e) => setSelectedDriverId(e.target.value)}
              disabled={loading || assigning}
            >
              <option value="">Select a driver to assign...</option>
              {drivers.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} {d.status === "ACTIVE" ? "(Available)" : `(${d.status})`} - {d.vehicle_number} ({d.vehicle_type})
                </option>
              ))}
            </select>
            <button
              onClick={() => handleAssign()}
              disabled={assigning || !selectedDriverId}
              className="px-4 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-md hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-1"
            >
              <Check className="h-4 w-4" />
              {assigning ? "Assigning..." : "Assign"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
