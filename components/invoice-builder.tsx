"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { InvoicePreview } from "@/components/invoice-preview"
import { LineItemsManager } from "@/components/line-items-manager"
import { PaymentMilestonesManager } from "@/components/payment-milestones-manager"
import { TemplateThumbnails } from "@/components/template-thumbnails"
import { Upload, Download, Mail, ChevronDown, Palette } from "lucide-react"
import { ImageIcon } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

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
  showQuantity: boolean
  includeVat: boolean
  includeTransactionFees: boolean
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

const isValidUrl = (string: string) => {
  try {
    new URL(string)
    return true
  } catch (_) {
    return false
  }
}

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
        quantity: 1,
        unitPrice: 3000,
        vatRate: 0,
        transactionFeeRate: 0,
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

    globalVatRate: 0,
    globalTransactionFeeRate: 0,
    absorbFees: false,
    template: "classic",
    showQuantity: false,
    includeVat: false,
    includeTransactionFees: false,
    showRate: true,
    showPaymentButton: true,
    paymentLink: "",
    notes: "",
    customColors: {
      minimalist: "#3b82f6", // blue-500
      modern: "#10b981", // emerald-500
      creative: "#8b5cf6", // violet-500
      professional: "#6366f1", // indigo-500
    },

    subtotal: 0,
    totalVat: 0,
    totalFees: 0,
    grandTotal: 0,
  })

  // Calculate totals whenever line items change
  useEffect(() => {
    const subtotal = invoiceData.lineItems.reduce((sum, item) => {
      const quantity = invoiceData.showQuantity ? item.quantity : 1
      return sum + quantity * item.unitPrice
    }, 0)

    const totalVat = invoiceData.includeVat
      ? invoiceData.lineItems.reduce((sum, item) => {
          const quantity = invoiceData.showQuantity ? item.quantity : 1
          const itemTotal = quantity * item.unitPrice
          const vatRate = item.vatRate || invoiceData.globalVatRate
          return sum + (itemTotal * vatRate) / 100
        }, 0)
      : 0

    const totalFees = invoiceData.includeTransactionFees
      ? invoiceData.lineItems.reduce((sum, item) => {
          const quantity = invoiceData.showQuantity ? item.quantity : 1
          const itemTotal = quantity * item.unitPrice
          const feeRate = item.transactionFeeRate || invoiceData.globalTransactionFeeRate
          return sum + (itemTotal * feeRate) / 100
        }, 0)
      : 0

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
  }, [
    invoiceData.lineItems,
    invoiceData.globalVatRate,
    invoiceData.globalTransactionFeeRate,
    invoiceData.absorbFees,
    invoiceData.showQuantity,
    invoiceData.includeVat,
    invoiceData.includeTransactionFees,
    invoiceData.showRate,
  ])

  const updateInvoiceData = (field: string, value: any) => {
    setInvoiceData((prev) => ({ ...prev, [field]: value }))
  }

  const updateCustomColor = (template: string, color: string) => {
    setInvoiceData((prev) => ({
      ...prev,
      customColors: {
        ...prev.customColors,
        [template]: color,
      },
    }))
  }

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        updateInvoiceData("companyLogo", result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDownloadPDF = () => {
    alert("PDF download functionality would be implemented here")
  }

  const handleEmailInvoice = () => {
    alert("Email functionality would be implemented here")
  }

  const coloredTemplates = ["minimalist", "modern", "creative", "professional"]

  return (
    <div className="space-y-6">
      {/* Top Row: Template Thumbnails */}
      <TemplateThumbnails
        selectedTemplate={invoiceData.template}
        onTemplateSelect={(template) => updateInvoiceData("template", template)}
        invoiceData={invoiceData}
      />

      {/* Color Customization for Colored Templates */}
      {coloredTemplates.includes(invoiceData.template) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Template Color Customization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Label htmlFor="template-color">
                {invoiceData.template.charAt(0).toUpperCase() + invoiceData.template.slice(1)} Theme Color:
              </Label>
              <div className="flex items-center gap-2">
                <input
                  id="template-color"
                  type="color"
                  value={invoiceData.customColors[invoiceData.template as keyof typeof invoiceData.customColors]}
                  onChange={(e) => updateCustomColor(invoiceData.template, e.target.value)}
                  className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                />
                <span className="text-sm text-gray-600">
                  {invoiceData.customColors[invoiceData.template as keyof typeof invoiceData.customColors]}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={invoiceData.currency} onValueChange={(value) => updateInvoiceData("currency", value)}>
                    <SelectTrigger className="mt-1">
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
              </div>

              <Separator className="my-4" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="invoiceDate">Invoice Date</Label>
                  <Input
                    id="invoiceDate"
                    type="date"
                    value={invoiceData.invoiceDate}
                    onChange={(e) => updateInvoiceData("invoiceDate", e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={invoiceData.dueDate}
                    onChange={(e) => updateInvoiceData("dueDate", e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Business Branding & Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Business Branding & Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Logo Upload Section */}
              <div>
                <Label htmlFor="logo-upload" className="flex items-center gap-2">
                  Business Logo
                  <div className="group relative">
                    <span className="text-gray-400 cursor-help">?</span>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      Use a square logo for optimal fit
                    </div>
                  </div>
                </Label>

                <div className="mt-2">
                  {!invoiceData.companyLogo ? (
                    <div
                      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
                      onClick={() => document.getElementById("logo-upload")?.click()}
                    >
                      <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">Drag and drop your logo here</p>
                      <p className="text-sm text-gray-500 mb-4">or</p>
                      <Button type="button" className="bg-blue-600 hover:bg-blue-700">
                        Choose File
                      </Button>
                      <p className="text-xs text-gray-500 mt-2">PNG, JPG up to 5MB</p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 border rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                        <img
                          src={invoiceData.companyLogo || "/placeholder.svg"}
                          alt="Company Logo"
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 mb-2">Logo uploaded successfully</p>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById("logo-upload")?.click()}
                          >
                            Replace
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => updateInvoiceData("companyLogo", "")}
                            className="text-red-600 hover:text-red-700"
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  <input id="logo-upload" type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                </div>
              </div>

              <Separator />

              {/* Business Information - Single Column Layout */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="companyName" className="flex items-center gap-2">
                    Business Name
                    <div className="group relative">
                      <span className="text-gray-400 cursor-help">?</span>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        Your official business or company name
                      </div>
                    </div>
                  </Label>
                  <Input
                    id="companyName"
                    value={invoiceData.companyName}
                    onChange={(e) => updateInvoiceData("companyName", e.target.value)}
                    placeholder="Your Company Name"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="companyWebsite">Website</Label>
                  <Input
                    id="companyWebsite"
                    value={invoiceData.companyWebsite}
                    onChange={(e) => updateInvoiceData("companyWebsite", e.target.value)}
                    placeholder="www.yourcompany.com"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="companyPhone">Phone Number</Label>
                  <Input
                    id="companyPhone"
                    value={invoiceData.companyPhone}
                    onChange={(e) => updateInvoiceData("companyPhone", e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="companyEmail">Email</Label>
                  <Input
                    id="companyEmail"
                    type="email"
                    value={invoiceData.companyEmail}
                    onChange={(e) => updateInvoiceData("companyEmail", e.target.value)}
                    placeholder="contact@yourcompany.com"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="companyAddress" className="flex items-center gap-2">
                    Location Address
                    <div className="group relative">
                      <span className="text-gray-400 cursor-help">?</span>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        Keep each line under 40 characters for best formatting
                      </div>
                    </div>
                  </Label>
                  <Textarea
                    id="companyAddress"
                    value={invoiceData.companyAddress}
                    onChange={(e) => updateInvoiceData("companyAddress", e.target.value)}
                    rows={3}
                    placeholder="123 Business Street&#10;City, State 12345"
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">{invoiceData.companyAddress.length}/200 characters</p>
                </div>
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
                    className="mt-1"
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
                    className="mt-1"
                  />
                </div>
              </div>

              <Separator />

              <div>
                <Label htmlFor="clientAddress">Client Address</Label>
                <Textarea
                  id="clientAddress"
                  value={invoiceData.clientAddress}
                  onChange={(e) => updateInvoiceData("clientAddress", e.target.value)}
                  rows={3}
                  placeholder="456 Client Avenue&#10;Client City, State 67890"
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Invoice Customization Options */}
          <Card>
            <CardHeader>
              <CardTitle>Invoice Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <Collapsible>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full justify-between bg-transparent">
                    Field Display Options
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4 mt-4">
                  {/* Show Quantity Toggle */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="showQuantity"
                        checked={invoiceData.showQuantity}
                        onCheckedChange={(checked) => updateInvoiceData("showQuantity", checked)}
                      />
                      <Label htmlFor="showQuantity" className="text-sm font-medium">
                        Show Quantity Column
                      </Label>
                      <div className="group relative">
                        <span className="text-gray-400 cursor-help">?</span>
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          Display quantity field for each line item
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Show Rate Toggle */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="showRate"
                        checked={invoiceData.showRate}
                        onCheckedChange={(checked) => updateInvoiceData("showRate", checked)}
                      />
                      <Label htmlFor="showRate" className="text-sm font-medium">
                        Show Rate Column
                      </Label>
                      <div className="group relative">
                        <span className="text-gray-400 cursor-help">?</span>
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          Display unit price/rate for each item
                        </div>
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Separator className="my-4" />

              <Collapsible>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full justify-between bg-transparent">
                    Tax & Fee Settings
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4 mt-4">
                  {/* Include VAT Toggle */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="includeVat"
                      checked={invoiceData.includeVat}
                      onCheckedChange={(checked) => updateInvoiceData("includeVat", checked)}
                    />
                    <Label htmlFor="includeVat" className="text-sm font-medium">
                      Include VAT/GST
                    </Label>
                  </div>

                  {/* VAT Rate Input - Only show when VAT is enabled */}
                  {invoiceData.includeVat && (
                    <>
                      <Separator />
                      <div>
                        <Label htmlFor="globalVatRate">Default VAT Rate (%)</Label>
                        <Input
                          id="globalVatRate"
                          type="number"
                          step="0.1"
                          value={invoiceData.globalVatRate}
                          onChange={(e) => updateInvoiceData("globalVatRate", Number.parseFloat(e.target.value) || 0)}
                          min="0"
                          max="100"
                          placeholder="20"
                          className="mt-1"
                        />
                      </div>
                    </>
                  )}

                  <Separator />

                  {/* Include Transaction Fees Toggle */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="includeTransactionFees"
                      checked={invoiceData.includeTransactionFees}
                      onCheckedChange={(checked) => updateInvoiceData("includeTransactionFees", checked)}
                    />
                    <Label htmlFor="includeTransactionFees" className="text-sm font-medium">
                      Include Transaction Fees
                    </Label>
                  </div>

                  {/* Transaction Fee Rate Input - Only show when fees are enabled */}
                  {invoiceData.includeTransactionFees && (
                    <>
                      <Separator />
                      <div>
                        <Label htmlFor="globalTransactionFeeRate">Default Transaction Fee Rate (%)</Label>
                        <Input
                          id="globalTransactionFeeRate"
                          type="number"
                          step="0.1"
                          value={invoiceData.globalTransactionFeeRate}
                          onChange={(e) =>
                            updateInvoiceData("globalTransactionFeeRate", Number.parseFloat(e.target.value) || 0)
                          }
                          min="0"
                          max="100"
                          placeholder="2.9"
                          className="mt-1"
                        />
                      </div>
                    </>
                  )}
                </CollapsibleContent>
              </Collapsible>

              <Separator className="my-4" />

              <Collapsible>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full justify-between bg-transparent">
                    Payment Options
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4 mt-4">
                  {/* Payment Button Toggle */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="showPaymentButton"
                      checked={invoiceData.showPaymentButton}
                      onCheckedChange={(checked) => updateInvoiceData("showPaymentButton", checked)}
                    />
                    <Label htmlFor="showPaymentButton" className="text-sm font-medium">
                      Show "Pay Now" Button
                    </Label>
                    <div className="group relative">
                      <span className="text-gray-400 cursor-help">?</span>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        Add a payment button below the total
                      </div>
                    </div>
                  </div>

                  {/* Payment Link Input - Only show when payment button is enabled */}
                  {invoiceData.showPaymentButton && (
                    <>
                      <Separator />
                      <div>
                        <Label htmlFor="paymentLink">Payment Link</Label>
                        <Input
                          id="paymentLink"
                          type="url"
                          value={invoiceData.paymentLink}
                          onChange={(e) => updateInvoiceData("paymentLink", e.target.value)}
                          placeholder="https://paypal.me/yourlink or https://buy.stripe.com/..."
                          className="mt-1"
                        />
                        {invoiceData.paymentLink && !isValidUrl(invoiceData.paymentLink) && (
                          <p className="text-xs text-red-600 mt-1">Please enter a valid URL</p>
                        )}
                      </div>
                    </>
                  )}
                </CollapsibleContent>
              </Collapsible>
            </CardContent>
          </Card>

          {/* Line Items */}
          <LineItemsManager
            lineItems={invoiceData.lineItems}
            currency={invoiceData.currency}
            globalVatRate={invoiceData.globalVatRate}
            globalTransactionFeeRate={invoiceData.globalTransactionFeeRate}
            showQuantity={invoiceData.showQuantity}
            showRate={invoiceData.showRate}
            includeVat={invoiceData.includeVat}
            includeTransactionFees={invoiceData.includeTransactionFees}
            onUpdate={(lineItems) => updateInvoiceData("lineItems", lineItems)}
          />

          {/* Payment Milestones */}
          <PaymentMilestonesManager
            milestones={invoiceData.paymentMilestones}
            currency={invoiceData.currency}
            grandTotal={invoiceData.grandTotal}
            onUpdate={(milestones) => updateInvoiceData("paymentMilestones", milestones)}
          />

          {/* Notes Section */}
          <Card>
            <CardHeader>
              <CardTitle>Invoice Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="notes" className="flex items-center gap-2">
                  Additional Notes
                  <div className="group relative">
                    <span className="text-gray-400 cursor-help">?</span>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      Add bank details, payment terms, or special instructions
                    </div>
                  </div>
                </Label>
                <Textarea
                  id="notes"
                  value={invoiceData.notes}
                  onChange={(e) => updateInvoiceData("notes", e.target.value)}
                  rows={4}
                  placeholder="Bank Details:&#10;Account Name: Your Company Name&#10;Account Number: 1234567890&#10;Routing Number: 123456789&#10;&#10;Payment Terms: Net 30 days"
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">{invoiceData.notes.length}/500 characters</p>
              </div>
            </CardContent>
          </Card>
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
