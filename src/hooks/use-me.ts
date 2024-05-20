import { useSession } from "next-auth/react";

export const useMe = () => {
  const session = useSession();
  return session?.data?.user;
};
