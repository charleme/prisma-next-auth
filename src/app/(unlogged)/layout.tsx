import {getAuthUser} from "~/server/auth";
import {redirect} from "next/navigation";

export default async function Layout({ children }: { children: React.ReactNode }) {
	const user = await getAuthUser();
	
	if (user){
		redirect("/")
	}
	
  return <>{children}</>;
}
