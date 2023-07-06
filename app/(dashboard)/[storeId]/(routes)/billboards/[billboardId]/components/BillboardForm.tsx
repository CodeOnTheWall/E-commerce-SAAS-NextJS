"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Billboard } from "@prisma/client";
import { toast } from "react-hot-toast";
import { Trash } from "lucide-react";

import UseOrigin from "@/hooks/UseOrigin";
import Heading from "@/components/ui/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import AlertModal from "@/components/modals/AlertModal";
import ApiAlert from "@/components/ui/ApiAlert";
import ImageUpload from "@/components/ui/ImageUpload";

const billboardFormValuesSchema = z.object({
  label: z.string().min(1),
  imageUrl: z.string().min(1),
});
type BillboardFormValuesSchema = z.infer<typeof billboardFormValuesSchema>;

interface BillboardFormProps {
  billboard: Billboard | null;
}

export default function BillBoardForm({ billboard }: BillboardFormProps) {
  // could use useParams to get from url, but already passing in the store
  // so can just do store.id
  // const params = useParams();

  const router = useRouter();
  const params = useParams();
  // using to not get hydration error. The hook is essentially only working
  // if the window object is available, meaning the ssr is complete
  const origin = UseOrigin();

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const title = billboard ? "Edit billboard" : "Create billboard";
  const description = billboard ? "Edit a billboard" : "Add a new billboard";
  const toastMessage = billboard ? "Billboard updated" : "Billboard created.";
  const action = billboard ? "Save changes" : "Create";

  const form = useForm<BillboardFormValuesSchema>({
    resolver: zodResolver(billboardFormValuesSchema),
    // form will be pre populated with defaultValues
    defaultValues: billboard || {
      label: "",
      imageUrl: "",
    },
  });

  const onSubmit = async (formInputData: BillboardFormValuesSchema) => {
    try {
      setIsLoading(true);

      if (billboard) {
        await fetch(`/api/${params.storeId}/billboards`, {
          method: "PATCH",
          body: JSON.stringify({
            label: formInputData.label,
          }),
        });
      } else {
        await fetch(`/api/${params.storeId}/billboards`, {
          method: "POST",
          body: JSON.stringify({
            label: formInputData.label,
          }),
        });
      }

      // to see the navbar reload with name
      router.refresh();
      toast.success("Store updated");
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);
      await fetch(`/api/stores/${store.id}`, {
        method: "DELETE",
      });
      router.refresh();
      router.push("/");
      toast.success("Store deleted");
    } catch (error) {
      toast.error("Make sure you removed all products and categories first");
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
        {billboard && (
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
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background image</FormLabel>
                <FormControl>
                  {/* billboard takes 1 img but image upload expects an array */}
                  <ImageUpload
                    disabled={isLoading}
                    onChange={(url) => field.onChange(url)}
                    onRemove={() => field.onChange("")}
                    value={field.value ? [field.value] : []}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className=" grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Billboard label"
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
