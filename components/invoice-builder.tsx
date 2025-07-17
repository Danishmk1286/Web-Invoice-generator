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
import { InvoicePreview } from "@/components/invoice-preview"
import { LineItemsManager } from "@/components/line-items-manager"
import { PaymentMilestonesManager } from "@/components/payment-milestones-manager"
import { TemplateThumbnails } from "@/components/template-thumbnails"
import { ColorCustomizer } from "@/components/color-customizer"
import { Upload, Download, Mail, Save, Check, RefreshCw, Trash2, X } from "lucide-react"
import { ImageIcon } from "lucide-react"

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
  showRate: boolean
  showPayButton: boolean
  includeVat: boolean
  includeTransactionFees: boolean
  paymentLink: string

  // Customization
  templateColors: {
    [key: string]: {
      primary: string
      secondary: string
      text: string
      background: string
    }
  }

  // Field Labels
  fieldLabels: {
    description: string
    quantity: string
    rate: string
    amount: string
    subtotal: string
    total: string
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

const defaultInvoiceData: InvoiceData = {
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
  template: "minimalist",
  showQuantity: true,
  showRate: true,
  showPayButton: true,
  includeVat: false,
  includeTransactionFees: false,
  paymentLink: "",

  templateColors: {
    minimalist: { primary: "#000000", secondary: "#f5f5f5", text: "#000000", background: "#ffffff" },
    classic: { primary: "#2563eb", secondary: "#dbeafe", text: "#1e40af", background: "#ffffff" },
    green: { primary: "#10b981", secondary: "#d1fae5", text: "#065f46", background: "#ffffff" },
    modern: { primary: "#6b7280", secondary: "#f3f4f6", text: "#374151", background: "#ffffff" },
    blue: { primary: "#1e40af", secondary: "#dbeafe", text: "#1e3a8a", background: "#ffffff" },
  },

  fieldLabels: {
    description: "Description",
    quantity: "Quantity",
    rate: "Rate",
    amount: "Amount",
    subtotal: "Subtotal",
    total: "Total",
  },

  subtotal: 0,
  totalVat: 0,
  totalFees: 0,
  grandTotal: 0,
}

export function InvoiceBuilder() {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>(defaultInvoiceData)
  const [autoSaveStatus, setAutoSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  // Load saved data on component mount
  useEffect(() => {
    const savedData = localStorage.getItem("invoiceData")
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData)
        setInvoiceData({ ...defaultInvoiceData, ...parsedData })
        setLastSaved(new Date(localStorage.getItem("invoiceLastSaved") || Date.now()))
      } catch (error) {
        console.error("Failed to load saved invoice data:", error)
      }
    }
  }, [])

  // Auto-save functionality with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      try {
        setAutoSaveStatus("saving")
        localStorage.setItem("invoiceData", JSON.stringify(invoiceData))
        localStorage.setItem("invoiceLastSaved", new Date().toISOString())
        setLastSaved(new Date())
        setAutoSaveStatus("saved")
        setTimeout(() => setAutoSaveStatus("idle"), 2000)
      } catch (error) {
        console.error("Auto-save failed:", error)
        setAutoSaveStatus("error")
        setTimeout(() => setAutoSaveStatus("idle"), 3000)
      }
    }, 1000)

    return () => clearTimeout(timeoutId)
  }, [invoiceData])

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
  ])

  const updateInvoiceData = (field: string, value: any) => {
    setInvoiceData((prev) => ({ ...prev, [field]: value }))
  }

  const updateFieldLabel = (field: string, value: string) => {
    setInvoiceData((prev) => ({
      ...prev,
      fieldLabels: { ...prev.fieldLabels, [field]: value },
    }))
  }

  const updateTemplateColors = (template: string, colors: any) => {
    setInvoiceData((prev) => ({
      ...prev,
      templateColors: { ...prev.templateColors, [template]: colors },
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

  const handleLogoRemove = () => {
    updateInvoiceData("companyLogo", "")
  }

  const handlePartialReset = () => {
    if (confirm("Reset all data except company logo and bill to information?")) {
      const resetData = {
        ...defaultInvoiceData,
        companyLogo: invoiceData.companyLogo,
        clientName: invoiceData.clientName,
        clientEmail: invoiceData.clientEmail,
        clientAddress: invoiceData.clientAddress,
      }
      setInvoiceData(resetData)
    }
  }

  const handleCompleteReset = () => {
    if (confirm("Reset everything to default values? This cannot be undone.")) {
      setInvoiceData(defaultInvoiceData)
      localStorage.removeItem("invoiceData")
      localStorage.removeItem("invoiceLastSaved")
    }
  }

  const handleManualSave = () => {
    try {
      localStorage.setItem("invoiceData", JSON.stringify(invoiceData))
      localStorage.setItem("invoiceLastSaved", new Date().toISOString())
      setLastSaved(new Date())
      setAutoSaveStatus("saved")
      setTimeout(() => setAutoSaveStatus("idle"), 2000)
    } catch (error) {
      console.error("Manual save failed:", error)
      setAutoSaveStatus("error")
      setTimeout(() => setAutoSaveStatus("idle"), 3000)
    }
  }

  const handleDownloadPDF = () => {
    alert("PDF download functionality would be implemented here")
  }

  const handleEmailInvoice = () => {
    alert("Email functionality would be implemented here")
  }

  const formatLastSaved = (date: Date | null) => {
    if (!date) return "Never"
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    if (diffInSeconds < 60) return "Just now"
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
    return date.toLocaleDateString()
  }

  const getAutoSaveIndicator = () => {
    switch (autoSaveStatus) {
      case "saving":
        return (
          <div className="flex items-center gap-2 text-blue-600">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm">Saving...</span>
          </div>
        )
      case "saved":
        return (
          <div className="flex items-center gap-2 text-green-600">
            <Check className="w-4 h-4" />
            <span className="text-sm">Saved</span>
          </div>
        )
      case "error":
        return (
          <div className="flex items-center gap-2 text-red-600">
            <span className="text-sm">Save failed</span>
          </div>
        )
      default:
        return <div className="text-sm text-gray-500">Last saved: {formatLastSaved(lastSaved)}</div>
    }
  }

  return (
    <div className="space-y-6">
      {/* Auto-save Status Bar */}
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {getAutoSaveIndicator()}
              <div className="text-sm text-gray-600">Auto-save is enabled - your work is automatically saved</div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={handlePartialReset}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 bg-transparent"
              >
                <RefreshCw className="w-4 h-4" />
                Partial Reset
              </Button>
              <Button
                onClick={handleCompleteReset}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 text-red-600 hover:text-red-700 bg-transparent"
              >
                <Trash2 className="w-4 h-4" />
                Complete Reset
              </Button>
              <Button
                onClick={handleManualSave}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 bg-transparent"
              >
                <Save className="w-4 h-4" />
                Save Now
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Template Selection */}
      <TemplateThumbnails
        selectedTemplate={invoiceData.template}
        onTemplateSelect={(template) => updateInvoiceData("template", template)}
        invoiceData={invoiceData}
      />

      {/* Color Customization */}
      <ColorCustomizer
        template={invoiceData.template}
        colors={invoiceData.templateColors[invoiceData.template]}
        onColorsChange={(colors) => updateTemplateColors(invoiceData.template, colors)}
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

          {/* Business Branding & Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Business Branding & Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Logo Upload */}
              <div>
                <Label htmlFor="logo-upload">Business Logo</Label>
                <div className="mt-2">
                  {!invoiceData.companyLogo ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">Upload your business logo</p>
                        <Button
                          onClick={() => document.getElementById("logo-upload")?.click()}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          Choose File
                        </Button>
                        <Input
                          id="logo-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 border rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                          <img
                            src={invoiceData.companyLogo || "/placeholder.svg"}
                            alt="Company Logo"
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                        <div className="flex-1 space-y-2">
                          <p className="text-sm font-medium">Logo uploaded successfully</p>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => document.getElementById("logo-upload")?.click()}
                              variant="outline"
                              size="sm"
                            >
                              Replace
                            </Button>
                            <Button
                              onClick={handleLogoRemove}
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700 bg-transparent"
                            >
                              <X className="w-4 h-4 mr-1" />
                              Remove
                            </Button>
                          </div>
                          <Input
                            id="logo-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="hidden"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Business Details - Single Column */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="companyName">Business Name</Label>
                  <Input
                    id="companyName"
                    value={invoiceData.companyName}
                    onChange={(e) => updateInvoiceData("companyName", e.target.value)}
                    placeholder="Your Company Name"
                  />
                </div>
                <div>
                  <Label htmlFor="companyPhone">Phone Number</Label>
                  <Input
                    id="companyPhone"
                    value={invoiceData.companyPhone}
                    onChange={(e) => updateInvoiceData("companyPhone", e.target.value)}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
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
                  <Label htmlFor="companyWebsite">Website</Label>
                  <Input
                    id="companyWebsite"
                    value={invoiceData.companyWebsite}
                    onChange={(e) => updateInvoiceData("companyWebsite", e.target.value)}
                    placeholder="www.yourcompany.com"
                  />
                </div>
                <div>
                  <Label htmlFor="companyAddress">Business Address</Label>
                  <Textarea
                    id="companyAddress"
                    value={invoiceData.companyAddress}
                    onChange={(e) => updateInvoiceData("companyAddress", e.target.value)}
                    rows={3}
                    placeholder="123 Business Street&#10;City, State 12345"
                  />
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
                  placeholder="456 Client Avenue&#10;Client City, State 67890"
                />
              </div>
            </CardContent>
          </Card>

          {/* Invoice Customization Options */}
          <Card>
            <CardHeader>
              <CardTitle>Invoice Customization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Column Visibility */}
              <div className="space-y-4">
                <h4 className="font-medium">Column Visibility</h4>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="showQuantity"
                      checked={invoiceData.showQuantity}
                      onCheckedChange={(checked) => updateInvoiceData("showQuantity", checked)}
                    />
                    <Label htmlFor="showQuantity" className="text-sm font-medium">
                      Show Quantity Column
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="showRate"
                      checked={invoiceData.showRate}
                      onCheckedChange={(checked) => updateInvoiceData("showRate", checked)}
                    />
                    <Label htmlFor="showRate" className="text-sm font-medium">
                      Show Rate Column
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="showPayButton"
                      checked={invoiceData.showPayButton}
                      onCheckedChange={(checked) => updateInvoiceData("showPayButton", checked)}
                    />
                    <Label htmlFor="showPayButton" className="text-sm font-medium">
                      Show Pay Now Button
                    </Label>
                  </div>
                </div>
              </div>

              {/* Payment Integration */}
              {invoiceData.showPayButton && (
                <div className="space-y-4">
                  <h4 className="font-medium">Payment Integration</h4>
                  <div>
                    <Label htmlFor="paymentLink">Payment Link (PayPal, Stripe, etc.)</Label>
                    <Input
                      id="paymentLink"
                      value={invoiceData.paymentLink}
                      onChange={(e) => updateInvoiceData("paymentLink", e.target.value)}
                      placeholder="https://paypal.me/yourlink or https://buy.stripe.com/..."
                    />
                  </div>
                </div>
              )}

              {/* Field Labels Customization */}
              <div className="space-y-4">
                <h4 className="font-medium">Field Labels</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="labelDescription">Description Label</Label>
                    <Input
                      id="labelDescription"
                      value={invoiceData.fieldLabels.description}
                      onChange={(e) => updateFieldLabel("description", e.target.value)}
                      placeholder="Description"
                    />
                  </div>
                  <div>
                    <Label htmlFor="labelQuantity">Quantity Label</Label>
                    <Input
                      id="labelQuantity"
                      value={invoiceData.fieldLabels.quantity}
                      onChange={(e) => updateFieldLabel("quantity", e.target.value)}
                      placeholder="Quantity"
                    />
                  </div>
                  <div>
                    <Label htmlFor="labelRate">Rate Label</Label>
                    <Input
                      id="labelRate"
                      value={invoiceData.fieldLabels.rate}
                      onChange={(e) => updateFieldLabel("rate", e.target.value)}
                      placeholder="Rate"
                    />
                  </div>
                  <div>
                    <Label htmlFor="labelAmount">Amount Label</Label>
                    <Input
                      id="labelAmount"
                      value={invoiceData.fieldLabels.amount}
                      onChange={(e) => updateFieldLabel("amount", e.target.value)}
                      placeholder="Amount"
                    />
                  </div>
                </div>
              </div>

              {/* VAT/Tax Options */}
              <div className="space-y-4">
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
                {invoiceData.includeVat && (
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
                      placeholder="0"
                    />
                  </div>
                )}
              </div>

              {/* Transaction Fees */}
              <div className="space-y-4">
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
                {invoiceData.includeTransactionFees && (
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
                      placeholder="0"
                    />
                  </div>
                )}
              </div>
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
            fieldLabels={invoiceData.fieldLabels}
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
