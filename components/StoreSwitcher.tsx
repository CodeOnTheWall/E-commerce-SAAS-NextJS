"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { Store } from "@prisma/client";

import { useStoreModal } from "@/hooks/UseStoreModal";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Check,
  ChevronsUpDown,
  PlusCircle,
  Store as StoreIcon,
} from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./ui/command";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface StoreSwitcherProps extends PopoverTriggerProps {
  stores: Store[];
}

// each store should look like this:
// model Store {
//     // from form
//     name String
//     // from clerk
//     userId String
//     // below 3 created by prisma (id of store etc)
//     id String @id @default(uuid())
//     createdAt DateTime @default(now())
//     updatedAt DateTime @updatedAt
//   }
export default function StoreSwitcher({
  className,
  stores = [],
}: StoreSwitcherProps) {
  // if this gets called, the store
  const onOpen = useStoreModal((state) => state.onOpen);

  const params = useParams();
  const router = useRouter();

  // formattedItems is an array, where each store has a name and id
  // id is for key and param purposes
  const formattedStores = stores.map((store) => ({
    name: store.name,
    id: store.id,
  }));

  // find the store that has the same id as params.storeId
  // since this will be the current active/selected store
  const currentStore = formattedStores.find(
    (store) => store.id === params.storeId
  );

  // state of popover
  const [open, setOpen] = useState(false);

  interface FormattedStoreProps {
    id: string;
    name: string;
  }

  const onStoreSelect = (store: FormattedStoreProps) => {
    // once we click on a diff store, we will close the store switcher
    // and redirect to that store id
    setOpen(false);
    router.push(`/${store.id}`);
  };

  return (
    // remind that open and onOpenChange are props expected for
    // this shadcn component
    <Popover open={open} onOpenChange={setOpen}>
      {/* asChild is needed to avoid hydration errors */}
      {/* recommended to use with Trigger from shadcn docs when
      using non default react components */}
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="lg"
          // comboboxrole identifies an element a san input that controls other elements
          // that can dynamically pop up to help te user set the value of that input
          role="combobox"
          aria-expanded={open}
          aria-label="Select a store"
          className={`w-[200px] justify-between ${className}`}
        >
          <StoreIcon className=" mr-2 h-4 w-4" />
          {currentStore?.name}
          {/* ml-auto pushes all the way to the right
          shrink0 so that it doesnt shrink to fit available space */}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className=" w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search store..." />
            <CommandEmpty>No store found.</CommandEmpty>
            <CommandGroup heading="Stores">
              {formattedStores.map((store) => (
                <CommandItem
                  key={store.id}
                  onSelect={() => onStoreSelect(store)}
                  className=" text-sm"
                >
                  <StoreIcon className=" mr-2 h-4 w-4" />
                  {store.name}
                  <Check
                    className={`ml-auto h-4 w-4 ${
                      currentStore?.id === store.id
                        ? "opacity-100"
                        : "opacity-0"
                    }`}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setOpen(false);
                  onOpen();
                }}
              >
                <PlusCircle className=" mr-2 h-5 w-5" />
                Create Store
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
