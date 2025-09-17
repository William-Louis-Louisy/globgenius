import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import AdminClient from "@/components/AdminClient";
import MaxWidthWrapper from "@/components/commons/MaxWidthWrapper";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <MaxWidthWrapper className="flex flex-col items-center gap-8 mt-16 py-12">
      <AdminClient />
    </MaxWidthWrapper>
  );
}
