"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Palette } from "lucide-react"

interface ColorCustomizerProps {
  template: string
  colors: {
    primary: string
    secondary: string
    text: string
    background: string
  }
  onColorsChange: (colors: any) => void
}

export function ColorCustomizer({ template, colors, onColorsChange }: ColorCustomizerProps) {
  const updateColor = (colorType: string, value: string) => {
    onColorsChange({ ...colors, [colorType]: value })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Template Colors - {template.charAt(0).toUpperCase() + template.slice(1)}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="primaryColor">Primary Color</Label>
            <div className="flex items-center gap-2 mt-1">
              <Input
                id="primaryColor"
                type="color"
                value={colors.primary}
                onChange={(e) => updateColor("primary", e.target.value)}
                className="w-12 h-10 p-1 border rounded"
              />
              <Input
                value={colors.primary}
                onChange={(e) => updateColor("primary", e.target.value)}
                placeholder="#000000"
                className="flex-1"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="secondaryColor">Secondary Color</Label>
            <div className="flex items-center gap-2 mt-1">
              <Input
                id="secondaryColor"
                type="color"
                value={colors.secondary}
                onChange={(e) => updateColor("secondary", e.target.value)}
                className="w-12 h-10 p-1 border rounded"
              />
              <Input
                value={colors.secondary}
                onChange={(e) => updateColor("secondary", e.target.value)}
                placeholder="#f5f5f5"
                className="flex-1"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="textColor">Text Color</Label>
            <div className="flex items-center gap-2 mt-1">
              <Input
                id="textColor"
                type="color"
                value={colors.text}
                onChange={(e) => updateColor("text", e.target.value)}
                className="w-12 h-10 p-1 border rounded"
              />
              <Input
                value={colors.text}
                onChange={(e) => updateColor("text", e.target.value)}
                placeholder="#000000"
                className="flex-1"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="backgroundColor">Background Color</Label>
            <div className="flex items-center gap-2 mt-1">
              <Input
                id="backgroundColor"
                type="color"
                value={colors.background}
                onChange={(e) => updateColor("background", e.target.value)}
                className="w-12 h-10 p-1 border rounded"
              />
              <Input
                value={colors.background}
                onChange={(e) => updateColor("background", e.target.value)}
                placeholder="#ffffff"
                className="flex-1"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
