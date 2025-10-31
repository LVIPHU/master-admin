'use client'

import * as React from 'react'
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Header,
  SortingState,
  useReactTable,
  VisibilityState,
  type Table as ReactTable,
} from '@tanstack/react-table'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableRow } from '@/components/ui/table'
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  Columns2Icon,
  InfoIcon,
  MinusIcon,
  PlusIcon,
} from 'lucide-react'
import { cn } from '@/packages/utils/styles'
import { BuyerCommissionRow, useBuyerCommission } from '@/providers/buyer-commission.provider'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

export function DataTable() {
  const { data, updateCell, addPackage, removePackage } = useBuyerCommission()
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 5,
  })

  const columnsCommission: ColumnDef<BuyerCommissionRow>[] = [
    {
      accessorKey: 'package',
      id: 'Buyer Commission Package',
      header: 'Buyer Commission Package',
      cell: ({ row }) => <p className='px-3 text-right'>{row.original.package}</p>,
      enableHiding: false,
    },
    {
      accessorKey: 'amountTBC',
      id: 'Buyer Commission Amount (TBC)',
      header: 'Buyer Commission Amount (TBC)',
      cell: ({ row }) => (
        <form
          className='flex items-center justify-end bg-green-200'
          onSubmit={(e) => {
            e.preventDefault()

            const input = e.currentTarget.querySelector('input')
            const value = input?.value

            if (!value) return

            updateCell('buyerCommissionAmount', row.index, Number(value))

            toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
              loading: `Saving ${row.original.package}`,
              success: 'Done',
              error: 'Error',
            })
          }}
        >
          <Label htmlFor={`${row.original.package}-buyer-commission-amount`} className='sr-only'>
            Target
          </Label>
          <Input
            className='hover:bg-input/30 focus-visible:bg-background dark:hover:bg-input/30 dark:focus-visible:bg-input/30 h-8 w-16 border-transparent bg-transparent text-right shadow-none focus-visible:border dark:bg-transparent'
            defaultValue={row.original.amountTBC}
            id={`${row.original.package}-buyer-commission-amount`}
          />
        </form>
      ),
    },
    {
      accessorKey: 'valueUSD',
      id: 'Buyer Commission Value',
      header: () => (
        <div className='flex items-center gap-2'>
          <p>Buyer Commission Value</p>
          <Tooltip>
            <TooltipTrigger asChild>
              <InfoIcon size={12} />
            </TooltipTrigger>
            <TooltipContent>Buyer Commission Amount x TBC Price</TooltipContent>
          </Tooltip>
        </div>
      ),
      cell: ({ row }) => (
        <p className='px-3 text-right'>
          {new Intl.NumberFormat('en', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(row.original.valueUSD)}
        </p>
      ),
    },
    {
      accessorKey: 'finalPercent',
      id: 'Final Buyer Commission',
      header: () => (
        <div className='flex items-center gap-2'>
          <p>Final Buyer Commission</p>
          <Tooltip>
            <TooltipTrigger asChild>
              <InfoIcon size={12} />
            </TooltipTrigger>
            <TooltipContent>Total Buyer Commission + Event Buyer Commission</TooltipContent>
          </Tooltip>
        </div>
      ),
      cell: ({ row }) => (
        <form
          className='flex items-center justify-end bg-green-200'
          onSubmit={(e) => {
            e.preventDefault()
            toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
              loading: `Saving ${row.original.package}`,
              success: 'Done',
              error: 'Error',
            })
          }}
        >
          <Label htmlFor={`${row.original.package}-final-buyer-commission`} className='sr-only'>
            final-buyer-commission
          </Label>
          <Input
            className='hover:bg-input/30 focus-visible:bg-background dark:hover:bg-input/30 dark:focus-visible:bg-input/30 h-8 w-16 border-transparent bg-transparent text-right shadow-none focus-visible:border dark:bg-transparent'
            defaultValue={row.original.finalPercent}
            id={`${row.original.package}-final-buyer-commission`}
          />
          <p>%</p>
        </form>
      ),
    },
    {
      id: 'title_0',
      header: 'Buyer Standard Commision',
      cell: () => {
        return null
      },
    },
    {
      accessorKey: 'package',
      id: 'Buyer Commission Package',
      header: 'Buyer Commission Package',
      cell: ({ row }) => <p className='px-3 text-right'>{row.original.package}</p>,
      enableHiding: false,
    },
    {
      accessorKey: 'standardPercent',
      id: 'Buyer Standard Commission',
      header: 'Buyer Standard Commission',
      cell: ({ row }) => (
        <form
          className='flex items-center justify-end bg-green-200'
          onSubmit={(e) => {
            e.preventDefault()
            const input = e.currentTarget.querySelector('input')
            const value = input?.value

            if (!value) return

            updateCell('buyerStandardCommissionPercent', row.index, Number(value))
            toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
              loading: `Saving ${row.original.standardPercent}`,
              success: 'Done',
              error: 'Error',
            })
          }}
        >
          <Label htmlFor={`${row.original.package}-standard-percent`} className='sr-only'>
            Target
          </Label>
          <Input
            className='hover:bg-input/30 focus-visible:bg-background dark:hover:bg-input/30 dark:focus-visible:bg-input/30 h-8 w-16 border-transparent bg-transparent text-right shadow-none focus-visible:border dark:bg-transparent'
            defaultValue={row.original.standardPercent}
            id={`${row.original.package}-standard-percent`}
          />
          <p>%</p>
        </form>
      ),
    },
    {
      accessorKey: 'standardAmountTBC',
      id: 'Buyer Standard Commission Amount (TBC)',
      header: 'Buyer Standard Commission Amount (TBC)',
      cell: ({ row }) => <p className='px-3 text-right'>{row.original.standardAmountTBC}</p>,
    },
    {
      accessorKey: 'standardValueUSD',
      id: 'Buyer Standard Commission Value',
      header: () => (
        <div className='flex items-center gap-2'>
          <p>Buyer Standard Commission Value</p>
          <Tooltip>
            <TooltipTrigger asChild>
              <InfoIcon size={12} />
            </TooltipTrigger>
            <TooltipContent>Buyer Standard Commission Amount x TBC Price</TooltipContent>
          </Tooltip>
        </div>
      ),
      cell: ({ row }) => (
        <p className='px-3 text-right'>
          {new Intl.NumberFormat('en', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(row.original.standardValueUSD)}
        </p>
      ),
    },
    {
      id: 'title_1',
      header: 'Extra Buyer Commission',
      cell: () => {
        return null
      },
    },
    {
      accessorKey: 'discountPercent',
      id: 'Package 1 Discount',
      header: 'Package 1 Discount',
      cell: ({ row }) => (
        <form
          className='flex items-center justify-end bg-green-200'
          onSubmit={(e) => {
            e.preventDefault()
            const input = e.currentTarget.querySelector('input')
            const value = input?.value

            if (!value) return

            updateCell('packageDiscountPercent', row.index, Number(value))
            toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
              loading: `Saving ${row.original.discountPercent}`,
              success: 'Done',
              error: 'Error',
            })
          }}
        >
          <Label htmlFor={`${row.original.package}-discount-percent`} className='sr-only'>
            Target
          </Label>
          <Input
            className='hover:bg-input/30 focus-visible:bg-background dark:hover:bg-input/30 dark:focus-visible:bg-input/30 h-8 w-16 border-transparent bg-transparent text-right shadow-none focus-visible:border dark:bg-transparent'
            defaultValue={row.original.discountPercent}
            id={`${row.original.package}-discount-percent`}
          />
          <p>%</p>
        </form>
      ),
    },
    {
      accessorKey: 'discountAmountTBC',
      id: 'Package 1 Discount Amount (TBC)',
      header: 'Package 1 Discount Amount (TBC)',
      cell: ({ row }) => <p className='px-3 text-right'>{row.original.discountAmountTBC}</p>,
    },
    {
      accessorKey: 'discountValueUSD',
      id: 'Package 1 Discount Value',
      header: () => (
        <div className='flex items-center gap-2'>
          <p>Package 1 Discount Value</p>
          <Tooltip>
            <TooltipTrigger asChild>
              <InfoIcon size={12} />
            </TooltipTrigger>
            <TooltipContent>Package 1 Discount Amount * TBC Price</TooltipContent>
          </Tooltip>
        </div>
      ),
      cell: ({ row }) => (
        <p className='px-3 text-right'>
          {new Intl.NumberFormat('en', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(row.original.discountValueUSD)}
        </p>
      ),
    },
    {
      accessorKey: 'discountValuePerPackage',
      id: 'Package 1 Discount Value per Package',
      header: () => (
        <div className='flex items-center gap-2'>
          <p>Package 1 Discount Value per Package</p>
          <Tooltip>
            <TooltipTrigger asChild>
              <InfoIcon size={12} />
            </TooltipTrigger>
            <TooltipContent>Package 1 Discount Value / Buyer Commission Package</TooltipContent>
          </Tooltip>
        </div>
      ),
      cell: ({ row }) => (
        <p className='px-3 text-right'>
          {new Intl.NumberFormat('en', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(row.original.discountValuePerPackage)}
        </p>
      ),
    },
    {
      accessorKey: 'extraPercent',
      id: 'Extra Buyer Commission',
      header: () => (
        <div className='flex items-center gap-2'>
          <p>Extra Buyer Commission</p>
          <Tooltip>
            <TooltipTrigger asChild>
              <InfoIcon size={12} />
            </TooltipTrigger>
            <TooltipContent>Package 1 Discount Amount / Buyer Commission Amount</TooltipContent>
          </Tooltip>
        </div>
      ),
      cell: ({ row }) => <p className='px-3 text-right'>{row.original.extraPercent} %</p>,
    },
    {
      id: 'title_2',
      header: 'Total Buyer Commission',
      cell: () => {
        return null
      },
    },
    {
      accessorKey: 'totalValueUSD',
      id: 'Total Buyer Commission Value',
      header: () => (
        <div className='flex items-center gap-2'>
          <p>Total Buyer Commission Value</p>
          <Tooltip>
            <TooltipTrigger asChild>
              <InfoIcon size={12} />
            </TooltipTrigger>
            <TooltipContent>Buyer Standard Commission Value + Package 1 Discount Value</TooltipContent>
          </Tooltip>
        </div>
      ),
      cell: ({ row }) => (
        <p className='px-3 text-right'>
          {new Intl.NumberFormat('en', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(row.original.totalValueUSD)}
        </p>
      ),
    },
    {
      accessorKey: 'totalPercent',
      id: 'Total Buyer Commission',
      header: () => (
        <div className='flex items-center gap-2'>
          <p>Total Buyer Commission</p>
          <Tooltip>
            <TooltipTrigger asChild>
              <InfoIcon size={12} />
            </TooltipTrigger>
            <TooltipContent>Buyer Standard Commission + Extra Buyer Commission</TooltipContent>
          </Tooltip>
        </div>
      ),
      cell: ({ row }) => <p className='px-3 text-right'>{row.original.totalPercent} %</p>,
    },
  ]

  const table = useReactTable({
    data,
    columns: columnsCommission,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.package.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  return (
    <div className='flex w-full flex-col justify-start gap-8'>
      <div className='flex items-center justify-between px-4 lg:px-6'>
        <h1 className='text-xl font-semibold'>Buyer Commission Package</h1>
        <div className='flex items-center gap-2'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' size='sm'>
                <Columns2Icon />
                <span className='hidden lg:inline'>Customize Columns</span>
                <span className='lg:hidden'>Columns</span>
                <ChevronDownIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-56'>
              {table
                .getAllColumns()
                .filter((column) => typeof column.accessorFn !== 'undefined' && column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className='capitalize'
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant='outline' size='sm' onClick={addPackage}>
            <PlusIcon />
            <span className='hidden lg:inline'>Add Package</span>
          </Button>
          <Button variant='outline' size='sm' onClick={() => removePackage(data.length - 1)}>
            <MinusIcon />
            <span className='hidden lg:inline'>Remove Package</span>
          </Button>
        </div>
      </div>
      <div className='relative flex flex-col gap-4 overflow-auto px-4 lg:px-6'>
        <div className='overflow-hidden rounded-lg border'>
          <Table>
            <TableBody>
              {table
                .getHeaderGroups()
                .map((headerGroup) =>
                  headerGroup.headers
                    .slice(0, 4)
                    .map((header) => <DraggableVerticalRow key={header.id} header={header} table={table} />)
                )}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className='relative flex flex-col gap-4 overflow-auto px-4 lg:px-6'>
        <div className='overflow-hidden rounded-lg border'>
          <Table>
            <TableBody>
              {table
                .getHeaderGroups()
                .map((headerGroup) =>
                  headerGroup.headers
                    .slice(4, headerGroup.headers.length)
                    .map((header) => <DraggableVerticalRow key={header.id} header={header} table={table} />)
                )}
            </TableBody>
          </Table>
        </div>
        <div className='flex items-center justify-between px-4'>
          <div className='text-muted-foreground hidden flex-1 text-sm lg:flex'>
            {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)
            selected.
          </div>
          <div className='flex w-full items-center gap-8 lg:w-fit'>
            <div className='hidden items-center gap-2 lg:flex'>
              <Label htmlFor='rows-per-page' className='text-sm font-medium'>
                Rows per page
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value))
                }}
              >
                <SelectTrigger size='sm' className='w-20' id='rows-per-page'>
                  <SelectValue placeholder={table.getState().pagination.pageSize} />
                </SelectTrigger>
                <SelectContent side='top'>
                  {[5, 10, 15, 20, 25].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className='flex w-fit items-center justify-center text-sm font-medium'>
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </div>
            <div className='ml-auto flex items-center gap-2 lg:ml-0'>
              <Button
                variant='outline'
                className='hidden h-8 w-8 p-0 lg:flex'
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className='sr-only'>Go to first page</span>
                <ChevronsLeftIcon />
              </Button>
              <Button
                variant='outline'
                className='size-8'
                size='icon'
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className='sr-only'>Go to previous page</span>
                <ChevronLeftIcon />
              </Button>
              <Button
                variant='outline'
                className='size-8'
                size='icon'
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className='sr-only'>Go to next page</span>
                <ChevronRightIcon />
              </Button>
              <Button
                variant='outline'
                className='hidden size-8 lg:flex'
                size='icon'
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className='sr-only'>Go to last page</span>
                <ChevronsRightIcon />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function DraggableVerticalRow({
  header,
  table,
}: {
  header: Header<BuyerCommissionRow, unknown>
  table: ReactTable<BuyerCommissionRow>
}) {
  const isTitle = header.id.includes('title')
  return (
    <TableRow
      key={header.id}
      className={cn(
        isTitle && 'bg-neutral-100',
        'relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80'
      )}
    >
      <TableHead align={'left'}>{flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
      {table.getRowModel().rows.map((row) => {
        const cell = row.getVisibleCells().find((c) => c.column.id === header.column.id)
        return (
          <TableCell key={row.id}>{cell ? flexRender(cell.column.columnDef.cell, cell.getContext()) : null}</TableCell>
        )
      })}
    </TableRow>
  )
}
