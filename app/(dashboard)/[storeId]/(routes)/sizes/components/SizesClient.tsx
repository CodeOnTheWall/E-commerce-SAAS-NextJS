"use client";

import { useParams, useRouter } from "next/navigation";

import { Plus } from "lucide-react";

import Heading from "@/components/ui/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/DataTable";
import { SizeColumn, Columns } from "./Columns";
import ApiList from "@/components/ui/ApiList";

interface SizeClientProps {
  formattedSizes: SizeColumn[];
}

export default function SizesClient({ formattedSizes }: SizeClientProps) {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className=" flex items-center justify-between">
        <Heading
          title={`Sizes (${formattedSizes.length})`}
          description="Manage sizes for your store"
        />
        <Button
          // although at the end its /new, nextjs will look for closest,
          // so if no /new, will route to /[billboardid]
          // doing this so that if no billboard, new form
          onClick={() => router.push(`/${params.storeId}/sizes/new`)}
        >
          <Plus className=" mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable
        searchKey="name"
        // columns from Column Definition in Columns
        columns={Columns}
        // data is data to be seen inside the Columns
        data={formattedSizes}
      />
      <Heading title="API" description="API calls for Sizes" />
      <Separator />
      <ApiList entityName="sizes" entityIdName="sizeId" />
    </>
  );
}
