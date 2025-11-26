import { useEffect, useMemo, useRef, useState } from "react";
import { X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

export interface MultiSelectFieldProps {
  label?: string;
  placeholder?: string;
  options: string[];
  selected: string[];
  onChange: (values: string[]) => void;
  className?: string;
  allowSearch?: boolean;
}

export const MultiSelectField = ({
  label,
  placeholder = "Select options",
  options,
  selected,
  onChange,
  className,
  allowSearch = true,
}: MultiSelectFieldProps) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const filteredOptions = useMemo(() => {
    if (!searchTerm.trim()) return options;
    return options.filter((option) =>
      option.toLowerCase().includes(searchTerm.trim().toLowerCase())
    );
  }, [options, searchTerm]);

  const toggleValue = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((item) => item !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div ref={containerRef} className={cn("space-y-2", className)}>
      {label && (
        <Label className="text-sm text-gray-700 font-medium" htmlFor={label}>
          {label}
        </Label>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className={cn(
            "flex w-full items-center justify-between rounded-xl border border-gray-300 bg-white px-4 py-3 text-left text-sm font-medium shadow-sm transition hover:border-gray-400",
            selected.length === 0 ? "text-gray-500" : "text-gray-900"
          )}
        >
          <span>{selected.length === 0 ? placeholder : `${selected.length} selected`}</span>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-gray-500 transition-transform",
              open ? "rotate-180" : ""
            )}
          />
        </button>
        {open && (
          <div className="absolute left-0 right-0 z-30 mt-2 rounded-2xl border border-gray-200 bg-white shadow-2xl">
            {allowSearch && options.length > 6 && (
              <div className="border-b border-gray-100 px-4 py-3">
                <div className="rounded-lg border border-gray-200 px-3 py-2">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search..."
                    className="w-full text-sm text-gray-700 outline-none"
                  />
                </div>
              </div>
            )}
            <div className="max-h-60 overflow-y-auto py-2">
              {filteredOptions.length === 0 ? (
                <p className="py-4 text-center text-sm text-gray-500">No options found</p>
              ) : (
                filteredOptions.map((option) => (
                  <label
                    key={option}
                    className="flex cursor-pointer items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={selected.includes(option)}
                      onChange={() => toggleValue(option)}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span>{option}</span>
                  </label>
                ))
              )}
            </div>
          </div>
        )}
      </div>
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selected.map((value) => (
            <span
              key={value}
              className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
            >
              {value}
              <button
                type="button"
                onClick={() => toggleValue(value)}
                className="text-primary hover:text-primary/70"
                aria-label={`Remove ${value}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
