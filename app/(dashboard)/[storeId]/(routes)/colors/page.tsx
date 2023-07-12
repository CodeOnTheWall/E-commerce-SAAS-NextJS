import prismadb from "@/lib/prismadb";
import { format } from "date-fns";

import ColorsClient from "./components/ColorsClient";

export default async function ColorsPage({
  params,
}: {
  params: { storeId: string };
}) {
  const colors = await prismadb.color.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      // order by newest
      createdAt: "desc",
    },
  });

  // formattedColors is an array
  // id is the id of the billboard
  const formattedColors = colors.map((color) => ({
    id: color.id,
    name: color.name,
    value: color.value,
    createdAt: format(color.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className=" flex-1 space-y-4 p-8 pt-6">
        <ColorsClient formattedColors={formattedColors} />
      </div>
    </div>
  );
}
