"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2 } from "lucide-react"

interface PaymentMilestone {
  id: string
  description: string
  percentage: number
  amount: number
  dueDate: string
}

interface PaymentMilestonesManagerProps {
  milestones: PaymentMilestone[]
  currency: string
  grandTotal: number
  onUpdate: (milestones: PaymentMilestone[]) => void
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

export function PaymentMilestonesManager({
  milestones,
  currency,
  grandTotal,
  onUpdate,
}: PaymentMilestonesManagerProps) {
  const formatCurrency = (amount: number) => {
    const symbol = currencySymbols[currency] || "$"
    return `${symbol}${amount.toFixed(2)}`
  }

  const addMilestone = () => {
    const newMilestone: PaymentMilestone = {
      id: Date.now().toString(),
      description: "Payment",
      percentage: 0,
      amount: 0,
      dueDate: new Date().toISOString().split("T")[0],
    }
    onUpdate([...milestones, newMilestone])
  }

  const updateMilestone = (id: string, field: keyof PaymentMilestone, value: string | number) => {
    const updatedMilestones = milestones.map((milestone) => {
      if (milestone.id === id) {
        const updated = { ...milestone, [field]: value }
        // Recalculate amount when percentage changes
        if (field === "percentage") {
          updated.amount = (grandTotal * (value as number)) / 100
        }
        return updated
      }
      return milestone
    })
    onUpdate(updatedMilestones)
  }

  const removeMilestone = (id: string) => {
    if (milestones.length > 1) {
      onUpdate(milestones.filter((milestone) => milestone.id !== id))
    }
  }

  const getTotalPercentage = () => {
    return milestones.reduce((sum, milestone) => sum + milestone.percentage, 0)
  }

  const isPercentageValid = () => {
    const total = getTotalPercentage()
    return total <= 100
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Payment Milestones</span>
          <Button onClick={addMilestone} size="sm" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Milestone
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {milestones.map((milestone, index) => (
          <div key={milestone.id} className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Milestone {index + 1}</h4>
              {milestones.length > 1 && (
                <Button
                  onClick={() => removeMilestone(milestone.id)}
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
                <Label htmlFor={`milestone-description-${milestone.id}`}>Description</Label>
                <Input
                  id={`milestone-description-${milestone.id}`}
                  value={milestone.description}
                  onChange={(e) => updateMilestone(milestone.id, "description", e.target.value)}
                  placeholder="Payment description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`milestone-percentage-${milestone.id}`}>Percentage (%)</Label>
                  <Input
                    id={`milestone-percentage-${milestone.id}`}
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    value={milestone.percentage}
                    onChange={(e) => updateMilestone(milestone.id, "percentage", Number.parseInt(e.target.value) || 0)}
                    className={!isPercentageValid() ? "border-red-500" : ""}
                  />
                </div>
                <div>
                  <Label htmlFor={`milestone-dueDate-${milestone.id}`}>Due Date</Label>
                  <Input
                    id={`milestone-dueDate-${milestone.id}`}
                    type="date"
                    value={milestone.dueDate}
                    onChange={(e) => updateMilestone(milestone.id, "dueDate", e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <div className="text-right">
                  <div className="text-sm text-gray-600">Amount</div>
                  <div className="text-lg font-semibold">{formatCurrency(milestone.amount)}</div>
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="border-t pt-4">
          <div className="flex justify-between items-center">
            <span className="font-medium">Total Percentage:</span>
            <span className={`font-bold ${isPercentageValid() ? "text-green-600" : "text-red-600"}`}>
              {getTotalPercentage()}%
            </span>
          </div>
          {!isPercentageValid() && <p className="text-sm text-red-600 mt-1">Total percentage cannot exceed 100%</p>}
        </div>
      </CardContent>
    </Card>
  )
}
