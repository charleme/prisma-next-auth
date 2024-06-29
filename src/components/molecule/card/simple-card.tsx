import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export type SimpleCardProps = {
  title: React.ReactNode;
  description: React.ReactNode;
  footer?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

export const SimpleCard = ({
  title,
  description,
  footer,
  children,
  ...props
}: SimpleCardProps) => {
  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  );
};
