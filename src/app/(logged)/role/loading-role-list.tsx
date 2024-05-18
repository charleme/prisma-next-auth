import { DataTableSkeleton } from "~/components/data-table/data-table-skeleton";

export default function LoadingRoleList() {
  return (
    <div>
      <DataTableSkeleton rowCount={10} columnCount={4} withPagination={false} />
    </div>
  );
}
