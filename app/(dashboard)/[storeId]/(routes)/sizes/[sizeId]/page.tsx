import prismadb from "@/lib/prismadb";
import SizeForm from "./components/SizeForm";

interface SizePageProps {
  params: {
    sizeId: string;
  };
}

// params always available on server side, and we have billboardId since
// we are inside [billboardId]

export default async function SizePage({ params }: SizePageProps) {
  const size = await prismadb.size.findUnique({
    where: {
      id: params.sizeId,
    },
  });

  return (
    <div className=" flex-col">
      <div className=" flex-1 space-y-4 p-8 pt-6">
        <SizeForm size={size} />
      </div>
    </div>
  );
}
