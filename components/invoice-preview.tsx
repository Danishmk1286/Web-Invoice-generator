"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Eye, Maximize2, X } from "lucide-react"

interface InvoiceData {
  companyName: string
  companyLogo: string
  companyAddress: string
  companyWebsite: string
  companyEmail: string
  companyPhone: string
  clientName: string
  clientEmail: string
  clientAddress: string
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
  paymentMilestones: Array<{
    id: string
    description: string
    percentage: number
    amount: number
    dueDate: string
  }>
  globalVatRate: number
  globalTransactionFeeRate: number
  absorbFees: boolean
  template: string
  showQuantity: boolean
  includeVat: boolean
  includeTransactionFees: boolean
  subtotal: number
  totalVat: number
  totalFees: number
  grandTotal: number
}

interface InvoicePreviewProps {
  invoiceData: InvoiceData
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

export function InvoicePreview({ invoiceData }: InvoicePreviewProps) {
  const [isFullScreen, setIsFullScreen] = useState(false)

  const formatCurrency = (amount: number) => {
    const symbol = currencySymbols[invoiceData.currency] || "$"
    return `${symbol}${amount.toFixed(2)}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getTemplateStyles = () => {
    switch (invoiceData.template) {
      case "minimalist":
        return {
          container: "bg-white border-none shadow-sm",
          header: "border-b border-gray-200 pb-6",
          accent: "text-gray-900",
          background: "bg-gray-50",
        }
      case "sidebar":
        return {
          container: "bg-white border-l-4 border-blue-500",
          header: "bg-blue-50 p-6 -m-6 mb-6",
          accent: "text-blue-600",
          background: "bg-blue-50",
        }
      case "creative":
        return {
          container: "bg-white border-t-8 border-purple-500",
          header: "bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 -m-6 mb-6 rounded-t-lg",
          accent: "text-purple-600",
          background: "bg-purple-50",
        }
      case "dark":
        return {
          container: "bg-gray-900 text-white border border-gray-700",
          header: "border-b border-gray-700 pb-6",
          accent: "text-cyan-400",
          background: "bg-gray-800",
        }
      default: // classic
        return {
          container: "bg-white border border-gray-200",
          header: "border-b border-gray-200 pb-6",
          accent: "text-blue-600",
          background: "bg-gray-50",
        }
    }
  }

  const styles = getTemplateStyles()

  const templates = [
    { id: "classic", name: "Classic" },
    { id: "minimalist", name: "Minimalist" },
    { id: "sidebar", name: "Sidebar" },
    { id: "creative", name: "Creative" },
    { id: "dark", name: "Dark" },
  ]

  const InvoiceContent = () => (
    <div className={`p-6 rounded-lg ${styles.container}`} style={{ minHeight: isFullScreen ? "90vh" : "800px" }}>
      {/* Header with Logo and Company Info */}
      <div className={styles.header}>
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-start gap-4">
            {/* Logo */}
            {invoiceData.companyLogo && (
              <div className="w-16 h-16 flex-shrink-0">
                <img
                  src={invoiceData.companyLogo || "/placeholder.svg"}
                  alt="Company Logo"
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            {/* Company Details */}
            <div>
              <h1 className={`text-3xl font-bold ${styles.accent}`}>{invoiceData.companyName}</h1>
              <div className="mt-2 text-sm opacity-80">
                <div>{invoiceData.companyPhone}</div>
                <div className="whitespace-pre-line">{invoiceData.companyAddress}</div>
              </div>
            </div>
          </div>

          {/* Invoice Info */}
          <div className="text-right">
            <h2 className="text-2xl font-bold">INVOICE</h2>
            <div className="mt-2 text-sm">
              <div>
                <strong>Invoice #:</strong> {invoiceData.invoiceNumber}
              </div>
              <div>
                <strong>Date:</strong> {formatDate(invoiceData.invoiceDate)}
              </div>
              <div>
                <strong>Due:</strong> {formatDate(invoiceData.dueDate)}
              </div>
            </div>
          </div>
        </div>

        {/* Bill To - Left Aligned */}
        <div className="mb-6">
          <div className="max-w-md">
            <h3 className="font-semibold mb-2">Bill To:</h3>
            <div className="text-sm">
              <div className="font-medium">{invoiceData.clientName}</div>
              <div>{invoiceData.clientEmail}</div>
              <div className="whitespace-pre-line">{invoiceData.clientAddress}</div>
            </div>
          </div>
        </div>

        {/* Additional Company Contact Info */}
        <div className="flex justify-end mb-6">
          <div className="max-w-md text-right text-sm opacity-80">
            <div>{invoiceData.companyEmail}</div>
            <div>{invoiceData.companyWebsite}</div>
          </div>
        </div>
      </div>

      {/* Line Items */}
      <div className="my-8">
        <div className={`rounded-lg p-4 ${styles.background}`}>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Description</th>
                {invoiceData.showQuantity && <th className="text-right py-2">Qty</th>}
                <th className="text-right py-2">Rate</th>
                <th className="text-right py-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoiceData.lineItems.map((item) => {
                const quantity = invoiceData.showQuantity ? item.quantity : 1
                const amount = quantity * item.unitPrice

                return (
                  <tr key={item.id} className="border-b border-opacity-50">
                    <td className="py-3">{item.description}</td>
                    {invoiceData.showQuantity && <td className="text-right py-3">{item.quantity}</td>}
                    <td className="text-right py-3">{formatCurrency(item.unitPrice)}</td>
                    <td className="text-right py-3 font-medium">{formatCurrency(amount)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Totals */}
      <div className="flex justify-end">
        <div className="w-64">
          <div className="flex justify-between py-2">
            <span>Subtotal:</span>
            <span>{formatCurrency(invoiceData.subtotal)}</span>
          </div>
          {invoiceData.includeVat && invoiceData.totalVat > 0 && (
            <div className="flex justify-between py-2">
              <span>VAT ({invoiceData.globalVatRate}%):</span>
              <span>{formatCurrency(invoiceData.totalVat)}</span>
            </div>
          )}
          {invoiceData.includeTransactionFees && invoiceData.totalFees > 0 && !invoiceData.absorbFees && (
            <div className="flex justify-between py-2">
              <span>Transaction Fees:</span>
              <span>{formatCurrency(invoiceData.totalFees)}</span>
            </div>
          )}
          <Separator className="my-2" />
          <div className="flex justify-between py-2 text-lg font-bold">
            <span>Total:</span>
            <span className={styles.accent}>{formatCurrency(invoiceData.grandTotal)}</span>
          </div>
        </div>
      </div>

      {/* Payment Milestones */}
      {invoiceData.paymentMilestones.length > 0 && (
        <div className="mt-8">
          <h3 className="font-semibold mb-4">Payment Schedule:</h3>
          <div className="space-y-2">
            {invoiceData.paymentMilestones.map((milestone) => (
              <div key={milestone.id} className="flex justify-between items-center p-3 bg-opacity-50 rounded">
                <div>
                  <div className="font-medium">{milestone.description}</div>
                  <div className="text-sm opacity-75">Due: {formatDate(milestone.dueDate)}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold">{formatCurrency(milestone.amount)}</div>
                  <div className="text-sm opacity-75">{milestone.percentage}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-12 pt-6 border-t border-opacity-50 text-center text-sm opacity-75">
        <p>Thank you for your business!</p>
        <p>Questions? Contact us at {invoiceData.companyEmail}</p>
      </div>
    </div>
  )

  if (isFullScreen) {
    return (
      <div className="fixed inset-0 z-50 bg-white overflow-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-blue-600" />
            <span className="font-semibold">Full Screen Preview</span>
            <Badge variant="outline" className="bg-white">
              {templates.find((t) => t.id === invoiceData.template)?.name || invoiceData.template}
            </Badge>
          </div>
          <Button
            onClick={() => setIsFullScreen(false)}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Exit Full Screen
          </Button>
        </div>
        <div className="max-w-4xl mx-auto p-6">
          <InvoiceContent />
        </div>
      </div>
    )
  }

  return (
    <Card className="h-fit shadow-lg">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-blue-600" />
            <span>Live Preview</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-white">
              {templates.find((t) => t.id === invoiceData.template)?.name || invoiceData.template}
            </Badge>
            <div className="text-sm text-gray-600">{formatCurrency(invoiceData.grandTotal)}</div>
            <Button
              onClick={() => setIsFullScreen(true)}
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <Maximize2 className="h-4 w-4" />
              Full Screen
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <InvoiceContent />
      </CardContent>
    </Card>
  )
}
