import { Role } from "~/types/enum/Role";
import { Badge } from "~/components/ui/badge";

export const RoleBadge = ({ role }: { role: { id: number; name: string } }) => {
  const badgeVariants: Record<number, string> = {
    [Role.Admin]: "",
    [Role.User]: "bg-blue-400 hover:bg-blue-400/80",
  };

  const className = badgeVariants[role.id];

  if (className === undefined)
    throw new Error(`Role ${role.id}${role.name} not supported`);

  return <Badge className={className}>{role.name}</Badge>;
};
