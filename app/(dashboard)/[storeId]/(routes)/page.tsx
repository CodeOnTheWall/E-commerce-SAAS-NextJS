import prismadb from "@/lib/prismadb";

interface DashBoardPageProps {
  params: { storeId: string };
}

// params are auto given by nextjs in the url params
export default async function DashBoardPage({ params }: DashBoardPageProps) {
  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
    },
  });

  return <div>{store?.name}</div>;
}
