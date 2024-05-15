import { Button, type ButtonProps } from "~/components/ui/button";
import { Loader2 } from "lucide-react";

export const SubmitButton = ({
  children,
  isSubmitting,
  ...props
}: ButtonProps & { isSubmitting: boolean }) => {
  return (
    <Button type="submit" disabled={isSubmitting} {...props}>
      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </Button>
  );
};
