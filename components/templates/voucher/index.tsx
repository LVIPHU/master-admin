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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  Columns2Icon,
  GripVerticalIcon,
  InfoIcon,
  MinusIcon,
  PlusIcon,
} from 'lucide-react'
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities'
import { cn } from '@/packages/utils/styles'
import { useBuyerVoucher, type VoucherRow, useAgencyVoucher } from '@/providers/voucher.provider'
import { capitalizeFirst } from '@/packages/utils/string'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

export default function VoucherTemplate() {
  const {
    data: dataBuyerVoucher,
    updateCell: updateCellBuyerVoucher,
    addPackage: addPackageBuyerVoucher,
    removePackage: removePackageBuyerVoucher,
  } = useBuyerVoucher()
  const {
    data: dataAgencyVoucher,
    updateCell: updateCellAgencyVoucher,
    addPackage: addPackageAgencyVoucher,
    removePackage: removePackageAgencyVoucher,
  } = useAgencyVoucher()
  const [tabValue, setTabValue] = React.useState<string>('buyer')
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const sortableId = React.useId()
  const sensors = useSensors(useSensor(MouseSensor, {}), useSensor(TouchSensor, {}), useSensor(KeyboardSensor, {}))

  const { data, updateCell, addPackage, removePackage } = React.useMemo(() => {
    if (tabValue === 'buyer') {
      return {
        data: dataBuyerVoucher,
        updateCell: updateCellBuyerVoucher,
        addPackage: addPackageBuyerVoucher,
        removePackage: removePackageBuyerVoucher,
      }
    }
    return {
      data: dataAgencyVoucher,
      updateCell: updateCellAgencyVoucher,
      addPackage: addPackageAgencyVoucher,
      removePackage: removePackageAgencyVoucher,
    }
  }, [
    tabValue,
    dataBuyerVoucher,
    updateCellBuyerVoucher,
    addPackageBuyerVoucher,
    dataAgencyVoucher,
    updateCellAgencyVoucher,
    addPackageAgencyVoucher,
    removePackageBuyerVoucher,
    restrictToVerticalAxis,
  ])

  const columns: ColumnDef<VoucherRow>[] = [
    {
      accessorKey: 'package',
      id: `${capitalizeFirst(tabValue)} Voucher Package`,
      header: `${capitalizeFirst(tabValue)} Voucher Package`,
      cell: ({ row }) => <p className='px-3 text-right'>{row.original.package}</p>,
      enableHiding: false,
    },
    {
      accessorKey: 'amountTBC',
      id: `${capitalizeFirst(tabValue)} Voucher Amount`,
      header: `${capitalizeFirst(tabValue)} Voucher Amount`,
      cell: ({ row }) => {
        if (row.index === 0) {
          return (
            <form
              className='flex justify-end bg-green-200'
              onSubmit={(e) => {
                e.preventDefault()

                const input = e.currentTarget.querySelector('input')
                const value = input?.value

                if (!value) return

                updateCell('voucherAmount', row.index, Number(value))

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
          )
        }
        return <p className='text-right'>{row.original.amountTBC}</p>
      },
    },
    {
      accessorKey: 'valueUSD',
      id: `${capitalizeFirst(tabValue)} Voucher Value`,
      header: `${capitalizeFirst(tabValue)} Voucher Value`,
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
      accessorKey: 'percent',
      id: `Final ${capitalizeFirst(tabValue)} Voucher`,
      header: () => (
        <div className='flex items-center gap-2'>
          <p>{`Final ${capitalizeFirst(tabValue)} Voucher`}</p>
          <Tooltip>
            <TooltipTrigger asChild>
              <InfoIcon size={12} />
            </TooltipTrigger>
            <TooltipContent>{`${capitalizeFirst(tabValue)} Voucher + Event ${capitalizeFirst(tabValue)} Voucher`}</TooltipContent>
          </Tooltip>
        </div>
      ),
      cell: ({ row }) => {
        if (row.index === 0) {
          return (
            <form
              className='flex items-center justify-end bg-green-200'
              onSubmit={(e) => {
                e.preventDefault()
                const input = e.currentTarget.querySelector('input')
                const value = input?.value

                if (!value) return

                updateCell('voucherPercent', row.index, Number(value))
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
          )
        }
        return <p className='text-right'>{row.original.finalPercent}%</p>
      },
    },
  ]

  const table = useReactTable({
    data,
    columns,
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
            <SelectItem value='buyer'>Buyer Voucher Package</SelectItem>
            <SelectItem value='agency'>Agency Voucher Package</SelectItem>
          </SelectContent>
        </Select>
        <TabsList className='**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex'>
          <TabsTrigger value='buyer'>Buyer Voucher Package</TabsTrigger>
          <TabsTrigger value='agency'>Agency Voucher Package</TabsTrigger>
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
          <Button variant='outline' size='sm' onClick={removePackage}>
            <MinusIcon />
            <span className='hidden lg:inline'>Remove Package</span>
          </Button>
        </div>
      </div>
      <TabsContent value='buyer' className='relative flex flex-col gap-4 overflow-auto px-4 lg:px-6'>
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
      <TabsContent value='agency' className='relative flex flex-col gap-4 overflow-auto px-4 lg:px-6'>
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
  header: Header<VoucherRow, unknown>
  table: ReactTable<VoucherRow>
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
