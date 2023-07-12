"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Size } from "@prisma/client";
import { toast } from "react-hot-toast";
import { Trash } from "lucide-react";

import Heading from "@/components/ui/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import AlertModal from "@/components/modals/AlertModal";
import ImageUpload from "@/components/ui/ImageUpload";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const sizeFormValuesSchema = z.object({
  name: z.string().min(1),
  value: z.string().min(1),
});
type SizeFormValuesSchema = z.infer<typeof sizeFormValuesSchema>;

interface SizeFormProps {
  size: Size | null;
}

export default function SizeForm({ size }: SizeFormProps) {
  // could use useParams to get from url, but already passing in the store
  // so can just do store.id
  // const params = useParams();

  const router = useRouter();
  const params = useParams();

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const title = size ? "Edit size" : "Create size";
  const description = size ? "Edit a size" : "Add a new size";
  const toastMessage = size ? "Size updated" : "Size created.";
  const action = size ? "Save changes" : "Create";

  const form = useForm<SizeFormValuesSchema>({
    resolver: zodResolver(sizeFormValuesSchema),
    // form will be pre populated with defaultValues
    defaultValues: size || {
      name: "",
      value: "",
    },
  });

  const onSubmit = async (formInputData: SizeFormValuesSchema) => {
    try {
      setIsLoading(true);

      if (size) {
        const response = await fetch(
          `/api/${params.storeId}/sizes/${params.sizeId}`,
          {
            method: "PATCH",
            body: JSON.stringify({
              name: formInputData.name,
              value: formInputData.value,
            }),
          }
        );

        // else its for a new size
      } else {
        const response = await fetch(`/api/${params.storeId}/sizes`, {
          method: "POST",
          body: JSON.stringify({
            name: formInputData.name,
            value: formInputData.value,
          }),
        });
      }

      // to see the navbar reload with name
      router.refresh();
      router.push(`/${params.storeId}/sizes`);
      toast.success(toastMessage);
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);
      await fetch(`/api/${params.storeId}/sizes/${params.sizeId}`, {
        method: "DELETE",
      });
      router.refresh();
      router.push(`/${params.storeId}/sizes`);
      toast.success("Size deleted");
    } catch (error) {
      toast.error("Make sure you removed all products using this size first");
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
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {size && (
          <Button
            disabled={isLoading}
            variant="destructive"
            size="icon"
            onClick={() => setIsOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className=" space-y-8 w-full"
        >
          <div className=" grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Size name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Size value"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={isLoading} className=" ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
      <Separator />
    </>
  );
}
