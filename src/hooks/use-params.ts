import { useSearchParams } from "next/navigation";
import { type ZodSchema, type ZodTypeDef } from "zod";
import { useMemo } from "react";

export function useParams<Output extends object, Def extends ZodTypeDef, Input>(
  schema: ZodSchema<Output, Def, Input>,
) {
  const params = useSearchParams();

  return useMemo(() => {
    return schema.parse(Object.fromEntries(params?.entries() ?? []));
  }, [schema, params]);
}
