"use client";

import { Checkbox } from "~/components/ui/checkbox";

export const RightCheckbox = ({
  label,
  description,
  checked,
  toggleChecked,
  blocked,
}: {
  label: string;
  description: string;
  checked: boolean;
  toggleChecked: () => void;
  blocked?: boolean;
}) => {
  return (
    <div className="items-top flex space-x-4">
      <Checkbox
        id={`right-${label}-checkbox`}
        checked={checked}
        disabled={blocked}
        onClick={toggleChecked}
      />
      <div className="grid gap-1.5 leading-none">
        <label
          htmlFor={`right-${label}-checkbox`}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
        </label>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};
