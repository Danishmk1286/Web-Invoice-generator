"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Check } from "lucide-react"

interface InvoiceData {
  template: string
}

interface TemplateThumbnailsProps {
  selectedTemplate: string
  onTemplateSelect: (template: string) => void
  invoiceData: InvoiceData
}

const templates = [
  {
    id: "classic",
    name: "Classic Corporate",
    description: "Professional and clean - perfect for established businesses",
  },
  { id: "minimalist", name: "Minimalist", description: "Simple and elegant - focuses on content over decoration" },
  { id: "sidebar", name: "Modern Sidebar", description: "Contemporary layout with blue accent sidebar" },
  { id: "creative", name: "Creative Freelancer", description: "Bold and artistic with purple gradient header" },
  { id: "dark", name: "Dark Mode", description: "Modern dark theme with cyan accents" },
]

export function TemplateThumbnails({ selectedTemplate, onTemplateSelect }: TemplateThumbnailsProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Choose Your Template</h2>
          <p className="text-gray-600">Select a professional invoice template that matches your brand</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {templates.map((template) => (
            <div
              key={template.id}
              onClick={() => onTemplateSelect(template.id)}
              className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all hover:shadow-lg hover:scale-105 ${
                selectedTemplate === template.id
                  ? "border-blue-500 bg-blue-50 shadow-md"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              {selectedTemplate === template.id && (
                <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full p-1">
                  <Check className="h-3 w-3" />
                </div>
              )}

              <div className="text-center">
                <div className="font-medium text-sm mb-2">{template.name}</div>
                <div className="text-xs text-gray-500 leading-relaxed">{template.description}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
