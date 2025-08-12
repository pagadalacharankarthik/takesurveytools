"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"
import { TrendingUp, Users, FileText, AlertTriangle } from "lucide-react"

// Demo data for various charts
const surveyProgressData = [
  { month: "Jan", completed: 45, inProgress: 23, planned: 12 },
  { month: "Feb", completed: 52, inProgress: 31, planned: 18 },
  { month: "Mar", completed: 67, inProgress: 28, planned: 15 },
  { month: "Apr", completed: 73, inProgress: 35, planned: 22 },
  { month: "May", completed: 89, inProgress: 42, planned: 19 },
  { month: "Jun", completed: 95, inProgress: 38, planned: 25 },
]

const responseRateData = [
  { day: "Mon", responses: 124, target: 150 },
  { day: "Tue", responses: 142, target: 150 },
  { day: "Wed", responses: 138, target: 150 },
  { day: "Thu", responses: 156, target: 150 },
  { day: "Fri", responses: 167, target: 150 },
  { day: "Sat", responses: 89, target: 120 },
  { day: "Sun", responses: 76, target: 100 },
]

const organizationDistribution = [
  { name: "Rural Development Foundation", value: 45, color: "#3b82f6" },
  { name: "Health & Education Initiative", value: 35, color: "#10b981" },
  { name: "Community Outreach Program", value: 20, color: "#f59e0b" },
]

const riskTrendData = [
  { week: "Week 1", high: 2, medium: 5, low: 8 },
  { week: "Week 2", high: 3, medium: 7, low: 6 },
  { week: "Week 3", high: 1, medium: 4, low: 9 },
  { week: "Week 4", high: 4, medium: 6, low: 7 },
]

const conductorPerformanceData = [
  { conductor: "John Smith", surveys: 23, avgTime: 4.2, quality: 95 },
  { conductor: "Sarah Johnson", surveys: 19, avgTime: 3.8, quality: 92 },
  { conductor: "Mike Chen", surveys: 21, avgTime: 4.5, quality: 88 },
  { conductor: "Lisa Rodriguez", surveys: 17, avgTime: 3.9, quality: 94 },
]

export function SurveyProgressChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Survey Progress Trends
        </CardTitle>
        <CardDescription>Monthly survey completion and planning data</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            completed: { label: "Completed", color: "#10b981" },
            inProgress: { label: "In Progress", color: "#3b82f6" },
            planned: { label: "Planned", color: "#f59e0b" },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={surveyProgressData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="completed"
                stackId="1"
                stroke="var(--color-completed)"
                fill="var(--color-completed)"
                fillOpacity={0.8}
              />
              <Area
                type="monotone"
                dataKey="inProgress"
                stackId="1"
                stroke="var(--color-inProgress)"
                fill="var(--color-inProgress)"
                fillOpacity={0.8}
              />
              <Area
                type="monotone"
                dataKey="planned"
                stackId="1"
                stroke="var(--color-planned)"
                fill="var(--color-planned)"
                fillOpacity={0.8}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export function ResponseRateChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Daily Response Rates
        </CardTitle>
        <CardDescription>Actual vs target response collection</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            responses: { label: "Actual Responses", color: "#3b82f6" },
            target: { label: "Target", color: "#ef4444" },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={responseRateData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="responses"
                stroke="var(--color-responses)"
                strokeWidth={3}
                dot={{ fill: "var(--color-responses)", strokeWidth: 2, r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="target"
                stroke="var(--color-target)"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: "var(--color-target)", strokeWidth: 2, r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export function OrganizationDistributionChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Survey Distribution by Organization
        </CardTitle>
        <CardDescription>Percentage of surveys by organization</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            rural: { label: "Rural Development Foundation", color: "#3b82f6" },
            health: { label: "Health & Education Initiative", color: "#10b981" },
            community: { label: "Community Outreach Program", color: "#f59e0b" },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={organizationDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {organizationDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export function RiskTrendChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Risk Alert Trends
        </CardTitle>
        <CardDescription>Weekly risk detection by severity level</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            high: { label: "High Priority", color: "#ef4444" },
            medium: { label: "Medium Priority", color: "#f59e0b" },
            low: { label: "Low Priority", color: "#10b981" },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={riskTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="high" stackId="a" fill="var(--color-high)" />
              <Bar dataKey="medium" stackId="a" fill="var(--color-medium)" />
              <Bar dataKey="low" stackId="a" fill="var(--color-low)" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export function ConductorPerformanceChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Conductor Performance
        </CardTitle>
        <CardDescription>Survey completion and quality metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            surveys: { label: "Surveys Completed", color: "#3b82f6" },
            quality: { label: "Quality Score", color: "#10b981" },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={conductorPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="conductor" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar yAxisId="left" dataKey="surveys" fill="var(--color-surveys)" />
              <Bar yAxisId="right" dataKey="quality" fill="var(--color-quality)" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
