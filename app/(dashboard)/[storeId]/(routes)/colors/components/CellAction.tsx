"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColorColumn } from "./Columns";
import { Button } from "@/components/ui/button";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import AlertModal from "@/components/modals/AlertModal";

interface CellActionProps {
  data: ColorColumn;
}

export default function CellAction({ data }: CellActionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();
  const params = useParams();

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("Color Id copied to the clipboard");
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);
      await fetch(`/api/${params.storeId}/colors/${data.id}`, {
        method: "DELETE",
      });
      router.refresh();
      toast.success("Color deleted");
    } catch (error) {
      toast.error("Make sure you removed all products using this color first");
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={onDelete}
        isLoading={isLoading}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className=" h-8 w-8 p-0">
            {/* sr for screen readers */}
            <span className=" sr-only">Open Menu</span>
            <MoreHorizontal className=" h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onCopy(data.id)}>
            <Copy className=" mr-2 h-4 w-4" />
            Copy Id
          </DropdownMenuItem>
          <DropdownMenuItem
            // we have the id since the passed in data gets the id automatically
            // from the row
            onClick={() => router.push(`/${params.storeId}/colors/${data.id}`)}
          >
            <Edit className=" mr-2 h-4 w-4" />
            Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsOpen(true)}>
            <Trash className=" mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
