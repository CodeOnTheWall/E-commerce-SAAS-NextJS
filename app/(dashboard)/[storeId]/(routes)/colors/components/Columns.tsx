"use client";

import { ColumnDef } from "@tanstack/react-table";
import CellAction from "./CellAction";

// Data table from shadcn
// this is step 1 Column Definitions
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ColorColumn = {
  // id of the individual size
  id: string;
  name: string;
  value: string;
  createdAt: string;
};

// header is what is shown
export const Columns: ColumnDef<ColorColumn>[] = [
  {
    // accessorKeys correspond to the key in the data object
    // that contains the value for that column
    // hence label and createdAt are types of the formattedBillboards
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "value",
    header: "Value",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },

  {
    id: "actions",
    // row represents a row of data in the data table, and row.original
    // provides access to the original data object associated with
    // that row. These properties are used in the code to pass the
    // row's original data to the CellAction component for further
    // processing or rendering.
    // the original data object is the BillboardColumn type
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
