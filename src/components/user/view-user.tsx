import { type RouterOutputs } from "~/trpc/react";
import { ViewUserMail } from "~/components/user/view-user-mail";

type ViewUserProps = {
  user: RouterOutputs["user"]["read"];
};

export const ViewUser = ({ user }: ViewUserProps) => {
  return (
    <div>
      <div>FirstName: {user.firstName}</div>
      <div>LastName: {user.lastName}</div>
      <ViewUserMail email={user.email} />
    </div>
  );
};
