import { Button, type ButtonProps } from "~/components/ui/button";
import { Loader2 } from "lucide-react";

export const SubmitButton = ({
  children,
  isSubmitting,
  blocked,
  ...props
}: ButtonProps & { isSubmitting: boolean; blocked?: boolean }) => {
  return (
    <div>
      <Button type="submit" disabled={isSubmitting || blocked} {...props}>
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </Button>
      {blocked && (
        <div>
          <span className="text-xs text-destructive">
            You&apos;re not allowed to submit this form.
          </span>
        </div>
      )}
    </div>
  );
};
