'use client'

import React, { createContext, useContext, useState, useCallback, PropsWithChildren } from 'react'
import { toast } from 'sonner'

// ========================
// TYPES
// ========================
export interface PresaleEvent {
  id: number
  lockedTbcFrom: string
  lockedTbcTo: string
  lockedRewardFrom: string
  lockedRewardTo: string
}

interface PresaleEventContextType {
  data: PresaleEvent[]
  setData: React.Dispatch<React.SetStateAction<PresaleEvent[]>>
  addEvent: () => void
  updateEvent: (id: number, updated: Partial<PresaleEvent>) => void
  deleteEvent: (id: number) => void
}

// ========================
// CONTEXT
// ========================
const PresaleEventContext = createContext<PresaleEventContextType | undefined>(undefined)

// ========================
// PROVIDER
// ========================
export function PresaleEventProvider({ children }: PropsWithChildren) {
  const [data, setData] = useState<PresaleEvent[]>([
    {
      id: 0,
      lockedTbcFrom: '2024-01-15',
      lockedTbcTo: '2024-01-15',
      lockedRewardFrom: '2024-01-15',
      lockedRewardTo: '2024-01-15',
    },
    {
      id: 1,
      lockedTbcFrom: '2024-01-15',
      lockedTbcTo: '2024-01-15',
      lockedRewardFrom: '2024-01-15',
      lockedRewardTo: '2024-01-15',
    },
    {
      id: 2,
      lockedTbcFrom: '2024-01-15',
      lockedTbcTo: '2024-01-15',
      lockedRewardFrom: '2024-01-15',
      lockedRewardTo: '2024-01-15',
    },
    {
      id: 3,
      lockedTbcFrom: '2024-01-15',
      lockedTbcTo: '2024-01-15',
      lockedRewardFrom: '2024-01-15',
      lockedRewardTo: '2024-01-15',
    },
    {
      id: 4,
      lockedTbcFrom: '2024-01-15',
      lockedTbcTo: '2024-01-15',
      lockedRewardFrom: '2024-01-15',
      lockedRewardTo: '2024-01-15',
    },
  ])

  // ------------------------
  // Add
  // ------------------------
  const addEvent = useCallback(() => {
    setData((prev) => {
      const date = new Date()
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const formatted = `${year}-${month}-${day}`
      const newEvent: PresaleEvent = {
        id: prev.length,
        lockedTbcFrom: formatted,
        lockedTbcTo: formatted,
        lockedRewardFrom: formatted,
        lockedRewardTo: formatted,
      }
      toast.success('Added new event successfully!')
      return [...prev, newEvent]
    })
  }, [])

  // ------------------------
  // Update
  // ------------------------
  const updateEvent = useCallback((id: number, updated: Partial<PresaleEvent>) => {
    setData((prev) => {
      const next = prev.map((e) => (e.id === id ? { ...e, ...updated } : e))
      toast.success(`Updated event ${id} successfully!`)
      return next
    })
  }, [])

  // ------------------------
  // Delete
  // ------------------------
  const deleteEvent = useCallback((id: number) => {
    setData((prev) => {
      const next = prev.filter((e) => e.id !== id)
      toast.success(`Deleted event ${id} successfully!`)
      return next
    })
  }, [])

  // ------------------------
  // Provider value
  // ------------------------
  return (
    <PresaleEventContext.Provider
      value={{
        data,
        setData,
        addEvent,
        updateEvent,
        deleteEvent,
      }}
    >
      {children}
    </PresaleEventContext.Provider>
  )
}

// ========================
// HOOK
// ========================
export function usePresaleEvent() {
  const context = useContext(PresaleEventContext)
  if (!context) throw new Error('usePresaleEvent must be used within PresaleEventProvider')
  return context
}
