"use client";

import { useParams, useRouter } from "next/navigation";

import { Plus } from "lucide-react";

import Heading from "@/components/ui/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/DataTable";
import { BillboardColumn, Columns } from "./Columns";
import ApiList from "@/components/ui/ApiList";

interface BillboardClientProps {
  formattedBillboards: BillboardColumn[];
}

export default function BillboardClient({
  formattedBillboards,
}: BillboardClientProps) {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className=" flex items-center justify-between">
        <Heading
          title={`Billboards (${formattedBillboards.length})`}
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
      <DataTable
        searchKey="label"
        // columns from Column Definition in Columns
        columns={Columns}
        // data is data to be seen inside the Columns
        data={formattedBillboards}
      />
      <Heading title="API" description="API calls for Billboards" />
      <Separator />
      <ApiList entityName="billboards" entityIdName="billboardId" />
    </>
  );
}
