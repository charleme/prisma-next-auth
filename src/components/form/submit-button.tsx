import { Button, type ButtonProps } from "~/components/ui/button";
import { Loader2 } from "lucide-react";

export const SubmitButton = ({
  children,
  isSubmitting,
  disabled,
  ...props
}: ButtonProps & { isSubmitting: boolean }) => {
  return (
    <div>
      <Button type="submit" disabled={isSubmitting || disabled} {...props}>
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </Button>
      {disabled && (
        <div>
          <span className="text-xs text-destructive">
            You&apos;re not allowed to submit this form.
          </span>
        </div>
      )}
    </div>
  );
};
