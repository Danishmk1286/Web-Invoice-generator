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
  { id: "minimalist", name: "Minimalist" },
  { id: "classic", name: "Classic" },
  { id: "green", name: "Green Business" },
  { id: "modern", name: "Modern Wave" },
  { id: "blue", name: "Blue Professional" },
]

export function TemplateThumbnails({ selectedTemplate, onTemplateSelect }: TemplateThumbnailsProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Choose Your Template</h2>
          <p className="text-gray-600">Select a professional invoice design</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {templates.map((template) => (
            <div
              key={template.id}
              className={`relative cursor-pointer transition-all duration-200 ${
                selectedTemplate === template.id
                  ? "ring-2 ring-blue-500 ring-offset-2"
                  : "hover:ring-2 hover:ring-gray-300 hover:ring-offset-2"
              }`}
              onClick={() => onTemplateSelect(template.id)}
            >
              <Card className="h-24 relative overflow-hidden">
                <CardContent className="p-4 h-full flex items-center justify-center">
                  <div className="text-center">
                    <h3 className="font-medium text-sm">{template.name}</h3>
                  </div>
                </CardContent>

                {selectedTemplate === template.id && (
                  <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                    <Check className="h-3 w-3" />
                  </div>
                )}
              </Card>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
