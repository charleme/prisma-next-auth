import * as React from "react";
import { type DialogContentProps } from "@radix-ui/react-dialog";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

export type SimpleDialogProps = {
  title: React.ReactNode;
  description: React.ReactNode;
  footer?: React.ReactNode;
} & DialogContentProps;

export const SimpleDialogContent = ({
  title,
  description,
  footer,
  children,
  ...props
}: SimpleDialogProps) => {
  return (
    <DialogContent {...props}>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      {children}
      {footer && <DialogFooter>{footer}</DialogFooter>}
    </DialogContent>
  );
};
