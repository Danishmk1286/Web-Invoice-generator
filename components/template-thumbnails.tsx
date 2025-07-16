"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Palette } from "lucide-react"

interface InvoiceData {
  companyName: string
  clientName: string
  invoiceNumber: string
  invoiceDate: string
  dueDate: string
  currency: string
  lineItems: Array<{
    id: string
    description: string
    quantity: number
    unitPrice: number
    vatRate: number
    transactionFeeRate: number
  }>
  subtotal: number
  totalVat: number
  totalFees: number
  grandTotal: number
}

interface TemplateThumbnailsProps {
  selectedTemplate: string
  onTemplateSelect: (template: string) => void
  invoiceData: InvoiceData
}

const templates = [
  { id: "classic", name: "Classic Corporate", color: "bg-blue-50 border-blue-200" },
  { id: "minimalist", name: "Minimalist", color: "bg-gray-50 border-gray-200" },
  { id: "sidebar", name: "Modern Sidebar", color: "bg-indigo-50 border-indigo-200" },
  { id: "creative", name: "Creative Freelancer", color: "bg-purple-50 border-purple-200" },
  { id: "blueprint", name: "Tech Blueprint", color: "bg-cyan-50 border-cyan-200" },
  { id: "elegant", name: "Elegant Marquee", color: "bg-emerald-50 border-emerald-200" },
  { id: "grid", name: "Grid & Icons", color: "bg-red-50 border-red-200" },
  { id: "dark", name: "Dark Mode", color: "bg-slate-800 border-slate-600" },
]

const currencySymbols: { [key: string]: string } = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  CAD: "C$",
  AUD: "A$",
  JPY: "¥",
  INR: "₹",
}

export function TemplateThumbnails({ selectedTemplate, onTemplateSelect, invoiceData }: TemplateThumbnailsProps) {
  const formatCurrency = (amount: number) => {
    const symbol = currencySymbols[invoiceData.currency] || "$"
    return `${symbol}${amount.toFixed(2)}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const renderThumbnail = (template: any) => {
    const isSelected = selectedTemplate === template.id

    return (
      <div
        key={template.id}
        className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all hover:shadow-md ${
          isSelected ? "border-blue-500 bg-blue-50 shadow-lg" : "border-gray-200 bg-white hover:border-blue-300"
        }`}
        onClick={() => onTemplateSelect(template.id)}
      >
        <div className="text-center">
          <div className={`text-sm font-medium ${isSelected ? "text-blue-700" : "text-gray-700"}`}>{template.name}</div>
        </div>

        {/* Selected Indicator */}
        {isSelected && (
          <div className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
            <span className="text-xs">✓</span>
          </div>
        )}
      </div>
    )
  }

  return (
    <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Palette className="h-5 w-5 text-purple-600" />
          <h2 className="text-lg font-semibold text-purple-800">Choose Your Template</h2>
          <Badge variant="outline" className="bg-white text-purple-700">
            {templates.find((t) => t.id === selectedTemplate)?.name}
          </Badge>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">{templates.map(renderThumbnail)}</div>
      </CardContent>
    </Card>
  )
}
