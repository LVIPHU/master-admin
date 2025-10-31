'use client'

import * as React from 'react'
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  DraggableAttributes,
} from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
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
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'
import { toast } from 'sonner'
import { z } from 'zod'

import { useIsMobile } from '@/hooks/use-mobile'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  CircleCheckIcon,
  Columns2Icon,
  EllipsisIcon,
  GripVerticalIcon,
  InfoIcon,
  MinusIcon,
  PlusIcon,
  TrendingUpIcon,
} from 'lucide-react'
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities'
import { cn } from '@/packages/utils/styles'
import { BuyerCommissionRow, useBuyerCommission } from '@/providers/buyer-commission.provider'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

export function DataTable() {
  const { data, updateCell, addPackage, removePackage } = useBuyerCommission()
  const [tabValue, setTabValue] = React.useState<string>('package')
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 5,
  })
  const sortableId = React.useId()
  const sensors = useSensors(useSensor(MouseSensor, {}), useSensor(TouchSensor, {}), useSensor(KeyboardSensor, {}))

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
  ]

  const columnsStandardCommission: ColumnDef<BuyerCommissionRow>[] = [
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
    columns: tabValue === 'package' ? columnsCommission : columnsStandardCommission,
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

  const [columnOrder, setColumnOrder] = React.useState<string[]>(() =>
    table
      .getAllColumns()
      .filter((column) => typeof column.accessorFn !== 'undefined')
      .map(({ id }) => id)
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    setColumnOrder((prev) => {
      const oldIndex = prev.indexOf(active.id as string)
      const newIndex = prev.indexOf(over.id as string)
      if (oldIndex === -1 || newIndex === -1 || newIndex === 0) return prev

      const newOrder = arrayMove(prev, oldIndex, newIndex)
      table.setColumnOrder(newOrder)
      console.log('order', newOrder)
      return newOrder
    })
  }

  console.log('data', data)

  return (
    <Tabs value={tabValue} onValueChange={setTabValue} className='w-full flex-col justify-start gap-6'>
      <div className='flex items-center justify-between px-4 lg:px-6'>
        <Label htmlFor='view-selector' className='sr-only'>
          View
        </Label>
        <Select value={tabValue} onValueChange={setTabValue}>
          <SelectTrigger className='flex w-fit @4xl/main:hidden' size='sm' id='view-selector'>
            <SelectValue placeholder='Select a view' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='package'>Buyer Commission Package</SelectItem>
            <SelectItem value='standard'>How to Calculate !</SelectItem>
          </SelectContent>
        </Select>
        <TabsList className='**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex'>
          <TabsTrigger value='package'>Buyer Commission Package</TabsTrigger>
          <TabsTrigger value='standard'>How to Calculate !</TabsTrigger>
        </TabsList>
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
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
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
      <TabsContent value='package' className='relative flex flex-col gap-4 overflow-auto px-4 lg:px-6'>
        <div className='overflow-hidden rounded-lg border'>
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
            id={sortableId}
          >
            <Table>
              <TableBody>
                <SortableContext items={columnOrder} strategy={verticalListSortingStrategy}>
                  {table
                    .getHeaderGroups()
                    .map((headerGroup) =>
                      headerGroup.headers.map((header) => (
                        <DraggableVerticalRow key={header.id} header={header} table={table} />
                      ))
                    )}
                </SortableContext>
              </TableBody>
            </Table>
          </DndContext>
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
      </TabsContent>
      <TabsContent value='standard' className='relative flex flex-col gap-4 overflow-auto px-4 lg:px-6'>
        <div className='overflow-hidden rounded-lg border'>
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
            id={sortableId}
          >
            <Table>
              <TableBody>
                <SortableContext items={columnOrder} strategy={verticalListSortingStrategy}>
                  {table
                    .getHeaderGroups()
                    .map((headerGroup) =>
                      headerGroup.headers.map((header) => (
                        <DraggableVerticalRow key={header.id} header={header} table={table} />
                      ))
                    )}
                </SortableContext>
              </TableBody>
            </Table>
          </DndContext>
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
      </TabsContent>
    </Tabs>
  )
}

function DraggableVerticalRow({
  header,
  table,
}: {
  header: Header<BuyerCommissionRow, unknown>
  table: ReactTable<BuyerCommissionRow>
}) {
  const { transform, transition, setNodeRef, isDragging, attributes, listeners } = useSortable({
    id: header.id,
  })

  const isTitle = header.id.includes('title')

  return (
    <TableRow
      key={header.id}
      data-dragging={isDragging}
      ref={setNodeRef}
      className={cn(
        isTitle && 'bg-neutral-100',
        'relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80'
      )}
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      <TableHead align={'left'}>
        {/*{header.id !== 'package' && !isTitle && <DragHandle attributes={attributes} listeners={listeners} />}*/}
        {flexRender(header.column.columnDef.header, header.getContext())}
      </TableHead>
      {table.getRowModel().rows.map((row) => {
        const cell = row.getVisibleCells().find((c) => c.column.id === header.column.id)
        return (
          <TableCell key={row.id}>{cell ? flexRender(cell.column.columnDef.cell, cell.getContext()) : null}</TableCell>
        )
      })}
    </TableRow>
  )
}

function DragHandle({
  listeners,
  attributes,
  className,
}: {
  listeners?: SyntheticListenerMap
  attributes: DraggableAttributes
  className?: string
}) {
  return (
    <Button
      {...attributes}
      {...listeners}
      variant='ghost'
      size='icon'
      className={cn('hover:bg-accent hover:text-accent-foreground text-muted-foreground size-7', className)}
    >
      <GripVerticalIcon className='text-muted-foreground size-3' />
      <span className='sr-only'>Drag to reorder</span>
    </Button>
  )
}

const chartData = [
  { month: 'January', desktop: 186, mobile: 80 },
  { month: 'February', desktop: 305, mobile: 200 },
  { month: 'March', desktop: 237, mobile: 120 },
  { month: 'April', desktop: 73, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'June', desktop: 214, mobile: 140 },
]

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'var(--primary)',
  },
  mobile: {
    label: 'Mobile',
    color: 'var(--primary)',
  },
} satisfies ChartConfig

// function TableCellViewer({ item }: { item: z.infer<typeof schema> }) {
//   const isMobile = useIsMobile()
//
//   return (
//     <Drawer direction={isMobile ? 'bottom' : 'right'}>
//       <DrawerTrigger asChild>
//         <Button variant='link' className='text-foreground w-fit px-0 text-left'>
//           {item.header}
//         </Button>
//       </DrawerTrigger>
//       <DrawerContent>
//         <DrawerHeader className='gap-1'>
//           <DrawerTitle>{item.header}</DrawerTitle>
//           <DrawerDescription>Showing total visitors for the last 6 months</DrawerDescription>
//         </DrawerHeader>
//         <div className='flex flex-col gap-4 overflow-y-auto px-4 text-sm'>
//           {!isMobile && (
//             <>
//               <ChartContainer config={chartConfig}>
//                 <AreaChart
//                   accessibilityLayer
//                   data={chartData}
//                   margin={{
//                     left: 0,
//                     right: 10,
//                   }}
//                 >
//                   <CartesianGrid vertical={false} />
//                   <XAxis
//                     dataKey='month'
//                     tickLine={false}
//                     axisLine={false}
//                     tickMargin={8}
//                     tickFormatter={(value) => value.slice(0, 3)}
//                     hide
//                   />
//                   <ChartTooltip cursor={false} content={<ChartTooltipContent indicator='dot' />} />
//                   <Area
//                     dataKey='mobile'
//                     type='natural'
//                     fill='var(--color-mobile)'
//                     fillOpacity={0.6}
//                     stroke='var(--color-mobile)'
//                     stackId='a'
//                   />
//                   <Area
//                     dataKey='desktop'
//                     type='natural'
//                     fill='var(--color-desktop)'
//                     fillOpacity={0.4}
//                     stroke='var(--color-desktop)'
//                     stackId='a'
//                   />
//                 </AreaChart>
//               </ChartContainer>
//               <Separator />
//               <div className='grid gap-2'>
//                 <div className='flex gap-2 leading-none font-medium'>
//                   Trending up by 5.2% this month <TrendingUpIcon className='size-4' />
//                 </div>
//                 <div className='text-muted-foreground'>
//                   Showing total visitors for the last 6 months. This is just some random text to test the layout. It
//                   spans multiple lines and should wrap around.
//                 </div>
//               </div>
//               <Separator />
//             </>
//           )}
//           <form className='flex flex-col gap-4'>
//             <div className='flex flex-col gap-3'>
//               <Label htmlFor='header'>Header</Label>
//               <Input id='header' defaultValue={item.header} />
//             </div>
//             <div className='grid grid-cols-2 gap-4'>
//               <div className='flex flex-col gap-3'>
//                 <Label htmlFor='type'>Type</Label>
//                 <Select defaultValue={item.type}>
//                   <SelectTrigger id='type' className='w-full'>
//                     <SelectValue placeholder='Select a type' />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value='Table of Contents'>Table of Contents</SelectItem>
//                     <SelectItem value='Executive Summary'>Executive Summary</SelectItem>
//                     <SelectItem value='Technical Approach'>Technical Approach</SelectItem>
//                     <SelectItem value='Design'>Design</SelectItem>
//                     <SelectItem value='Capabilities'>Capabilities</SelectItem>
//                     <SelectItem value='Focus Documents'>Focus Documents</SelectItem>
//                     <SelectItem value='Narrative'>Narrative</SelectItem>
//                     <SelectItem value='Cover Page'>Cover Page</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div className='flex flex-col gap-3'>
//                 <Label htmlFor='status'>Status</Label>
//                 <Select defaultValue={item.status}>
//                   <SelectTrigger id='status' className='w-full'>
//                     <SelectValue placeholder='Select a status' />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value='Done'>Done</SelectItem>
//                     <SelectItem value='In Progress'>In Progress</SelectItem>
//                     <SelectItem value='Not Started'>Not Started</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>
//             <div className='grid grid-cols-2 gap-4'>
//               <div className='flex flex-col gap-3'>
//                 <Label htmlFor='target'>Target</Label>
//                 <Input id='target' defaultValue={item.target} />
//               </div>
//               <div className='flex flex-col gap-3'>
//                 <Label htmlFor='limit'>Limit</Label>
//                 <Input id='limit' defaultValue={item.limit} />
//               </div>
//             </div>
//             <div className='flex flex-col gap-3'>
//               <Label htmlFor='reviewer'>Reviewer</Label>
//               <Select defaultValue={item.reviewer}>
//                 <SelectTrigger id='reviewer' className='w-full'>
//                   <SelectValue placeholder='Select a reviewer' />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value='Eddie Lake'>Eddie Lake</SelectItem>
//                   <SelectItem value='Jamik Tashpulatov'>Jamik Tashpulatov</SelectItem>
//                   <SelectItem value='Emily Whalen'>Emily Whalen</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </form>
//         </div>
//         <DrawerFooter>
//           <Button>Submit</Button>
//           <DrawerClose asChild>
//             <Button variant='outline'>Done</Button>
//           </DrawerClose>
//         </DrawerFooter>
//       </DrawerContent>
//     </Drawer>
//   )
// }
