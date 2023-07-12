import prismadb from "@/lib/prismadb";
import { format } from "date-fns";

import CategoryClient from "./components/CategoryClient";

export default async function CategoriesPage({
  params,
}: {
  params: { storeId: string };
}) {
  const categories = await prismadb.category.findMany({
    where: {
      storeId: params.storeId,
    },
    // populating billboard relation
    include: {
      billboard: true,
    },
    orderBy: {
      // order by newest
      createdAt: "desc",
    },
  });

  // formattedBillboards is an array
  // id is the id of the billboard
  const formattedCategories = categories.map((category) => ({
    id: category.id,
    name: category.name,
    billboardLabel: category.billboard.label,
    createdAt: format(category.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className=" flex-1 space-y-4 p-8 pt-6">
        <CategoryClient formattedCategories={formattedCategories} />
      </div>
    </div>
  );
}
