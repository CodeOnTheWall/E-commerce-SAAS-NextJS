import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import NavBar from "@/components/NavBar";

interface DashBoardLayoutProps {
  children: React.ReactNode;
  params: { storeId: string };
}

// params are received from the url - in this case store.id
// which was passed from root layout
export default async function DashBoardLayout({
  children,
  params,
}: DashBoardLayoutProps) {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // loading first store with the given id
  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
      userId,
    },
  });

  if (!store) {
    redirect("/");
  }

  return (
    <>
      {/* NavBar will have access to params since its child of layout,
      which is the /storeId */}
      <NavBar />
      {children}
    </>
  );
}
