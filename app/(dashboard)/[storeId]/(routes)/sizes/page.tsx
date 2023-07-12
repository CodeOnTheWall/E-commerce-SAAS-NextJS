import prismadb from "@/lib/prismadb";
import { format } from "date-fns";

import SizesClient from "./components/SizesClient";

export default async function SizesPage({
  params,
}: {
  params: { storeId: string };
}) {
  const sizes = await prismadb.size.findMany({
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
  const formattedSizes = sizes.map((size) => ({
    id: size.id,
    name: size.name,
    value: size.value,
    createdAt: format(size.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className=" flex-1 space-y-4 p-8 pt-6">
        <SizesClient formattedSizes={formattedSizes} />
      </div>
    </div>
  );
}
