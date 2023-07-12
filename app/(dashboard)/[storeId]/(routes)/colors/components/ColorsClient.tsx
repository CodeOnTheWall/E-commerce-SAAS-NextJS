"use client";

import { useParams, useRouter } from "next/navigation";

import { Plus } from "lucide-react";

import Heading from "@/components/ui/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/DataTable";
import { ColorColumn, Columns } from "./Columns";
import ApiList from "@/components/ui/ApiList";

interface ColorsClientProps {
  formattedColors: ColorColumn[];
}

export default function ColorsClient({ formattedColors }: ColorsClientProps) {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className=" flex items-center justify-between">
        <Heading
          title={`Colors (${formattedColors.length})`}
          description="Manage colors for your store"
        />
        <Button
          // although at the end its /new, nextjs will look for closest,
          // so if no /new, will route to /[billboardid]
          // doing this so that if no billboard, new form
          onClick={() => router.push(`/${params.storeId}/colors/new`)}
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
        data={formattedColors}
      />
      <Heading title="API" description="API calls for Colors" />
      <Separator />
      <ApiList entityName="colors" entityIdName="colorId" />
    </>
  );
}
