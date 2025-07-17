"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
  showRate: boolean
  showPaymentButton: boolean
  paymentLink: string
  notes: string
  customColors: {
    minimalist: string
    modern: string
    creative: string
    professional: string
  }
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
    const customColor = invoiceData.customColors[invoiceData.template as keyof typeof invoiceData.customColors]

    switch (invoiceData.template) {
      case "classic":
        return {
          container: "bg-white text-black border border-gray-300",
          headerBg: "bg-white",
          accent: "text-black",
          tableHeader: "bg-gray-100 text-black",
          separator: "border-gray-300",
          notesHeader: "bg-gray-100 text-black",
          paymentButton: "bg-black hover:bg-gray-800",
        }
      case "minimalist":
        return {
          container: "bg-white text-gray-800 border border-gray-200",
          headerBg: "bg-white",
          accent: `text-[${customColor}]`,
          tableHeader: `bg-[${customColor}]/10 text-[${customColor}]`,
          separator: `border-[${customColor}]/20`,
          notesHeader: `bg-[${customColor}]/10 text-[${customColor}]`,
          paymentButton: `bg-[${customColor}] hover:bg-[${customColor}]/90`,
        }
      case "modern":
        return {
          container: "bg-white text-gray-800 border border-gray-200",
          headerBg: `bg-[${customColor}]/5`,
          accent: `text-[${customColor}]`,
          tableHeader: `bg-[${customColor}]/10 text-[${customColor}]`,
          separator: `border-[${customColor}]/20`,
          notesHeader: `bg-[${customColor}]/10 text-[${customColor}]`,
          paymentButton: `bg-[${customColor}] hover:bg-[${customColor}]/90`,
        }
      case "creative":
        return {
          container: "bg-white text-gray-800 border border-gray-200",
          headerBg: `bg-[${customColor}]/5`,
          accent: `text-[${customColor}]`,
          tableHeader: `bg-[${customColor}]/10 text-[${customColor}]`,
          separator: `border-[${customColor}]/20`,
          notesHeader: `bg-[${customColor}]/10 text-[${customColor}]`,
          paymentButton: `bg-[${customColor}] hover:bg-[${customColor}]/90`,
        }
      case "professional":
        return {
          container: "bg-white text-gray-800 border border-gray-200",
          headerBg: `bg-[${customColor}]/5`,
          accent: `text-[${customColor}]`,
          tableHeader: `bg-[${customColor}]/10 text-[${customColor}]`,
          separator: `border-[${customColor}]/20`,
          notesHeader: `bg-[${customColor}]/10 text-[${customColor}]`,
          paymentButton: `bg-[${customColor}] hover:bg-[${customColor}]/90`,
        }
      default:
        return {
          container: "bg-white text-black border border-gray-300",
          headerBg: "bg-white",
          accent: "text-black",
          tableHeader: "bg-gray-100 text-black",
          separator: "border-gray-300",
          notesHeader: "bg-gray-100 text-black",
          paymentButton: "bg-black hover:bg-gray-800",
        }
    }
  }

  const styles = getTemplateStyles()

  const templates = [
    { id: "classic", name: "Classic" },
    { id: "minimalist", name: "Minimalist" },
    { id: "modern", name: "Modern" },
    { id: "creative", name: "Creative" },
    { id: "professional", name: "Professional" },
  ]

  const InvoiceContent = () => (
    <div className={`p-8 rounded-lg ${styles.container}`} style={{ minHeight: isFullScreen ? "90vh" : "800px" }}>
      {/* Header Section */}
      <div className={`p-6 -m-8 mb-8 ${styles.headerBg}`}>
        <div className="flex justify-between items-start">
          {/* Company Info */}
          <div className="flex items-start gap-6">
            {/* Logo */}
            {invoiceData.companyLogo && (
              <div className="w-20 h-20 flex-shrink-0">
                <img
                  src={invoiceData.companyLogo || "/placeholder.svg"}
                  alt="Company Logo"
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            {/* Company Details */}
            <div>
              <h1 className={`text-4xl font-bold ${styles.accent} mb-3`}>{invoiceData.companyName}</h1>
              <div className="text-sm text-gray-600 space-y-1">
                <div>{invoiceData.companyWebsite}</div>
                <div>{invoiceData.companyPhone}</div>
                <div>{invoiceData.companyEmail}</div>
                <div className="whitespace-pre-line">{invoiceData.companyAddress}</div>
              </div>
            </div>
          </div>

          {/* Invoice Info */}
          <div className="text-right">
            <h2 className={`text-3xl font-bold ${styles.accent} mb-4`}>INVOICE</h2>
            <div className="text-sm space-y-1">
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
      </div>

      {/* Bill To Section */}
      <div className="mb-8">
        <h3 className={`font-semibold text-lg ${styles.accent} mb-4`}>Bill To:</h3>
        <div className="text-sm">
          <div className="font-medium text-base mb-1">{invoiceData.clientName}</div>
          <div className="text-gray-600">{invoiceData.clientEmail}</div>
          <div className="whitespace-pre-line text-gray-600">{invoiceData.clientAddress}</div>
        </div>
      </div>

      {/* Line Items Table */}
      <div className="mb-8">
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className={styles.tableHeader}>
                <th className="text-left py-4 px-4 font-semibold">Description</th>
                {invoiceData.showQuantity && <th className="text-center py-4 px-4 font-semibold">Qty</th>}
                {invoiceData.showRate && <th className="text-right py-4 px-4 font-semibold">Rate</th>}
                <th className="text-right py-4 px-4 font-semibold">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoiceData.lineItems.map((item, index) => {
                const quantity = invoiceData.showQuantity ? item.quantity : 1
                const amount = quantity * item.unitPrice

                return (
                  <tr
                    key={item.id}
                    className={`border-t border-gray-200 hover:bg-gray-50 transition-colors ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-25"
                    }`}
                  >
                    <td className="py-4 px-4">{item.description}</td>
                    {invoiceData.showQuantity && <td className="text-center py-4 px-4">{item.quantity}</td>}
                    {invoiceData.showRate && <td className="text-right py-4 px-4">{formatCurrency(item.unitPrice)}</td>}
                    <td className="text-right py-4 px-4 font-medium">{formatCurrency(amount)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Totals Section */}
      <div className="flex justify-end mb-8">
        <div className="w-80">
          <div className="space-y-2">
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span>Subtotal:</span>
              <span className="font-medium">{formatCurrency(invoiceData.subtotal)}</span>
            </div>
            {invoiceData.includeVat && invoiceData.totalVat > 0 && (
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span>VAT ({invoiceData.globalVatRate}%):</span>
                <span className="font-medium">{formatCurrency(invoiceData.totalVat)}</span>
              </div>
            )}
            {invoiceData.includeTransactionFees && invoiceData.totalFees > 0 && !invoiceData.absorbFees && (
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span>Transaction Fees:</span>
                <span className="font-medium">{formatCurrency(invoiceData.totalFees)}</span>
              </div>
            )}
            <div className={`flex justify-between py-3 text-lg font-bold ${styles.accent} border-t-2 border-gray-300`}>
              <span>Total:</span>
              <span>{formatCurrency(invoiceData.grandTotal)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Button */}
      {invoiceData.showPaymentButton && invoiceData.paymentLink && (
        <div className="flex justify-end mb-8">
          <a
            href={invoiceData.paymentLink}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center px-8 py-3 rounded-lg font-semibold text-white transition-colors ${styles.paymentButton}`}
          >
            Pay Now
          </a>
        </div>
      )}

      {/* Notes Section - Moved above Payment Schedule */}
      {invoiceData.notes && (
        <div className="mb-8">
          <div className={`p-4 rounded-lg ${styles.notesHeader}`}>
            <h3 className="font-semibold text-lg mb-3">Notes</h3>
            <div className="text-sm whitespace-pre-line">{invoiceData.notes}</div>
          </div>
        </div>
      )}

      {/* Payment Milestones */}
      {invoiceData.paymentMilestones.length > 0 && (
        <div className="mb-8">
          <h3 className={`font-semibold text-lg ${styles.accent} mb-4`}>Payment Schedule:</h3>
          <div className="space-y-3">
            {invoiceData.paymentMilestones.map((milestone) => (
              <div key={milestone.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border">
                <div>
                  <div className="font-medium">{milestone.description}</div>
                  <div className="text-sm text-gray-600">Due: {formatDate(milestone.dueDate)}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold">{formatCurrency(milestone.amount)}</div>
                  <div className="text-sm text-gray-600">{milestone.percentage}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 border-t border-gray-200 pt-6">
        <p>Thank you for your business!</p>
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
