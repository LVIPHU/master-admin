import { DataTable } from '@/components/molecules/data-table'
import data from './data.json'

export default function DashboardTemplate() {
  return (
    <DataTable data={data} />
  )
}