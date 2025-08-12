"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Navigation, Clock, User, FileText, Filter } from "lucide-react"
import { getResponsesBySurvey, type SurveyResponse } from "@/lib/survey-responses"

interface LocationViewerProps {
  surveyId: string
  surveyTitle: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Demo location data for surveys that don't have real responses yet
const DEMO_LOCATIONS = [
  {
    id: "demo1",
    latitude: 40.7128,
    longitude: -74.006,
    address: "New York, NY",
    timestamp: "2024-03-12 09:30",
    conductor: "Survey Conductor",
    responses: 15,
  },
  {
    id: "demo2",
    latitude: 34.0522,
    longitude: -118.2437,
    address: "Los Angeles, CA",
    timestamp: "2024-03-11 14:20",
    conductor: "Field Surveyor",
    responses: 23,
  },
  {
    id: "demo3",
    latitude: 41.8781,
    longitude: -87.6298,
    address: "Chicago, IL",
    timestamp: "2024-03-10 11:45",
    conductor: "Health Surveyor",
    responses: 18,
  },
  {
    id: "demo4",
    latitude: 29.7604,
    longitude: -95.3698,
    address: "Houston, TX",
    timestamp: "2024-03-09 16:15",
    conductor: "Community Surveyor",
    responses: 12,
  },
  {
    id: "demo5",
    latitude: 33.4484,
    longitude: -112.074,
    address: "Phoenix, AZ",
    timestamp: "2024-03-08 13:30",
    conductor: "Regional Surveyor",
    responses: 8,
  },
]

export function LocationViewer({ surveyId, surveyTitle, open, onOpenChange }: LocationViewerProps) {
  const [responses, setResponses] = useState<SurveyResponse[]>([])
  const [selectedLocation, setSelectedLocation] = useState<any>(null)
  const [mapCenter, setMapCenter] = useState({ lat: 39.8283, lng: -98.5795 }) // Center of US
  const [zoom, setZoom] = useState(4)

  useEffect(() => {
    if (open) {
      const surveyResponses = getResponsesBySurvey(surveyId)
      setResponses(surveyResponses)
    }
  }, [surveyId, open])

  // Combine real responses with demo data for visualization
  const allLocations = [
    ...responses
      .filter((r) => r.location)
      .map((r) => ({
        id: r.id,
        latitude: r.location!.latitude,
        longitude: r.location!.longitude,
        address: r.location!.address || `${r.location!.latitude.toFixed(4)}, ${r.location!.longitude.toFixed(4)}`,
        timestamp: r.submittedAt,
        conductor: r.conductorId,
        responses: 1,
        type: "real" as const,
      })),
    ...DEMO_LOCATIONS.map((loc) => ({ ...loc, type: "demo" as const })),
  ]

  const handleLocationClick = (location: any) => {
    setSelectedLocation(location)
    setMapCenter({ lat: location.latitude, lng: location.longitude })
    setZoom(12)
  }

  const resetMapView = () => {
    setMapCenter({ lat: 39.8283, lng: -98.5795 })
    setZoom(4)
    setSelectedLocation(null)
  }

  const getLocationColor = (type: string) => {
    return type === "real" ? "#3b82f6" : "#10b981"
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Survey Locations: {surveyTitle}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="map" className="w-full h-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="map">Interactive Map</TabsTrigger>
            <TabsTrigger value="list">Location List ({allLocations.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="map" className="space-y-4 h-[600px]">
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  Real Responses ({responses.filter((r) => r.location).length})
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  Demo Locations ({DEMO_LOCATIONS.length})
                </Badge>
              </div>
              <Button size="sm" variant="outline" onClick={resetMapView}>
                <Navigation className="h-4 w-4 mr-1" />
                Reset View
              </Button>
            </div>

            {/* Canvas-based Map */}
            <Card className="h-full">
              <CardContent className="p-0 h-full relative">
                <canvas
                  width={800}
                  height={500}
                  className="w-full h-full border rounded-lg cursor-crosshair"
                  ref={(canvas) => {
                    if (!canvas) return

                    const ctx = canvas.getContext("2d")
                    if (!ctx) return

                    // Clear canvas
                    ctx.fillStyle = "#f8fafc"
                    ctx.fillRect(0, 0, canvas.width, canvas.height)

                    // Draw grid
                    ctx.strokeStyle = "#e2e8f0"
                    ctx.lineWidth = 1
                    for (let i = 0; i < canvas.width; i += 50) {
                      ctx.beginPath()
                      ctx.moveTo(i, 0)
                      ctx.lineTo(i, canvas.height)
                      ctx.stroke()
                    }
                    for (let i = 0; i < canvas.height; i += 50) {
                      ctx.beginPath()
                      ctx.moveTo(0, i)
                      ctx.lineTo(canvas.width, i)
                      ctx.stroke()
                    }

                    // Draw locations
                    allLocations.forEach((location, index) => {
                      // Convert lat/lng to canvas coordinates (simplified projection)
                      const x = ((location.longitude + 180) / 360) * canvas.width
                      const y = ((90 - location.latitude) / 180) * canvas.height

                      // Draw location marker
                      ctx.fillStyle = getLocationColor(location.type)
                      ctx.beginPath()
                      ctx.arc(x, y, selectedLocation?.id === location.id ? 12 : 8, 0, 2 * Math.PI)
                      ctx.fill()

                      // Draw border
                      ctx.strokeStyle = "#ffffff"
                      ctx.lineWidth = 2
                      ctx.stroke()

                      // Draw label for selected location
                      if (selectedLocation?.id === location.id) {
                        ctx.fillStyle = "#1f2937"
                        ctx.font = "12px sans-serif"
                        ctx.fillText(location.address, x + 15, y - 5)
                      }
                    })

                    // Add click handler
                    canvas.onclick = (e) => {
                      const rect = canvas.getBoundingClientRect()
                      const clickX = ((e.clientX - rect.left) / rect.width) * canvas.width
                      const clickY = ((e.clientY - rect.top) / rect.height) * canvas.height

                      // Find closest location
                      let closestLocation = null
                      let minDistance = Number.POSITIVE_INFINITY

                      allLocations.forEach((location) => {
                        const x = ((location.longitude + 180) / 360) * canvas.width
                        const y = ((90 - location.latitude) / 180) * canvas.height
                        const distance = Math.sqrt((clickX - x) ** 2 + (clickY - y) ** 2)

                        if (distance < 20 && distance < minDistance) {
                          minDistance = distance
                          closestLocation = location
                        }
                      })

                      if (closestLocation) {
                        handleLocationClick(closestLocation)
                      }
                    }
                  }}
                />

                {/* Location Details Overlay */}
                {selectedLocation && (
                  <div className="absolute top-4 right-4 w-80">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Location Details
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Address:</span>
                          <span className="font-medium">{selectedLocation.address}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Coordinates:</span>
                          <span className="font-mono text-xs">
                            {selectedLocation.latitude.toFixed(4)}, {selectedLocation.longitude.toFixed(4)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Conductor:</span>
                          <span className="font-medium">{selectedLocation.conductor}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Responses:</span>
                          <Badge variant="secondary">{selectedLocation.responses}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Timestamp:</span>
                          <span className="text-xs">{new Date(selectedLocation.timestamp).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Type:</span>
                          <Badge variant={selectedLocation.type === "real" ? "default" : "secondary"}>
                            {selectedLocation.type === "real" ? "Real Data" : "Demo Data"}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="list" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">All Survey Locations</h3>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Filter className="h-4 w-4 mr-1" />
                  Filter
                </Button>
              </div>
            </div>

            <div className="grid gap-3 max-h-[500px] overflow-y-auto">
              {allLocations.map((location) => (
                <Card key={location.id} className="cursor-pointer hover:bg-muted/50">
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{location.address}</span>
                          <Badge variant={location.type === "real" ? "default" : "secondary"} className="text-xs">
                            {location.type === "real" ? "Real" : "Demo"}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {location.conductor}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(location.timestamp).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            {location.responses} responses
                          </span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedLocation(location)
                          // Switch to map tab
                          const mapTab = document.querySelector('[value="map"]') as HTMLElement
                          mapTab?.click()
                        }}
                      >
                        View on Map
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
