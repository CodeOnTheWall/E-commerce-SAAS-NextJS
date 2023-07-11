"use client";

import { useState } from "react";

import { Button } from "./button";
import { Input } from "@/components/ui/input";

// step 2 of Data Table from shadcn
import {
  ColumnDef,
  // had to add this for filtering
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  // had to add this for filtering
  getFilteredRowModel,
  // had to add this for pagination
  // via pagination steps in shadcn
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  // added this
  searchKey: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  // added this
  searchKey,
}: DataTableProps<TData, TValue>) {
  // filtering
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // making the table via passed in columns and data
  const table = useReactTable({
    data,
    columns,

    getCoreRowModel: getCoreRowModel(),
    // had to add this for pagination
    getPaginationRowModel: getPaginationRowModel(),
    // filtering
    getFilteredRowModel: getFilteredRowModel(),
    // filtering
    onColumnFiltersChange: setColumnFilters,
    state: {
      columnFilters,
    },
  });

  return (
    <div>
      {/* filtering */}
      <div className="flex items-center py-4">
        <Input
          placeholder="Search"
          // using searchKey for filtering
          value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn(searchKey)?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          {/* uses the Columns */}
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          {/* uses the Data */}
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
