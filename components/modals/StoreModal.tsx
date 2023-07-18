"use client";

import { useState } from "react";

import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// all dl from shadcn, including react-hook-form as its built into shadcns form
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Modal from "../ui/Modal";
import { useStoreModal } from "@/hooks/UseStoreModal";

// zod schemas
const formSchema = z.object({
  // must have name property that is a string with a min length of 1 char
  // if not this, the FormMessage is auto updated to reflect the zod validation
  name: z.string().min(1, {
    message: "Store name must be at least 1 character",
  }),
});
// z.infer is used to extract the type info from a zod schema
// and the type to be extracted is typeof formSchema
// extract the inferred type
type FormSchema = z.infer<typeof formSchema>;

export default function StoreModal() {
  // zustand state management
  const isOpen = useStoreModal((state) => state.isOpen);
  const onClose = useStoreModal((state) => state.onClose);

  const [isloading, setIsLoading] = useState(false);

  // 1. Define Form
  // methods on form i.e. form.handleSubmit are from the react-hook-form lib
  // all this is directly from shadcn form docs
  const form = useForm<FormSchema>({
    // resolver function from react-hook-lib allows integration with
    // external validation libs like zod
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  // 2. Define Submit Handler
  const onSubmit = async (values: FormSchema) => {
    try {
      setIsLoading(true);

      const response = await fetch("/api/stores", {
        method: "POST",
        body: JSON.stringify({
          name: values.name,
        }),
      });

      const responseData = await response.json();
      // toast.success(`E-commerce store ${responseData.name} created`);
      // router.push(`/${responseData.id}`);
      // other method that has less bugs since it causes a full page reload
      // with method below, the modal goes away
      window.location.assign(`/${responseData.id}`);
    } catch (error) {
      toast.error(`Something went wrong, error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title="Create Store"
      description="Add a new store to manage products and categories"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="py-2 pb-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              // ctrl click to see the field prop from react-hook-form
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      // disabled if loading
                      disabled={isloading}
                      placeholder="E-Commerce"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className=" pt-6 space-x-2 flex items-center justify-end w-full">
              {/* disable buttons if loading */}
              <Button disabled={isloading} variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button disabled={isloading} type="submit">
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Modal>
  );
}
