import { useState, useRef, useEffect, useId } from "react";
import { MapPin, Navigation, Check, Loader2 } from "lucide-react";
import { searchLocations, detectUserLocation, type LocationItem } from "@/data/locations";

interface LocationSearchInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (val: string, loc?: LocationItem) => void;
  filterType?: "flight" | "bus" | "train" | "taxi";
  icon?: React.ComponentType<{ className?: string }>;
  error?: string;
  className?: string;
}

export function LocationSearchInput({
  label,
  placeholder = "Search city, airport or station...",
  value,
  onChange,
  filterType,
  icon: Icon = MapPin,
  error,
  className = "",
}: LocationSearchInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<LocationItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectMsg, setDetectMsg] = useState<string | null>(null);

  const listboxId = useId();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync internal query state with prop value
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Update suggestions whenever query or filterType changes
  useEffect(() => {
    const results = searchLocations(query, filterType);
    setSuggestions(results);
  }, [query, filterType]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (loc: LocationItem) => {
    setQuery(loc.name);
    onChange(loc.name, loc);
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        handleSelect(suggestions[selectedIndex]);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setSelectedIndex(-1);
    }
  };

  const handleDetectLocation = async () => {
    setIsDetecting(true);
    setDetectMsg("Detecting your live GPS location...");
    toast.info("Detecting your live GPS location...", { id: "gps-status" });
    try {
      const res = await detectUserLocation();
      setIsDetecting(false);

      if (res.success && res.location) {
        setDetectMsg(`📍 Located: ${res.location.name}`);
        setQuery(res.location.name);
        onChange(res.location.name, res.location);
        toast.success(`📍 Live Location Detected: ${res.location.name}`, { id: "gps-status" });
        setTimeout(() => {
          setIsOpen(false);
          setDetectMsg(null);
        }, 1200);
      } else {
        const fallbackName = res.cityName || "Bangalore, Karnataka";
        setQuery(fallbackName);
        onChange(fallbackName);
        toast.success(`📍 Location: ${fallbackName}`, { id: "gps-status" });
        setDetectMsg(`📍 Located: ${fallbackName}`);
        setTimeout(() => {
          setIsOpen(false);
          setDetectMsg(null);
        }, 1200);
      }
    } catch {
      setIsDetecting(false);
      setDetectMsg("Using Bangalore as default location");
      setQuery("Bangalore, Karnataka");
      onChange("Bangalore, Karnataka");
      toast.info("Location set to Bangalore", { id: "gps-status" });
      setTimeout(() => {
        setIsOpen(false);
        setDetectMsg(null);
      }, 1200);
    }
  };

  // Helper to highlight matched substring
  const highlightMatch = (text: string, search: string) => {
    if (!search.trim()) return text;
    const parts = text.split(new RegExp(`(${search.trim()})`, "gi"));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === search.trim().toLowerCase() ? (
            <span key={i} className="bg-emerald-100 text-emerald-900 font-bold px-0.5 rounded">
              {part}
            </span>
          ) : (
            part
          ),
        )}
      </span>
    );
  };

  return (
    <div ref={wrapperRef} className={`relative flex-1 ${className}`}>
      {label && (
        <label className="block text-[11px] font-bold tracking-wider text-slate-500 uppercase mb-1">
          {label}
        </label>
      )}

      <div
        className={`relative flex items-center bg-white rounded-xl sm:rounded-2xl border transition-all duration-200 ${
          error
            ? "border-red-500 ring-2 ring-red-100"
            : isOpen
              ? "border-emerald-600 ring-2 ring-emerald-100 shadow-md"
              : "border-slate-300 hover:border-slate-400"
        }`}
      >
        <div className="pl-3.5 pr-2 text-slate-400">
          <Icon className="h-4 w-4 text-slate-500" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            onChange(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-expanded={isOpen}
          aria-autocomplete="list"
          aria-controls={listboxId}
          className="w-full py-3 pr-16 font-semibold text-slate-900 text-xs sm:text-sm focus:outline-none bg-transparent placeholder:text-slate-400 placeholder:font-normal"
        />

        <div className="absolute right-2 flex items-center gap-1">
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                onChange("");
                inputRef.current?.focus();
              }}
              className="text-slate-400 hover:text-slate-600 text-xs font-bold p-1"
              title="Clear input"
            >
              ✕
            </button>
          ) : null}

          <button
            type="button"
            onClick={handleDetectLocation}
            disabled={isDetecting}
            title="Detect Live GPS Location"
            className="p-1 rounded-md text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 transition"
          >
            {isDetecting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-600" />
            ) : (
              <Navigation className="h-3.5 w-3.5 text-emerald-600 fill-emerald-50" />
            )}
          </button>
        </div>
      </div>

      {error && <span className="block text-[11px] font-medium text-red-500 mt-1">{error}</span>}

      {/* Autocomplete Dropdown Menu */}
      {isOpen && (
        <div
          id={listboxId}
          role="listbox"
          className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white rounded-2xl shadow-2xl border border-slate-200 max-h-72 overflow-y-auto animate-fadeIn divide-y divide-slate-100"
        >
          {/* Current Location Option Button */}
          <button
            type="button"
            onClick={handleDetectLocation}
            disabled={isDetecting}
            className="w-full px-4 py-3 flex items-center justify-between text-left text-xs font-bold text-emerald-700 bg-emerald-50/70 hover:bg-emerald-100 transition cursor-pointer"
          >
            <div className="flex items-center gap-2">
              {isDetecting ? (
                <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
              ) : (
                <Navigation className="h-4 w-4 text-emerald-600 fill-emerald-100" />
              )}
              <span>📍 Use Current Location</span>
            </div>
            <span className="text-[10px] bg-emerald-200/80 text-emerald-900 px-2 py-0.5 rounded-full font-bold">
              {isDetecting ? "Detecting..." : "GPS"}
            </span>
          </button>

          {detectMsg && (
            <div className="px-4 py-2 bg-slate-900 text-white text-[11px] font-medium animate-fadeIn flex items-center gap-2">
              {isDetecting && <Loader2 className="h-3 w-3 animate-spin text-emerald-400" />}
              <span>{detectMsg}</span>
            </div>
          )}

          {suggestions.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-500">
              No matching locations found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            suggestions.map((item, idx) => {
              const isSelected = selectedIndex === idx;
              return (
                <div
                  key={item.id}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`px-4 py-3 cursor-pointer flex items-center justify-between transition ${
                    isSelected ? "bg-emerald-50 text-emerald-950 font-semibold" : "hover:bg-slate-50 text-slate-800"
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-xs leading-snug">
                        {highlightMatch(item.name, query)}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {item.city}, {item.state}
                      </div>
                    </div>
                  </div>

                  {item.code && (
                    <span className="shrink-0 text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200">
                      {item.code}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
