import prismadb from "@/lib/prismadb";
import ColorForm from "./components/ColorForm";

interface ColorPageProps {
  params: {
    colorId: string;
  };
}

// params always available on server side, and we have billboardId since
// we are inside [billboardId]

export default async function ColorPage({ params }: ColorPageProps) {
  const color = await prismadb.color.findUnique({
    where: {
      id: params.colorId,
    },
  });

  return (
    <div className=" flex-col">
      <div className=" flex-1 space-y-4 p-8 pt-6">
        <ColorForm color={color} />
      </div>
    </div>
  );
}
