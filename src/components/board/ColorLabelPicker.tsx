"use client";

import { Check } from "lucide-react";
import { LABEL_COLORS } from "@/lib/constants";

interface ColorLabelPickerProps {
  selected: string[];
  onChange: (labels: string[]) => void;
}

export function ColorLabelPicker({ selected, onChange }: ColorLabelPickerProps) {
  function toggleLabel(colorId: string) {
    if (selected.includes(colorId)) {
      onChange(selected.filter((id) => id !== colorId));
    } else {
      onChange([...selected, colorId]);
    }
  }

  return (
    <div className="flex gap-2">
      {LABEL_COLORS.map((color) => {
        const isSelected = selected.includes(color.id);
        return (
          <button
            key={color.id}
            type="button"
            onClick={() => toggleLabel(color.id)}
            aria-label={`${color.name} label${isSelected ? ", selected" : ""}`}
            className={`flex size-8 min-h-[44px] min-w-[44px] items-center justify-center rounded-full ring-offset-2 transition-all ${
              isSelected ? "ring-2" : "ring-0 hover:ring-2 hover:ring-slate-300"
            }`}
            style={{
              backgroundColor: color.value,
              ...(isSelected ? { boxShadow: `0 0 0 2px white, 0 0 0 4px ${color.value}` } : {}),
            }}
          >
            {isSelected && <Check className="size-4 text-white" strokeWidth={3} />}
          </button>
        );
      })}
    </div>
  );
}
