/* eslint-disable react-hooks/incompatible-library */
"use client";

import { getExportUrl, type LeadFilters } from "@/lib/dashboard/queries";
import type { DashboardLead, DashboardSearchJob } from "@/lib/dashboard/types";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table";
import { Download, Loader2, RefreshCw } from "lucide-react";
import { useMemo, useState } from "react";
import { leadColumns } from "./leadsTableColumn";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type LeadsTableProps = {
  leads: DashboardLead[];
  jobs: DashboardSearchJob[];
  filters: LeadFilters;
  isLoading: boolean;
  onFiltersChange: (filters: LeadFilters) => void;
  onRefresh: () => void;
};

export function LeadsTable({
  leads,
  jobs,
  filters,
  isLoading,
  onFiltersChange,
  onRefresh,
}: LeadsTableProps) {
  "use no memo";
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo(() => leadColumns, []);

  const table = useReactTable({
    data: leads,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  function updateFilter(key: keyof LeadFilters, value: string) {
    onFiltersChange({
      ...filters,
      [key]: value === "all" ? undefined : value,
    });
  }

  return (
    <Card className="rounded-3xl">
      <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <CardTitle>Lead intelligence directory</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            {leads.length} leads loaded.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={onRefresh} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 size-4" />
            )}
            Refresh
          </Button>

          <Button asChild>
            <a href={getExportUrl(filters)}>
              <Download className="mr-2 size-4" />
              Export CSV
            </a>
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="mb-6 grid gap-3 md:grid-cols-2 lg:grid-cols-6">
          <Input
            value={filters.q ?? ""}
            onChange={(event) => updateFilter("q", event.target.value)}
            placeholder="Search business..."
            className="lg:col-span-2"
          />

          <Select
            value={filters.score ?? "all"}
            onValueChange={(value) => updateFilter("score", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="AI score" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All scores</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.website ?? "all"}
            onValueChange={(value) => updateFilter("website", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Website" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any website</SelectItem>
              <SelectItem value="has-website">Has website</SelectItem>
              <SelectItem value="missing-website">Missing website</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.contact ?? "all"}
            onValueChange={(value) => updateFilter("contact", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Contact" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any contact</SelectItem>
              <SelectItem value="has-whatsapp">Has WhatsApp</SelectItem>
              <SelectItem value="no-contact">No contact info</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.sort ?? "newest"}
            onValueChange={(value) => updateFilter("sort", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="opportunity">Opportunity</SelectItem>
              <SelectItem value="rating-asc">Rating ascending</SelectItem>
              <SelectItem value="reviews-asc">Reviews ascending</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.jobId ?? "all"}
            onValueChange={(value) => updateFilter("jobId", value)}
          >
            <SelectTrigger className="lg:col-span-2">
              <SelectValue placeholder="Job" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All jobs</SelectItem>
              {jobs.map((job) => (
                <SelectItem key={job.id} value={job.id}>
                  {new Date(job.created_at).toLocaleString()} · {job.status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-hidden rounded-2xl border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="align-top">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-32 text-center text-muted-foreground"
                  >
                    No leads found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
