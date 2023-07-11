import prismadb from "@/lib/prismadb";
import { format } from "date-fns";

import BillboardClient from "./components/BillboardClient";

export default async function BillBoardsPage({
  params,
}: {
  params: { storeId: string };
}) {
  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      // order by newest
      createdAt: "desc",
    },
  });

  // formattedBillboards is an array
  // id is the id of the billboard
  const formattedBillboards = billboards.map((billboard) => ({
    id: billboard.id,
    label: billboard.label,
    createdAt: format(billboard.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className=" flex-1 space-y-4 p-8 pt-6">
        <BillboardClient formattedBillboards={formattedBillboards} />
      </div>
    </div>
  );
}
