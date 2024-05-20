"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { api } from "~/trpc/react";
import { useToast } from "~/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Right } from "~/types/enum/Right";
import { RightCheckbox } from "~/components/role/rights-checkbox";
import { useState } from "react";

const rightSections = [
  {
    name: "Role",
    description: "Define the different rights of the users",
    rights: [
      Right.VIEW_ROLE,
      Right.VIEW_ROLE_LIST,
      Right.UPDATE_ROLE,
      Right.DELETE_ROLE,
    ],
  },
];

export const RightsRoleForm = ({
  defaultValue,
  roleId,
  readOnly,
  rights,
}: {
  roleId: number;
  defaultValue: Right[];
  readOnly: boolean;
  rights: Record<number, { name: string; description: string }>;
}) => {
  const { toast } = useToast();
  const [selectedRights, setSelectedRights] = useState<Right[]>(defaultValue);

  const router = useRouter();
  const { mutate: updateRights } = api.role.updateRights.useMutation();

  const onSubmit = (rightId: Right, checked: boolean) => {
    updateRights(
      { rightId, checked, id: roleId },
      {
        onSuccess: () => {
          toast({
            title: `Role rights ${checked ? "assigned" : "unassigned"} successfully !`,
          });
        },
        onError: (error) => {
          // cancel state change
          setSelectedRights((prev) =>
            checked ? prev.filter((id) => id !== rightId) : [...prev, rightId],
          );
        },
      },
    );
  };

  return (
    <div className="grid gap-6">
      <form>
        {rightSections.map(({ name, rights: sectionRights, description }) => (
          <Card x-chunk="dashboard-04-chunk-1" key={name}>
            <CardHeader>
              <CardTitle>{name}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {sectionRights.map((rightId) => {
                const right = rights[rightId];
                if (!right) throw new Error("Invalid right id");

                return (
                  <RightCheckbox
                    key={rightId}
                    label={right.name}
                    description={right.description}
                    blocked={readOnly}
                    checked={selectedRights.includes(rightId)}
                    toggleChecked={() => {
                      if (readOnly) return;

                      const isChecked = selectedRights.includes(rightId);
                      const newValue = isChecked
                        ? selectedRights.filter((id) => id !== rightId)
                        : [...selectedRights, rightId];

                      setSelectedRights(newValue);

                      onSubmit(rightId, !isChecked);
                    }}
                  />
                );
              })}
            </CardContent>
          </Card>
        ))}
      </form>
    </div>
  );
};
