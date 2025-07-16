"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { InvoicePreview } from "@/components/invoice-preview"
import { LineItemsManager } from "@/components/line-items-manager"
import { PaymentMilestonesManager } from "@/components/payment-milestones-manager"
import { TemplateThumbnails } from "@/components/template-thumbnails"
import { Upload, Download, Mail } from "lucide-react"

interface InvoiceData {
  // Company Details
  companyName: string
  companyLogo: string
  companyAddress: string
  companyWebsite: string
  companyEmail: string
  companyPhone: string

  // Client Details
  clientName: string
  clientEmail: string
  clientAddress: string

  // Invoice Details
  invoiceNumber: string
  invoiceDate: string
  dueDate: string
  currency: string

  // Line Items
  lineItems: Array<{
    id: string
    description: string
    quantity: number
    unitPrice: number
    vatRate: number
    transactionFeeRate: number
  }>

  // Payment Milestones
  paymentMilestones: Array<{
    id: string
    description: string
    percentage: number
    amount: number
    dueDate: string
  }>

  // Settings
  globalVatRate: number
  globalTransactionFeeRate: number
  absorbFees: boolean
  template: string

  // Totals (calculated)
  subtotal: number
  totalVat: number
  totalFees: number
  grandTotal: number
}

const currencies = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
]

export function InvoiceBuilder() {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    companyName: "Your Company Name",
    companyLogo: "",
    companyAddress: "123 Business Street\nCity, State 12345",
    companyWebsite: "www.yourcompany.com",
    companyEmail: "hello@yourcompany.com",
    companyPhone: "+1 (555) 123-4567",

    clientName: "Client Company",
    clientEmail: "client@company.com",
    clientAddress: "456 Client Avenue\nClient City, State 67890",

    invoiceNumber: "INV-001",
    invoiceDate: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    currency: "USD",

    lineItems: [
      {
        id: "1",
        description: "Web Development Services",
        quantity: 40,
        unitPrice: 75,
        vatRate: 20,
        transactionFeeRate: 2.9,
      },
    ],

    paymentMilestones: [
      {
        id: "1",
        description: "50% Advance Payment",
        percentage: 50,
        amount: 0,
        dueDate: new Date().toISOString().split("T")[0],
      },
      {
        id: "2",
        description: "50% Final Payment",
        percentage: 50,
        amount: 0,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      },
    ],

    globalVatRate: 20,
    globalTransactionFeeRate: 2.9,
    absorbFees: false,
    template: "classic",

    subtotal: 0,
    totalVat: 0,
    totalFees: 0,
    grandTotal: 0,
  })

  // Calculate totals whenever line items change
  useEffect(() => {
    const subtotal = invoiceData.lineItems.reduce((sum, item) => {
      return sum + item.quantity * item.unitPrice
    }, 0)

    const totalVat = invoiceData.lineItems.reduce((sum, item) => {
      const itemTotal = item.quantity * item.unitPrice
      const vatRate = item.vatRate || invoiceData.globalVatRate
      return sum + (itemTotal * vatRate) / 100
    }, 0)

    const totalFees = invoiceData.lineItems.reduce((sum, item) => {
      const itemTotal = item.quantity * item.unitPrice
      const feeRate = item.transactionFeeRate || invoiceData.globalTransactionFeeRate
      return sum + (itemTotal * feeRate) / 100
    }, 0)

    const grandTotal = subtotal + totalVat + (invoiceData.absorbFees ? 0 : totalFees)

    // Update payment milestones amounts
    const updatedMilestones = invoiceData.paymentMilestones.map((milestone) => ({
      ...milestone,
      amount: (grandTotal * milestone.percentage) / 100,
    }))

    setInvoiceData((prev) => ({
      ...prev,
      subtotal,
      totalVat,
      totalFees,
      grandTotal,
      paymentMilestones: updatedMilestones,
    }))
  }, [invoiceData.lineItems, invoiceData.globalVatRate, invoiceData.globalTransactionFeeRate, invoiceData.absorbFees])

  const updateInvoiceData = (field: string, value: any) => {
    setInvoiceData((prev) => ({ ...prev, [field]: value }))
  }

  const handleDownloadPDF = () => {
    alert("PDF download functionality would be implemented here")
  }

  const handleEmailInvoice = () => {
    alert("Email functionality would be implemented here")
  }

  return (
    <div className="space-y-6">
      {/* Top Row: Template Thumbnails */}
      <TemplateThumbnails
        selectedTemplate={invoiceData.template}
        onTemplateSelect={(template) => updateInvoiceData("template", template)}
        invoiceData={invoiceData}
      />

      {/* Main Panel: Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Pane: Invoice Customization Controls */}
        <div className="space-y-6">
          {/* Invoice Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Invoice Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="invoiceNumber">Invoice Number</Label>
                  <Input
                    id="invoiceNumber"
                    value={invoiceData.invoiceNumber}
                    onChange={(e) => updateInvoiceData("invoiceNumber", e.target.value)}
                    placeholder="INV-001"
                  />
                </div>
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={invoiceData.currency} onValueChange={(value) => updateInvoiceData("currency", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          {currency.symbol} {currency.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="invoiceDate">Invoice Date</Label>
                  <Input
                    id="invoiceDate"
                    type="date"
                    value={invoiceData.invoiceDate}
                    onChange={(e) => updateInvoiceData("invoiceDate", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={invoiceData.dueDate}
                    onChange={(e) => updateInvoiceData("dueDate", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Company Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Your Business Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={invoiceData.companyName}
                    onChange={(e) => updateInvoiceData("companyName", e.target.value)}
                    placeholder="Your Company Name"
                  />
                </div>
                <div>
                  <Label htmlFor="companyWebsite">Website</Label>
                  <Input
                    id="companyWebsite"
                    value={invoiceData.companyWebsite}
                    onChange={(e) => updateInvoiceData("companyWebsite", e.target.value)}
                    placeholder="www.yourcompany.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="companyEmail">Email</Label>
                  <Input
                    id="companyEmail"
                    type="email"
                    value={invoiceData.companyEmail}
                    onChange={(e) => updateInvoiceData("companyEmail", e.target.value)}
                    placeholder="hello@yourcompany.com"
                  />
                </div>
                <div>
                  <Label htmlFor="companyPhone">Phone</Label>
                  <Input
                    id="companyPhone"
                    value={invoiceData.companyPhone}
                    onChange={(e) => updateInvoiceData("companyPhone", e.target.value)}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="companyAddress">Business Address</Label>
                <Textarea
                  id="companyAddress"
                  value={invoiceData.companyAddress}
                  onChange={(e) => updateInvoiceData("companyAddress", e.target.value)}
                  rows={3}
                  placeholder="123 Business Street\nCity, State 12345"
                />
              </div>
            </CardContent>
          </Card>

          {/* Client Details */}
          <Card>
            <CardHeader>
              <CardTitle>Bill To</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="clientName">Client Name</Label>
                  <Input
                    id="clientName"
                    value={invoiceData.clientName}
                    onChange={(e) => updateInvoiceData("clientName", e.target.value)}
                    placeholder="Client Company Name"
                  />
                </div>
                <div>
                  <Label htmlFor="clientEmail">Client Email</Label>
                  <Input
                    id="clientEmail"
                    type="email"
                    value={invoiceData.clientEmail}
                    onChange={(e) => updateInvoiceData("clientEmail", e.target.value)}
                    placeholder="client@company.com"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="clientAddress">Client Address</Label>
                <Textarea
                  id="clientAddress"
                  value={invoiceData.clientAddress}
                  onChange={(e) => updateInvoiceData("clientAddress", e.target.value)}
                  rows={3}
                  placeholder="456 Client Avenue\nClient City, State 67890"
                />
              </div>
            </CardContent>
          </Card>

          {/* Line Items */}
          <LineItemsManager
            lineItems={invoiceData.lineItems}
            currency={invoiceData.currency}
            globalVatRate={invoiceData.globalVatRate}
            globalTransactionFeeRate={invoiceData.globalTransactionFeeRate}
            onUpdate={(lineItems) => updateInvoiceData("lineItems", lineItems)}
          />

          {/* Payment Milestones */}
          <PaymentMilestonesManager
            milestones={invoiceData.paymentMilestones}
            currency={invoiceData.currency}
            grandTotal={invoiceData.grandTotal}
            onUpdate={(milestones) => updateInvoiceData("paymentMilestones", milestones)}
          />
        </div>

        {/* Right Pane: Sticky Real-time PDF Preview */}
        <div className="sticky top-4 h-fit">
          <InvoicePreview invoiceData={invoiceData} />
        </div>
      </div>

      {/* Bottom: Ready to Generate Section */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Ready to Generate?</h2>
            <p className="text-blue-100 text-lg">Your professional invoice is ready for download</p>
            <div className="flex justify-center gap-4">
              <Button
                onClick={handleDownloadPDF}
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-3"
              >
                <Download className="h-5 w-5 mr-2" />
                Download PDF
              </Button>
              <Button
                onClick={handleEmailInvoice}
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent px-8 py-3"
              >
                <Mail className="h-5 w-5 mr-2" />
                Email
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Copyright Footer */}
      <div className="mt-12 pt-6 border-t border-gray-200 text-center text-sm text-gray-600">
        <p>
          © 2024 Professional Invoice Generator. Created by{" "}
          <a
            href="https://linkedin.com/in/danishmk1286"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Danish Khan
          </a>
        </p>
      </div>
    </div>
  )
}
