"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2 } from "lucide-react"

interface LineItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  vatRate: number
  transactionFeeRate: number
}

interface LineItemsManagerProps {
  lineItems: LineItem[]
  currency: string
  globalVatRate: number
  globalTransactionFeeRate: number
  showQuantity: boolean
  showRate: boolean
  includeVat: boolean
  includeTransactionFees: boolean
  fieldLabels: {
    description: string
    quantity: string
    rate: string
    amount: string
  }
  onUpdate: (lineItems: LineItem[]) => void
}

const currencySymbols: { [key: string]: string } = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  CAD: "C$",
  AUD: "A$",
  JPY: "¥",
  INR: "₹",
}

export function LineItemsManager({
  lineItems,
  currency,
  globalVatRate,
  globalTransactionFeeRate,
  showQuantity,
  showRate,
  includeVat,
  includeTransactionFees,
  fieldLabels,
  onUpdate,
}: LineItemsManagerProps) {
  const formatCurrency = (amount: number) => {
    const symbol = currencySymbols[currency] || "$"
    return `${symbol}${amount.toFixed(2)}`
  }

  const addLineItem = () => {
    const newItem: LineItem = {
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      unitPrice: 0,
      vatRate: globalVatRate,
      transactionFeeRate: globalTransactionFeeRate,
    }
    onUpdate([...lineItems, newItem])
  }

  const updateLineItem = (id: string, field: keyof LineItem, value: string | number) => {
    const updatedItems = lineItems.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    onUpdate(updatedItems)
  }

  const removeLineItem = (id: string) => {
    if (lineItems.length > 1) {
      onUpdate(lineItems.filter((item) => item.id !== id))
    }
  }

  const calculateItemTotal = (item: LineItem) => {
    const quantity = showQuantity ? item.quantity : 1
    return quantity * item.unitPrice
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Line Items</span>
          <Button onClick={addLineItem} size="sm" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Item
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {lineItems.map((item, index) => (
          <div key={item.id} className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Item {index + 1}</h4>
              {lineItems.length > 1 && (
                <Button
                  onClick={() => removeLineItem(item.id)}
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor={`description-${item.id}`}>{fieldLabels.description}</Label>
                <Input
                  id={`description-${item.id}`}
                  value={item.description}
                  onChange={(e) => updateLineItem(item.id, "description", e.target.value)}
                  placeholder="Service or product description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {showQuantity && (
                  <div>
                    <Label htmlFor={`quantity-${item.id}`}>{fieldLabels.quantity}</Label>
                    <Input
                      id={`quantity-${item.id}`}
                      type="number"
                      min="1"
                      step="1"
                      value={item.quantity}
                      onChange={(e) => updateLineItem(item.id, "quantity", Number.parseInt(e.target.value) || 1)}
                    />
                  </div>
                )}
                {showRate && (
                  <div className={showQuantity ? "" : "col-span-2"}>
                    <Label htmlFor={`unitPrice-${item.id}`}>{fieldLabels.rate}</Label>
                    <Input
                      id={`unitPrice-${item.id}`}
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) => updateLineItem(item.id, "unitPrice", Number.parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                    />
                  </div>
                )}
              </div>

              {(includeVat || includeTransactionFees) && (
                <div className="grid grid-cols-2 gap-4">
                  {includeVat && (
                    <div>
                      <Label htmlFor={`vatRate-${item.id}`}>VAT Rate (%)</Label>
                      <Input
                        id={`vatRate-${item.id}`}
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={item.vatRate}
                        onChange={(e) => updateLineItem(item.id, "vatRate", Number.parseFloat(e.target.value) || 0)}
                        placeholder={globalVatRate.toString()}
                      />
                    </div>
                  )}
                  {includeTransactionFees && (
                    <div>
                      <Label htmlFor={`transactionFeeRate-${item.id}`}>Transaction Fee (%)</Label>
                      <Input
                        id={`transactionFeeRate-${item.id}`}
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={item.transactionFeeRate}
                        onChange={(e) =>
                          updateLineItem(item.id, "transactionFeeRate", Number.parseFloat(e.target.value) || 0)
                        }
                        placeholder={globalTransactionFeeRate.toString()}
                      />
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-end">
                <div className="text-right">
                  <div className="text-sm text-gray-600">{fieldLabels.amount}</div>
                  <div className="text-lg font-semibold">{formatCurrency(calculateItemTotal(item))}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
