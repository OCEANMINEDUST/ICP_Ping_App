"use client"

import { AnalyticsDashboard } from "@/components/admin/analytics-dashboard"

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <p className="text-gray-600">Comprehensive platform insights and metrics</p>
      </div>
      <AnalyticsDashboard />
    </div>
  )
}
