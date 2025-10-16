import { useState, useRef, useEffect } from "react";
import { Lock } from "lucide-react";

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
}

const PasswordInput = ({ value, onChange, disabled, required }: PasswordInputProps) => {
  const [displayValue, setDisplayValue] = useState("");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (value.length === 0) {
      setDisplayValue("");
      return;
    }

    const lastChar = value[value.length - 1];
    const hiddenPart = "•".repeat(value.length - 1);
    
    setDisplayValue(hiddenPart + lastChar);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setDisplayValue("•".repeat(value.length));
    }, 200);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value]);

  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium text-[hsl(var(--grun-primary-600))]">
        <Lock className="w-4 h-4" />
        Contraseña
      </label>
      <div className="relative">
        <input
          type="text"
          value={displayValue}
          onChange={(e) => {
            const newDisplayValue = e.target.value;
            const lengthDiff = newDisplayValue.length - displayValue.length;
            
            if (lengthDiff < 0) {
              // User deleted characters
              onChange(value.slice(0, value.length + lengthDiff));
            } else if (lengthDiff > 0 && value.length < 12) {
              // User added characters (up to 12)
              const newChars = newDisplayValue.replace(/•/g, "");
              const charsToAdd = newChars.slice(Math.max(0, newChars.length - lengthDiff));
              onChange(value + charsToAdd);
            }
          }}
          onPaste={(e) => {
            e.preventDefault();
            const pastedText = e.clipboardData.getData("text");
            const remainingSpace = 12 - value.length;
            if (remainingSpace > 0) {
              onChange(value + pastedText.slice(0, remainingSpace));
            }
          }}
          className="w-full h-12 px-4 text-base border-2 border-[hsl(var(--grun-neutral-200))] rounded-xl bg-[hsl(var(--grun-neutral-50))] transition-all focus:outline-none focus:border-[hsl(var(--grun-primary-600))] focus:shadow-[inset_0_2px_4px_rgba(0,0,0,0.06),0_0_0_3px_rgba(15,77,32,0.1),0_4px_6px_rgba(0,0,0,0.1)] focus:-translate-y-px placeholder:text-[hsl(var(--grun-neutral-400))]"
          placeholder="**********"
          disabled={disabled}
          required={required}
          autoComplete="off"
          maxLength={12}
        />
      </div>
    </div>
  );
};

export default PasswordInput;
