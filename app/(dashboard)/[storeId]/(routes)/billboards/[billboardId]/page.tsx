import prismadb from "@/lib/prismadb";
import BillBoardForm from "./components/BillboardForm";

interface BillBoardPageProps {
  params: {
    billboardId: string;
  };
}

// params always available on server side, and we have billboardId since
// we are inside [billboardId]

export default async function BillboardPage({ params }: BillBoardPageProps) {
  const billboard = await prismadb.billboard.findUnique({
    where: {
      id: params.billboardId,
    },
  });

  return (
    <div className=" flex-col">
      <div className=" flex-1 space-y-4 p-8 pt-6">
        <BillBoardForm billboard={billboard} />
      </div>
    </div>
  );
}
