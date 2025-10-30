'use client'

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react'

// ===============================
// TYPES
// ===============================
export type EventType = 'buyerCommission' | 'buyerVoucher' | 'agencyVoucher'

export interface EventPercentage {
  id: number
  name: string
  type: EventType
  percent: number // Chỉ nhập %
}

interface EventPercentageContextValue {
  events: EventPercentage[]
  getEvent: (type: EventType) => EventPercentage | undefined
  updatePercent: (id: number, newPercent: number) => void
  addEvent: (name: string, type: EventType, percent?: number) => void
  deleteEvent: (id: number) => void
}

// ===============================
// CONTEXT
// ===============================
const EventPercentageContext = createContext<EventPercentageContextValue | null>(null)

export const EventPercentageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Dữ liệu mặc định theo bảng bạn chụp
  const [events, setEvents] = useState<EventPercentage[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('events')
      if (saved) return JSON.parse(saved)
    }
    return [
      { id: 1, name: 'Event Buyer Commission', type: 'buyerCommission', percent: 0 },
      { id: 2, name: 'Event Buyer Voucher', type: 'buyerVoucher', percent: 0 },
      { id: 3, name: 'Event Agency Voucher', type: 'agencyVoucher', percent: 0 },
    ]
  })

  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events))
  }, [events])

  // ===============================
  // ACTIONS
  // ===============================
  const getEvent = useCallback(
    (type: EventType) => {
      return events.find((e) => e.type === type)
    },
    [events]
  )

  const updatePercent = useCallback((id: number, newPercent: number) => {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, percent: newPercent } : e)))
  }, [])

  const addEvent = useCallback((name: string, type: EventType, percent: number = 0) => {
    setEvents((prev) => {
      const nextId = prev.length ? Math.max(...prev.map((e) => e.id)) + 1 : 1
      return [...prev, { id: nextId, name, percent, type }]
    })
  }, [])

  const deleteEvent = useCallback((id: number) => {
    setEvents((prev) => prev.filter((e) => e.id !== id))
  }, [])

  const value = useMemo<EventPercentageContextValue>(
    () => ({
      events,
      getEvent,
      updatePercent,
      addEvent,
      deleteEvent,
    }),
    [events, updatePercent, addEvent, deleteEvent, getEvent]
  )

  return <EventPercentageContext.Provider value={value}>{children}</EventPercentageContext.Provider>
}

// ===============================
// HOOK
// ===============================
export const useEventPercentage = () => {
  const ctx = useContext(EventPercentageContext)
  if (!ctx) throw new Error('useEventPercentage must be used within EventPercentageProvider')
  return ctx
}
