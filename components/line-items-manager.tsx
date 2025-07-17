"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2, Plus } from "lucide-react"

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
  includeVat: boolean
  includeTransactionFees: boolean
  onUpdate: (lineItems: LineItem[]) => void
}

export function LineItemsManager({
  lineItems,
  currency,
  globalVatRate,
  globalTransactionFeeRate,
  showQuantity,
  includeVat,
  includeTransactionFees,
  onUpdate,
}: LineItemsManagerProps) {
  const addLineItem = () => {
    const newItem: LineItem = {
      id: Date.now().toString(),
      description: "New Service",
      quantity: 1,
      unitPrice: 0,
      vatRate: globalVatRate,
      transactionFeeRate: globalTransactionFeeRate,
    }
    onUpdate([...lineItems, newItem])
  }

  const updateLineItem = (id: string, field: keyof LineItem, value: any) => {
    const updatedItems = lineItems.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    onUpdate(updatedItems)
  }

  const removeLineItem = (id: string) => {
    onUpdate(lineItems.filter((item) => item.id !== id))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Line Items
          <Button onClick={addLineItem} size="sm" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Item
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {lineItems.map((item, index) => (
            <div key={item.id} className="p-4 border rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Item {index + 1}</h4>
                <Button
                  onClick={() => removeLineItem(item.id)}
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label>Description</Label>
                  <Input
                    value={item.description}
                    onChange={(e) => updateLineItem(item.id, "description", e.target.value)}
                    placeholder="Service or product description"
                  />
                </div>

                {showQuantity && (
                  <div>
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateLineItem(item.id, "quantity", Number.parseInt(e.target.value) || 1)}
                      min="1"
                    />
                  </div>
                )}

                <div>
                  <Label>Unit Price ({currency})</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={item.unitPrice}
                    onChange={(e) => updateLineItem(item.id, "unitPrice", Number.parseFloat(e.target.value) || 0)}
                    min="0"
                  />
                </div>

                {includeVat && (
                  <div>
                    <Label>VAT Rate (%)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={item.vatRate}
                      onChange={(e) => updateLineItem(item.id, "vatRate", Number.parseFloat(e.target.value) || 0)}
                      min="0"
                      max="100"
                    />
                  </div>
                )}

                {includeTransactionFees && (
                  <div>
                    <Label>Transaction Fee (%)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={item.transactionFeeRate}
                      onChange={(e) =>
                        updateLineItem(item.id, "transactionFeeRate", Number.parseFloat(e.target.value) || 0)
                      }
                      min="0"
                      max="100"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end text-sm text-gray-600">
                <span>
                  Total: {currency} {((showQuantity ? item.quantity : 1) * item.unitPrice).toFixed(2)}
                </span>
              </div>
            </div>
          ))}

          {lineItems.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No line items added yet.</p>
              <Button onClick={addLineItem} className="mt-2">
                Add Your First Item
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
