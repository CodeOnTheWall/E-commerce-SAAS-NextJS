"use client";

import { useParams, useRouter } from "next/navigation";

import { Plus } from "lucide-react";

import Heading from "@/components/ui/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function BillboardClient() {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className=" flex items-center justify-between">
        <Heading
          title="Billboards (0)"
          description="Manage billboards for your store"
        />
        <Button
          // although at the end its /new, nextjs will look for closest,
          // so if no /new, will route to /[billboardid]
          // doing this so that if no billboard, new form
          onClick={() => router.push(`/${params.storeId}/billboards/new`)}
        >
          <Plus className=" mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />
    </>
  );
}
