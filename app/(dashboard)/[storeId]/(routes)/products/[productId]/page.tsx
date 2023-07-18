import prismadb from "@/lib/prismadb";
import ProductForm from "./components/ProductForm";

interface ProductsPageProps {
  params: {
    productId: string;
    storeId: string;
  };
}

// params always available on server side, and we have billboardId since
// we are inside [billboardId]

export default async function ProductPage({ params }: ProductsPageProps) {
  const product = await prismadb.product.findUnique({
    where: {
      id: params.productId,
    },
    include: {
      images: true,
    },
  });

  const categories = await prismadb.category.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  const sizes = await prismadb.size.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  const colors = await prismadb.color.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  return (
    <div className=" flex-col">
      <div className=" flex-1 space-y-4 p-8 pt-6">
        <ProductForm
          product={product}
          categories={categories}
          sizes={sizes}
          colors={colors}
        />
      </div>
    </div>
  );
}
