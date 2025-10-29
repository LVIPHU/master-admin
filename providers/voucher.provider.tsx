'use client'

import React, { createContext, useContext, useState, useMemo, useCallback } from 'react'
import { useBuyerCommission } from '@/providers/buyer-commission.provider'

export interface VoucherRow {
  package: number
  amountTBC: number
  valueUSD: number
  percent: number
  finalPercent: number
  finalValueUSD: number
}

interface VoucherContextValue {
  eventPercent: number
  voucherAmount: number[]
  voucherPercent: number[]
  data: VoucherRow[]
  updateCell: (section: string, index: number, newValue: number) => void
  addPackage: () => void
  removePackage: (index: number) => void
  setEventPercent: (percent: number) => void
}

function createVoucherContext(name: string) {
  const Context = createContext<VoucherContextValue | null>(null)

  const Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { tbcPrice } = useBuyerCommission()
    const [voucherAmount, setVoucherAmount] = useState([300, 600, 1200, 2400, 4800])
    const [voucherPercent, setVoucherPercent] = useState([1, 2, 3, 4, 5])
    const [eventPercent, setEventPercent] = useState(0)

    // ======== CALCULATE ========
    const calculateVoucher = useCallback((): VoucherRow[] => {
      return voucherAmount.map((amount, i) => {
        const pkg = i + 1
        const amountTBC = amount ?? 0
        const valueUSD = amountTBC * tbcPrice
        const percent = voucherPercent[i] ?? 0
        const finalPercent = percent + eventPercent
        const finalValueUSD = valueUSD * (1 + eventPercent / 100)

        return {
          package: pkg,
          amountTBC,
          valueUSD,
          percent,
          finalPercent,
          finalValueUSD,
        }
      })
    }, [tbcPrice, voucherAmount, voucherPercent, eventPercent])

    const data = useMemo(() => calculateVoucher(), [calculateVoucher])

    // ======== UPDATE ========
    const updateCell = useCallback((section: string, index: number, newValue: number) => {
      const value = parseFloat(String(newValue)) || 0
      if (section === 'voucherAmount') setVoucherAmount((prev) => prev.map((v, i) => (i === index ? value : v)))
      if (section === 'voucherPercent') setVoucherPercent((prev) => prev.map((v, i) => (i === index ? value : v)))
    }, [])

    // ======== ADD/REMOVE ========
    const addPackage = useCallback(() => {
      setVoucherAmount((prev) => [...prev, prev[prev.length - 1] * 2 || 0])
      setVoucherPercent((prev) => [...prev, prev[prev.length - 1] + 1 || 0])
    }, [])

    const removePackage = useCallback((index: number) => {
      setVoucherAmount((prev) => prev.filter((_, i) => i !== index))
      setVoucherPercent((prev) => prev.filter((_, i) => i !== index))
    }, [])

    const value: VoucherContextValue = {
      eventPercent,
      voucherAmount,
      voucherPercent,
      data,
      updateCell,
      addPackage,
      removePackage,
      setEventPercent,
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
