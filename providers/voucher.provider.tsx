'use client'

import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react'
import { useBuyerCommission } from '@/providers/buyer-commission.provider'
import { useEventPercentage, type EventType } from '@/providers/event.provider'

export interface VoucherRow {
  package: number
  amountTBC: number
  valueUSD: number
  percent: number
  finalPercent: number
  finalValueUSD: number
}

interface VoucherContextValue {
  voucherAmount: number[]
  voucherPercent: number[]
  data: VoucherRow[]
  updateCell: (section: string, index: number, newValue: number) => void
  addPackage: () => void
  removePackage: (index: number) => void
}

function createVoucherContext(name: string) {
  const Context = createContext<VoucherContextValue | null>(null)

  const Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { tbcPrice } = useBuyerCommission()
    const { getEvent } = useEventPercentage()

    const [voucherAmount, setVoucherAmount] = useState(() => {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('voucherAmount')
        if (saved) return JSON.parse(saved)
      }
      return [300, 600, 1200, 2400, 4800, 9600, 19200, 38400, 76800, 153600]
    })
    const [voucherPercent, setVoucherPercent] = useState(() => {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('voucherPercent')
        if (saved) return JSON.parse(saved)
      }
      return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    })

    useEffect(() => {
      localStorage.setItem('voucherAmount', JSON.stringify(voucherAmount))
    }, [voucherAmount])

    useEffect(() => {
      localStorage.setItem('voucherPercent', JSON.stringify(voucherPercent))
    }, [voucherPercent])

    // ======== CALCULATE ========
    const eventVoucherPercent = useMemo(
      () => getEvent(`${name.toLowerCase()}Voucher` as EventType)?.percent ?? 0,
      [getEvent]
    )
    console.log(`${name}Voucher`, eventVoucherPercent)

    const calculateVoucher = useCallback((): VoucherRow[] => {
      return voucherAmount.map((amount: never, i: never) => {
        const pkg = i + 1
        const amountTBC = amount ?? 0
        const valueUSD = amountTBC * tbcPrice
        const percent = voucherPercent[i] ?? 0
        const finalPercent = percent + eventVoucherPercent
        const finalValueUSD = valueUSD * (1 + eventVoucherPercent / 100)

        return {
          package: pkg,
          amountTBC,
          valueUSD,
          percent,
          finalPercent,
          finalValueUSD,
        }
      })
    }, [tbcPrice, voucherAmount, voucherPercent, eventVoucherPercent])

    const data = useMemo(() => calculateVoucher(), [calculateVoucher])

    // ======== UPDATE ========
    const updateCell = useCallback((section: string, index: number, newValue: number) => {
      const value = parseFloat(String(newValue)) || 0
      if (section === 'voucherAmount')
        setVoucherAmount((prev: never[]) => prev.map((v, i) => (i === index ? value : v)))
      if (section === 'voucherPercent')
        setVoucherPercent((prev: never[]) => prev.map((v, i) => (i === index ? value : v)))
    }, [])

    // ======== ADD/REMOVE ========
    const addPackage = useCallback(() => {
      setVoucherAmount((prev: never[]) => [...prev, prev[prev.length - 1] * 2 || 0])
      setVoucherPercent((prev: never[]) => [...prev, prev[prev.length - 1] + 1 || 0])
    }, [])

    const removePackage = useCallback((index: number) => {
      setVoucherAmount((prev: never[]) => prev.filter((_, i) => i !== index))
      setVoucherPercent((prev: never[]) => prev.filter((_, i) => i !== index))
    }, [])

    const value: VoucherContextValue = {
      voucherAmount,
      voucherPercent,
      data,
      updateCell,
      addPackage,
      removePackage,
    }

    return <Context.Provider value={value}>{children}</Context.Provider>
  }

  const useVoucher = () => {
    const ctx = useContext(Context)
    if (!ctx) throw new Error(`use${name}Voucher must be used within ${name}VoucherProvider`)
    return ctx
  }

  return { Provider, useVoucher }
}

export const { Provider: BuyerVoucherProvider, useVoucher: useBuyerVoucher } = createVoucherContext('Buyer')

export const { Provider: AgencyVoucherProvider, useVoucher: useAgencyVoucher } = createVoucherContext('Agency')
