import prismadb from "@/lib/prismadb";
import { formatter } from "@/lib/utils";
import { format } from "date-fns";

import ProductClient from "./components/ProductClient";
import { ProductColumn } from "./components/Columns";

export default async function ProductsPage({
  params,
}: {
  params: { storeId: string };
}) {
  const products = await prismadb.product.findMany({
    where: {
      storeId: params.storeId,
    },
    // to populate the entire models cat, size, and color
    include: {
      category: true,
      size: true,
      color: true,
    },
    orderBy: {
      // order by newest
      createdAt: "desc",
    },
  });

  // formattedProducts is an array
  // id is the id of the billboard
  const formattedProducts: ProductColumn[] = products.map((product) => ({
    id: product.id,
    name: product.name,
    isFeatured: product.isFeatured,
    isArchived: product.isArchived,
    price: formatter.format(product.price.toNumber()),
    category: product.category.name,
    size: product.size.name,
    color: product.color.value,
    createdAt: format(product.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className=" flex-1 space-y-4 p-8 pt-6">
        <ProductClient formattedProducts={formattedProducts} />
      </div>
    </div>
  );
}
