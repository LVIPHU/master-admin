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
  type UniqueIdentifier,
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
  SortingState,
  useReactTable,
  VisibilityState,
  type Row,
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  Columns2Icon,
  GripVerticalIcon,
} from 'lucide-react'
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities'
import { cn } from '@/packages/utils/styles'
import { useEventPercentage, type EventPercentage } from '@/providers/event.provider'

function DraggableRow({ row }: { row: Row<EventPercentage> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  })

  return (
    <TableRow
      data-dragging={isDragging}
      ref={setNodeRef}
      className={cn('relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80')}
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
      ))}
    </TableRow>
  )
}

export default function EventTemplate() {
  const { events, updatePercent } = useEventPercentage()
  const [tabValue, setTabValue] = React.useState<string>('event')
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

  const dataIds = React.useMemo<UniqueIdentifier[]>(() => events?.map(({ id }) => id) || [], [events])

  const columns: ColumnDef<EventPercentage>[] = [
    {
      accessorKey: 'id',
      header: `ID`,
      cell: ({ row }) => <p>{row.original.id}</p>,
      enableHiding: false,
    },
    {
      accessorKey: 'name',
      header: `Event`,
      cell: ({ row }) => <p>{row.original.name}</p>,
    },
    {
      accessorKey: 'percent',
      header: () => <p className='text-right'>Percent</p>,
      cell: ({ row }) => (
        <form
          className='flex items-center justify-end bg-green-200'
          onSubmit={(e) => {
            e.preventDefault()
            const input = e.currentTarget.querySelector('input')
            const value = input?.value

            if (!value) return

            updatePercent(row.original.id, Number(value))
            toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
              loading: `Saving ${row.original.id}`,
              success: 'Done',
              error: 'Error',
            })
          }}
        >
          <Label htmlFor={`${row.original.id}-final-buyer-commission`} className='sr-only'>
            final-buyer-commission
          </Label>
          <Input
            type='number'
            className='hover:bg-input/30 focus-visible:bg-background dark:hover:bg-input/30 dark:focus-visible:bg-input/30 h-8 w-16 border-transparent bg-transparent text-right shadow-none focus-visible:border dark:bg-transparent'
            defaultValue={row.original.percent}
            id={`${row.original.id}-final-buyer-commission`}
          />
          <p>%</p>
        </form>
      ),
    },
  ]

  const table = useReactTable({
    data: events,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
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
    <Tabs value={tabValue} onValueChange={setTabValue} className='w-full flex-col justify-start gap-6'>
      <div className='flex items-center justify-between px-4 lg:px-6'>
        <h1 className='text-xl font-semibold'>Event</h1>
      </div>
      <TabsContent value='event' className='relative flex flex-col gap-4 overflow-auto px-4 lg:px-6'>
        <div className='max-w-lg overflow-hidden rounded-lg border'>
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            // onDragEnd={handleDragEnd}
            sensors={sensors}
            id={sortableId}
          >
            <Table>
              <TableHeader className='bg-muted sticky top-0 z-10'>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} colSpan={header.colSpan}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className='**:data-[slot=table-cell]:first:w-8'>
                {table.getRowModel().rows?.length ? (
                  <SortableContext items={dataIds} strategy={verticalListSortingStrategy}>
                    {table.getRowModel().rows.map((row) => (
                      <DraggableRow key={row.id} row={row} />
                    ))}
                  </SortableContext>
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className='h-24 text-center'>
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>
        {/*<div className='flex items-center justify-between px-4'>*/}
        {/*  <div className='text-muted-foreground hidden flex-1 text-sm lg:flex'>*/}
        {/*    {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)*/}
        {/*    selected.*/}
        {/*  </div>*/}
        {/*  <div className='flex w-full items-center gap-8 lg:w-fit'>*/}
        {/*    <div className='hidden items-center gap-2 lg:flex'>*/}
        {/*      <Label htmlFor='rows-per-page' className='text-sm font-medium'>*/}
        {/*        Rows per page*/}
        {/*      </Label>*/}
        {/*      <Select*/}
        {/*        value={`${table.getState().pagination.pageSize}`}*/}
        {/*        onValueChange={(value) => {*/}
        {/*          table.setPageSize(Number(value))*/}
        {/*        }}*/}
        {/*      >*/}
        {/*        <SelectTrigger size='sm' className='w-20' id='rows-per-page'>*/}
        {/*          <SelectValue placeholder={table.getState().pagination.pageSize} />*/}
        {/*        </SelectTrigger>*/}
        {/*        <SelectContent side='top'>*/}
        {/*          {[5, 10, 15, 20, 25].map((pageSize) => (*/}
        {/*            <SelectItem key={pageSize} value={`${pageSize}`}>*/}
        {/*              {pageSize}*/}
        {/*            </SelectItem>*/}
        {/*          ))}*/}
        {/*        </SelectContent>*/}
        {/*      </Select>*/}
        {/*    </div>*/}
        {/*    <div className='flex w-fit items-center justify-center text-sm font-medium'>*/}
        {/*      Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}*/}
        {/*    </div>*/}
        {/*    <div className='ml-auto flex items-center gap-2 lg:ml-0'>*/}
        {/*      <Button*/}
        {/*        variant='outline'*/}
        {/*        className='hidden h-8 w-8 p-0 lg:flex'*/}
        {/*        onClick={() => table.setPageIndex(0)}*/}
        {/*        disabled={!table.getCanPreviousPage()}*/}
        {/*      >*/}
        {/*        <span className='sr-only'>Go to first page</span>*/}
        {/*        <ChevronsLeftIcon />*/}
        {/*      </Button>*/}
        {/*      <Button*/}
        {/*        variant='outline'*/}
        {/*        className='size-8'*/}
        {/*        size='icon'*/}
        {/*        onClick={() => table.previousPage()}*/}
        {/*        disabled={!table.getCanPreviousPage()}*/}
        {/*      >*/}
        {/*        <span className='sr-only'>Go to previous page</span>*/}
        {/*        <ChevronLeftIcon />*/}
        {/*      </Button>*/}
        {/*      <Button*/}
        {/*        variant='outline'*/}
        {/*        className='size-8'*/}
        {/*        size='icon'*/}
        {/*        onClick={() => table.nextPage()}*/}
        {/*        disabled={!table.getCanNextPage()}*/}
        {/*      >*/}
        {/*        <span className='sr-only'>Go to next page</span>*/}
        {/*        <ChevronRightIcon />*/}
        {/*      </Button>*/}
        {/*      <Button*/}
        {/*        variant='outline'*/}
        {/*        className='hidden size-8 lg:flex'*/}
        {/*        size='icon'*/}
        {/*        onClick={() => table.setPageIndex(table.getPageCount() - 1)}*/}
        {/*        disabled={!table.getCanNextPage()}*/}
        {/*      >*/}
        {/*        <span className='sr-only'>Go to last page</span>*/}
        {/*        <ChevronsRightIcon />*/}
        {/*      </Button>*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*</div>*/}
      </TabsContent>
    </Tabs>
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
