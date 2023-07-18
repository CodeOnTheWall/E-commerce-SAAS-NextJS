import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";

import { redirect } from "next/navigation";

interface SetupLayoutProps {
  children: React.ReactNode;
}

export default async function SetupLayout({ children }: SetupLayoutProps) {
  // check for current active user
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // if user
  // loading first store available with logged in user
  const store = await prismadb.store.findFirst({
    where: {
      userId,
    },
  });
  // console.log(store);

  //   if that store exists, redirect to that store
  if (store) {
    redirect(`/${store.id}`);
  }

  // Modal will open since children of this is the page.tsx, which makes the modal open
  // but if theres a store, we go to that stores id, and no model is opened
  return <>{children}</>;
}
