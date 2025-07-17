"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2, Plus, Calendar } from "lucide-react"

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
      description: "Payment Milestone",
      percentage: 50,
      amount: (grandTotal * 50) / 100,
      dueDate: new Date().toISOString().split("T")[0],
    }
    onUpdate([...milestones, newMilestone])
  }

  const updateMilestone = (id: string, field: keyof PaymentMilestone, value: any) => {
    const updatedMilestones = milestones.map((milestone) => {
      if (milestone.id === id) {
        const updated = { ...milestone, [field]: value }
        // Recalculate amount when percentage changes
        if (field === "percentage") {
          updated.amount = (grandTotal * value) / 100
        }
        return updated
      }
      return milestone
    })
    onUpdate(updatedMilestones)
  }

  const removeMilestone = (id: string) => {
    onUpdate(milestones.filter((milestone) => milestone.id !== id))
  }

  const totalPercentage = milestones.reduce((sum, milestone) => sum + milestone.percentage, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Payment Milestones
          </div>
          <Button onClick={addMilestone} size="sm" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Milestone
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {milestones.map((milestone, index) => (
            <div key={milestone.id} className="p-4 border rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Milestone {index + 1}</h4>
                <Button
                  onClick={() => removeMilestone(milestone.id)}
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
                    value={milestone.description}
                    onChange={(e) => updateMilestone(milestone.id, "description", e.target.value)}
                    placeholder="Payment milestone description"
                  />
                </div>

                <div>
                  <Label>Percentage (%)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={milestone.percentage}
                    onChange={(e) =>
                      updateMilestone(milestone.id, "percentage", Number.parseFloat(e.target.value) || 0)
                    }
                    min="0"
                    max="100"
                  />
                </div>

                <div>
                  <Label>Due Date</Label>
                  <Input
                    type="date"
                    value={milestone.dueDate}
                    onChange={(e) => updateMilestone(milestone.id, "dueDate", e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Amount: {formatCurrency(milestone.amount)}</span>
                <span className="text-gray-600">
                  {milestone.percentage}% of {formatCurrency(grandTotal)}
                </span>
              </div>
            </div>
          ))}

          {milestones.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No payment milestones added yet.</p>
              <Button onClick={addMilestone} className="mt-2">
                Add Your First Milestone
              </Button>
            </div>
          )}

          {milestones.length > 0 && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Percentage:</span>
                <span
                  className={`font-bold ${totalPercentage === 100 ? "text-green-600" : totalPercentage > 100 ? "text-red-600" : "text-orange-600"}`}
                >
                  {totalPercentage.toFixed(1)}%
                </span>
              </div>
              {totalPercentage !== 100 && (
                <p className="text-sm text-gray-600 mt-1">
                  {totalPercentage > 100
                    ? "Warning: Total percentage exceeds 100%"
                    : "Note: Total percentage should equal 100%"}
                </p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
