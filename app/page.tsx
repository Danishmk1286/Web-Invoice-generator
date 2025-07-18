"use client"

import { InvoiceBuilder } from "@/components/invoice-builder"

export default function InvoiceGenerator() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 opacity-100">
      <div className="container mx-auto p-4">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Professional Invoice Generator</h1>
          <p className="text-lg text-gray-600">
            Create branded invoices with live preview, partial payments, and multi-currency support
          </p>
        </header>

        <InvoiceBuilder />
      </div>
    </div>
  )
}
