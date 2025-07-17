"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Eye, Maximize2, X, CreditCard } from "lucide-react"

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
  showRate: boolean
  showPayButton: boolean
  includeVat: boolean
  includeTransactionFees: boolean
  paymentLink: string
  templateColors: {
    [key: string]: {
      primary: string
      secondary: string
      text: string
      background: string
    }
  }
  fieldLabels: {
    description: string
    quantity: string
    rate: string
    amount: string
    subtotal: string
    total: string
  }
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
    const colors = invoiceData.templateColors[invoiceData.template]

    switch (invoiceData.template) {
      case "green":
        return {
          container: `bg-white border border-gray-200`,
          header: `bg-gradient-to-r from-green-500 to-green-600 text-white p-6 -m-6 mb-6`,
          accent: colors.primary,
          background: colors.secondary,
          tableHeader: `bg-green-500 text-white`,
          fromToSection: `bg-green-500 text-white p-4 rounded`,
        }
      case "modern":
        return {
          container: `bg-white border border-gray-200 relative overflow-hidden`,
          header: `pb-6 relative`,
          accent: colors.primary,
          background: colors.secondary,
          tableHeader: `bg-gray-200 text-gray-800`,
          waveBottom: true,
        }
      case "blue":
        return {
          container: `bg-white border border-gray-200`,
          header: `bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 -m-6 mb-6`,
          accent: colors.primary,
          background: colors.secondary,
          tableHeader: `bg-blue-600 text-white`,
        }
      case "minimalist":
        return {
          container: `bg-white border border-gray-200`,
          header: `border-b border-gray-200 pb-6`,
          accent: colors.primary,
          background: colors.secondary,
          tableHeader: `bg-gray-100 text-gray-800`,
        }
      default: // classic
        return {
          container: `bg-white border border-gray-200`,
          header: `border-b border-gray-200 pb-6`,
          accent: colors.primary,
          background: colors.secondary,
          tableHeader: `bg-blue-50 text-blue-800`,
        }
    }
  }

  const styles = getTemplateStyles()

  const templates = [
    { id: "minimalist", name: "Minimalist" },
    { id: "classic", name: "Classic" },
    { id: "green", name: "Green Business" },
    { id: "modern", name: "Modern Wave" },
    { id: "blue", name: "Blue Professional" },
  ]

  const InvoiceContent = () => (
    <div className={`p-6 rounded-lg ${styles.container}`} style={{ minHeight: isFullScreen ? "90vh" : "800px" }}>
      {/* Header */}
      <div className={styles.header}>
        {invoiceData.template === "green" || invoiceData.template === "blue" ? (
          // Green/Blue Template Header
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <h1 className="text-4xl font-bold">Invoice</h1>
              {invoiceData.companyLogo && (
                <div className="w-16 h-16 bg-white rounded p-2">
                  <img
                    src={invoiceData.companyLogo || "/placeholder.svg"}
                    alt="Company Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
            </div>
            <div className="text-right text-white">
              <div className="text-lg font-semibold">{invoiceData.companyName}</div>
              <div className="text-sm opacity-90">{invoiceData.companyPhone}</div>
              <div className="text-sm opacity-90">{invoiceData.companyEmail}</div>
              <div className="text-sm opacity-90">{invoiceData.companyWebsite}</div>
            </div>
          </div>
        ) : invoiceData.template === "modern" ? (
          // Modern Template Header
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-start gap-4">
              {invoiceData.companyLogo && (
                <div className="w-16 h-16 border rounded p-2">
                  <img
                    src={invoiceData.companyLogo || "/placeholder.svg"}
                    alt="Company Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
              <div>
                <div className="text-sm text-gray-600">YOUR LOGO</div>
              </div>
            </div>
            <div className="text-right">
              <h1 className="text-6xl font-black">INVOICE</h1>
              <div className="text-lg font-semibold mt-2">NO. {invoiceData.invoiceNumber}</div>
            </div>
          </div>
        ) : (
          // Minimalist/Classic Template Header
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-start gap-4">
              {invoiceData.companyLogo && (
                <div className="w-16 h-16 border rounded p-2">
                  <img
                    src={invoiceData.companyLogo || "/placeholder.svg"}
                    alt="Company Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
              <div>
                <h1 className={`text-3xl font-bold`} style={{ color: styles.accent }}>
                  {invoiceData.companyName}
                </h1>
                <div className="mt-2 text-sm text-gray-600">
                  <div>{invoiceData.companyPhone}</div>
                  <div className="whitespace-pre-line">{invoiceData.companyAddress}</div>
                  <div>{invoiceData.companyEmail}</div>
                  <div>{invoiceData.companyWebsite}</div>
                </div>
              </div>
            </div>
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
        )}
      </div>

      {/* From/To Section for Green Template */}
      {invoiceData.template === "green" && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className={styles.fromToSection}>
            <h3 className="font-semibold mb-2 text-center">From</h3>
            <div className="text-sm">
              <div className="font-medium">{invoiceData.companyName}</div>
              <div className="whitespace-pre-line">{invoiceData.companyAddress}</div>
              <div>{invoiceData.companyPhone}</div>
            </div>
          </div>
          <div className={styles.fromToSection}>
            <h3 className="font-semibold mb-2 text-center">To</h3>
            <div className="text-sm">
              <div className="font-medium">{invoiceData.clientName}</div>
              <div className="whitespace-pre-line">{invoiceData.clientAddress}</div>
              <div>{invoiceData.clientEmail}</div>
            </div>
          </div>
        </div>
      )}

      {/* Bill To Section for other templates */}
      {invoiceData.template !== "green" && (
        <div className="mb-6">
          {invoiceData.template === "modern" ? (
            <div className="grid grid-cols-2 gap-8 mb-6">
              <div>
                <h3 className="font-bold mb-2">Date: {formatDate(invoiceData.invoiceDate)}</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold">Billed to:</h4>
                    <div className="text-sm">
                      <div className="font-medium">{invoiceData.clientName}</div>
                      <div className="whitespace-pre-line">{invoiceData.clientAddress}</div>
                      <div>{invoiceData.clientEmail}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div>
                  <h4 className="font-bold">From:</h4>
                  <div className="text-sm">
                    <div className="font-medium">{invoiceData.companyName}</div>
                    <div className="whitespace-pre-line">{invoiceData.companyAddress}</div>
                    <div>{invoiceData.companyEmail}</div>
                  </div>
                </div>
              </div>
            </div>
          ) : invoiceData.template === "blue" ? (
            <div className="grid grid-cols-2 gap-8 mb-6">
              <div>
                <h3 className="font-semibold mb-2">INVOICE DETAILS:</h3>
                <div className="text-sm space-y-1">
                  <div>
                    <strong>Invoice #:</strong> {invoiceData.invoiceNumber}
                  </div>
                  <div>
                    <strong>Date of Issue:</strong> {formatDate(invoiceData.invoiceDate)}
                  </div>
                  <div>
                    <strong>Due Date:</strong> {formatDate(invoiceData.dueDate)}
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">BILL TO:</h3>
                <div className="text-sm">
                  <div className="font-medium">{invoiceData.clientName}</div>
                  <div className="whitespace-pre-line">{invoiceData.clientAddress}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-md">
              <h3 className="font-semibold mb-2">Bill To:</h3>
              <div className="text-sm">
                <div className="font-medium">{invoiceData.clientName}</div>
                <div>{invoiceData.clientEmail}</div>
                <div className="whitespace-pre-line">{invoiceData.clientAddress}</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Line Items */}
      <div className="my-8">
        <div className={`rounded-lg overflow-hidden`}>
          <table className="w-full">
            <thead>
              <tr className={styles.tableHeader}>
                <th className="text-left py-3 px-4">{invoiceData.fieldLabels.description}</th>
                {invoiceData.showQuantity && (
                  <th className="text-right py-3 px-4">{invoiceData.fieldLabels.quantity}</th>
                )}
                {invoiceData.showRate && <th className="text-right py-3 px-4">{invoiceData.fieldLabels.rate}</th>}
                <th className="text-right py-3 px-4">{invoiceData.fieldLabels.amount}</th>
              </tr>
            </thead>
            <tbody>
              {invoiceData.lineItems.map((item, index) => {
                const quantity = invoiceData.showQuantity ? item.quantity : 1
                const amount = quantity * item.unitPrice

                return (
                  <tr key={item.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="py-3 px-4">{item.description}</td>
                    {invoiceData.showQuantity && <td className="text-right py-3 px-4">{item.quantity}</td>}
                    {invoiceData.showRate && <td className="text-right py-3 px-4">{formatCurrency(item.unitPrice)}</td>}
                    <td className="text-right py-3 px-4 font-medium">{formatCurrency(amount)}</td>
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
            <span>{invoiceData.fieldLabels.subtotal}:</span>
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
            <span>{invoiceData.fieldLabels.total}:</span>
            <span style={{ color: styles.accent }}>{formatCurrency(invoiceData.grandTotal)}</span>
          </div>
        </div>
      </div>

      {/* Pay Now Button */}
      {invoiceData.showPayButton && invoiceData.paymentLink && (
        <div className="mt-8 text-center">
          <Button asChild size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3">
            <a href={invoiceData.paymentLink} target="_blank" rel="noopener noreferrer">
              <CreditCard className="h-5 w-5 mr-2" />
              Pay Now
            </a>
          </Button>
        </div>
      )}

      {/* Payment Milestones */}
      {invoiceData.paymentMilestones.length > 0 && (
        <div className="mt-8">
          <h3 className="font-semibold mb-4">Payment Schedule:</h3>
          <div className="space-y-2">
            {invoiceData.paymentMilestones.map((milestone) => (
              <div key={milestone.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
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
      <div className="mt-12 pt-6 border-t text-center text-sm text-gray-600">
        <p>Thank you for your business!</p>
        <p>Questions? Contact us at {invoiceData.companyEmail}</p>
      </div>

      {/* Modern Template Wave Bottom */}
      {invoiceData.template === "modern" && (
        <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-full">
            <path
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
              opacity=".25"
              className="fill-gray-300"
            ></path>
            <path
              d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
              opacity=".5"
              className="fill-gray-400"
            ></path>
            <path
              d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
              className="fill-gray-500"
            ></path>
          </svg>
        </div>
      )}
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
