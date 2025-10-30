'use client'

import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react'
import { useEventPercentage } from '@/providers/event.provider'

// ========================
// TYPES
// ========================
export interface BuyerCommissionRow {
  package: number
  amountTBC: number
  valueUSD: number
  standardPercent: number
  standardAmountTBC: number
  standardValueUSD: number
  discountPercent: number
  discountAmountTBC: number
  discountValueUSD: number
  discountValuePerPackage: number
  extraPercent: number
  totalPercent: number
  totalValueUSD: number
  finalPercent: number
  finalValueUSD: number
}

export interface BuyerCommissionContextValue {
  tbcPrice: number
  buyerCommissionAmount: number[]
  buyerStandardCommissionPercent: number[]
  packageDiscountPercent: number[]
  data: BuyerCommissionRow[]
  updateCell: (section: string, index: number, newValue: number) => void
  addPackage: () => void
  removePackage: (index: number) => void
  setTbcPrice: (price: number) => void
}

// ========================
// CONTEXT
// ========================
const BuyerCommissionContext = createContext<BuyerCommissionContextValue | null>(null)

export const BuyerCommissionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // === STATE ===
  const { getEvent } = useEventPercentage()
  const [tbcPrice, setTbcPrice] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tbcPrice')
      if (saved) return JSON.parse(saved)
    }
    return 4
  })
  const [buyerCommissionAmount, setBuyerCommissionAmount] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('buyerCommissionAmount')
      if (saved) return JSON.parse(saved)
    }
    return [100, 200, 300, 400, 500]
  })
  const [buyerStandardCommissionPercent, setBuyerStandardCommissionPercent] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('buyerStandardCommissionPercent')
      if (saved) return JSON.parse(saved)
    }
    return [1, 2, 3, 4, 5]
  })
  const [packageDiscountPercent, setPackageDiscountPercent] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('packageDiscountPercent')
      if (saved) return JSON.parse(saved)
    }
    return [0, 4, 9, 16, 25]
  })

  useEffect(() => {
    localStorage.setItem('tbcPrice', JSON.stringify(tbcPrice))
  }, [tbcPrice])

  useEffect(() => {
    localStorage.setItem('buyerCommissionAmount', JSON.stringify(buyerCommissionAmount))
  }, [buyerCommissionAmount])

  useEffect(() => {
    localStorage.setItem('buyerStandardCommissionPercent', JSON.stringify(buyerStandardCommissionPercent))
  }, [buyerStandardCommissionPercent])

  useEffect(() => {
    localStorage.setItem('packageDiscountPercent', JSON.stringify(packageDiscountPercent))
  }, [packageDiscountPercent])

  // === LOGIC CALCULATE ===
  const eventBuyerCommissionPercent = useMemo(() => getEvent('buyerCommission')?.percent ?? 0, [getEvent])

  const calculateBuyerCommission = useCallback((): BuyerCommissionRow[] => {
    const buyerCommissionPackages = buyerCommissionAmount.map((_: never, i: never) => i + 1)

    return buyerCommissionPackages.map((pkg: never, i: never) => {
      const amountTBC = buyerCommissionAmount[i] ?? 0
      const valueUSD = amountTBC * tbcPrice

      const standardPercent = buyerStandardCommissionPercent[i] ?? 0
      const standardAmountTBC = Math.round((standardPercent / 100) * amountTBC)
      const standardValueUSD = Math.round((standardPercent / 100) * valueUSD)

      const discountPercent = packageDiscountPercent[i] ?? 0
      const discountAmountTBC = Math.round((discountPercent / 100) * buyerCommissionAmount[0])
      const discountValueUSD = discountAmountTBC * tbcPrice
      const discountValuePerPackage = discountValueUSD / pkg

      const extraPercent = amountTBC ? (discountAmountTBC / amountTBC) * 100 : 0
      const totalPercent = standardPercent + extraPercent
      const totalValueUSD = standardValueUSD + discountValueUSD

      const finalPercent = totalPercent + eventBuyerCommissionPercent
      const finalValueUSD = totalValueUSD * (1 + eventBuyerCommissionPercent / 100)

      return {
        package: pkg,
        amountTBC,
        valueUSD,
        standardPercent,
        standardAmountTBC,
        standardValueUSD,
        discountPercent,
        discountAmountTBC,
        discountValueUSD,
        discountValuePerPackage,
        extraPercent,
        totalPercent,
        totalValueUSD,
        finalPercent,
        finalValueUSD,
      }
    })
  }, [
    tbcPrice,
    buyerCommissionAmount,
    buyerStandardCommissionPercent,
    packageDiscountPercent,
    eventBuyerCommissionPercent,
  ])

  const data = useMemo(() => calculateBuyerCommission(), [calculateBuyerCommission])

  // === UPDATE CELL ===
  const updateCell = useCallback((section: string, index: number, newValue: number) => {
    const value = parseFloat(String(newValue)) || 0
    if (section === 'buyerCommissionAmount')
      setBuyerCommissionAmount((prev: never[]) => prev.map((v, i) => (i === index ? value : v)))
    if (section === 'buyerStandardCommissionPercent')
      setBuyerStandardCommissionPercent((prev: never[]) => prev.map((v, i) => (i === index ? value : v)))
    if (section === 'packageDiscountPercent')
      setPackageDiscountPercent((prev: never[]) => prev.map((v, i) => (i === index ? value : v)))
  }, [])

  // === ADD / REMOVE ROW ===
  const addPackage = useCallback(() => {
    setBuyerCommissionAmount((prev: never[]) => [...prev, 0])
    setBuyerStandardCommissionPercent((prev: never[]) => [...prev, 0])
    setPackageDiscountPercent((prev: never[]) => [...prev, 0])
  }, [])

  const removePackage = useCallback((index: number) => {
    setBuyerCommissionAmount((prev: never[]) => prev.filter((_, i) => i !== index))
    setBuyerStandardCommissionPercent((prev: never[]) => prev.filter((_, i) => i !== index))
    setPackageDiscountPercent((prev: never[]) => prev.filter((_, i) => i !== index))
  }, [])

  // === CONTEXT VALUE ===
  const value: BuyerCommissionContextValue = {
    tbcPrice,
    buyerCommissionAmount,
    buyerStandardCommissionPercent,
    packageDiscountPercent,
    data,
    updateCell,
    addPackage,
    removePackage,
    setTbcPrice,
  }

  return <BuyerCommissionContext.Provider value={value}>{children}</BuyerCommissionContext.Provider>
}

// ========================
// HOOK
// ========================
export const useBuyerCommission = () => {
  const ctx = useContext(BuyerCommissionContext)
  if (!ctx) throw new Error('useBuyerCommission must be used within BuyerCommissionProvider')
  return ctx
}
