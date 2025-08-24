import React, { useState } from 'react';
import { MapPin, AlertTriangle, Users, Leaf, DollarSign, TrendingUp, Calendar, Camera, Send, Target, BarChart3, PieChart, Activity, Globe, MessageCircle, Gift, Zap, Shield, Recycle, Award, Settings, Filter, Download, Eye, CheckCircle, XCircle, Clock, Map, Trophy } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from './ui/chart';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, PieChart as RechartsPieChart, Pie, Cell, AreaChart, Area } from 'recharts';

interface ScanLocation {
  id: string;
  lat: number;
  lng: number;
  city: string;
  country: string;
  scans: number;
  counterfeits: number;
  genuineRate: number;
  timestamp: string;
}

interface CounterfeitAlert {
  id: string;
  productName: string;
  sku: string;
  location: string;
  coordinates: { lat: number; lng: number };
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'new' | 'investigating' | 'resolved' | 'false-positive';
  reportedBy: string;
  photoRequested: boolean;
  photoProvided: boolean;
  forensicNotes?: string;
}

interface Campaign {
  id: string;
  name: string;
  description: string;
  type: 'product-verification' | 'recycling' | 'awareness' | 'loyalty';
  status: 'draft' | 'active' | 'paused' | 'completed';
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  tokensAllocated: number;
  tokensUsed: number;
  participants: number;
  scansGenerated: number;
  roi: number;
  targetRegions: string[];
  targetProducts: string[];
}

interface EnvironmentalData {
  period: string;
  bottlesRecycled: number;
  carbonOffset: number;
  energySaved: number;
  waterSaved: number;
}

interface ProductLineData {
  name: string;
  sku: string;
  totalScans: number;
  genuineScans: number;
  counterfeitScans: number;
  verificationRate: number;
  bottlesRecycled: number;
  carbonOffset: number;
  topRegions: string[];
}

export function CompanyDashboard() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');
  const [selectedRegion, setSelectedRegion] = useState('global');
  const [mapView, setMapView] = useState<'scans' | 'counterfeits'>('scans');
  const [selectedAlert, setSelectedAlert] = useState<CounterfeitAlert | null>(null);
  const [newCampaignDialogOpen, setNewCampaignDialogOpen] = useState(false);

  // Mock company data
  const companyInfo = {
    name: 'Global Beverages Inc.',
    industry: 'Food & Beverage',
    productsRegistered: 1250000,
    totalScans: 2856742,
    verificationRate: 94.8,
    counterfeitDetections: 148756,
    activeProducts: 245,
    marketRegions: 28,
    carbonOffset: 1245.8,
    bottlesRecycled: 589432
  };

  // Mock scan locations for heatmap
  const scanLocations: ScanLocation[] = [
    { id: '1', lat: 40.7128, lng: -74.0060, city: 'New York', country: 'USA', scans: 15420, counterfeits: 892, genuineRate: 94.2, timestamp: '2024-01-15' },
    { id: '2', lat: 34.0522, lng: -118.2437, city: 'Los Angeles', country: 'USA', scans: 12890, counterfeits: 1245, genuineRate: 90.3, timestamp: '2024-01-15' },
    { id: '3', lat: 51.5074, lng: -0.1278, city: 'London', country: 'UK', scans: 18650, counterfeits: 456, genuineRate: 97.6, timestamp: '2024-01-15' },
    { id: '4', lat: 35.6762, lng: 139.6503, city: 'Tokyo', country: 'Japan', scans: 24580, counterfeits: 234, genuineRate: 99.1, timestamp: '2024-01-15' },
    { id: '5', lat: 19.4326, lng: -99.1332, city: 'Mexico City', country: 'Mexico', scans: 8945, counterfeits: 1789, genuineRate: 80.0, timestamp: '2024-01-15' }
  ];

  // Mock counterfeit alerts
  const counterfeitAlerts: CounterfeitAlert[] = [
    {
      id: 'CF-001',
      productName: 'Premium Energy Drink 500ml',
      sku: 'PED-500-001',
      location: 'Downtown Market, Mexico City',
      coordinates: { lat: 19.4326, lng: -99.1332 },
      timestamp: '2024-01-15 14:30:22',
      severity: 'critical',
      status: 'new',
      reportedBy: 'user_mx_12456',
      photoRequested: false,
      photoProvided: false
    },
    {
      id: 'CF-002',
      productName: 'Classic Cola 355ml',
      sku: 'CC-355-002',
      location: 'Street Vendor, Bangkok',
      coordinates: { lat: 13.7563, lng: 100.5018 },
      timestamp: '2024-01-15 12:15:45',
      severity: 'high',
      status: 'investigating',
      reportedBy: 'user_th_89234',
      photoRequested: true,
      photoProvided: true,
      forensicNotes: 'Packaging inconsistencies detected in barcode area'
    },
    {
      id: 'CF-003',
      productName: 'Sport Hydration 1L',
      sku: 'SH-1000-003',
      location: 'Supermarket Chain, São Paulo',
      coordinates: { lat: -23.5505, lng: -46.6333 },
      timestamp: '2024-01-14 16:45:18',
      severity: 'medium',
      status: 'resolved',
      reportedBy: 'user_br_67890',
      photoRequested: true,
      photoProvided: true,
      forensicNotes: 'False positive - legitimate product with damaged label'
    }
  ];

  // Mock campaigns
  const campaigns: Campaign[] = [
    {
      id: 'CAMP-001',
      name: 'Summer Authenticity Drive',
      description: 'Boost verification rates during peak summer sales period',
      type: 'product-verification',
      status: 'active',
      startDate: '2024-06-01',
      endDate: '2024-08-31',
      budget: 50000,
      spent: 23450,
      tokensAllocated: 500000,
      tokensUsed: 234500,
      participants: 15420,
      scansGenerated: 89756,
      roi: 3.45,
      targetRegions: ['North America', 'Europe'],
      targetProducts: ['Energy Drinks', 'Soft Drinks']
    },
    {
      id: 'CAMP-002',
      name: 'Green Recycling Challenge',
      description: 'Incentivize PET bottle recycling with bonus rewards',
      type: 'recycling',
      status: 'active',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      budget: 75000,
      spent: 8935,
      tokensAllocated: 750000,
      tokensUsed: 89350,
      participants: 8945,
      scansGenerated: 45678,
      roi: 2.89,
      targetRegions: ['Global'],
      targetProducts: ['All Bottled Products']
    },
    {
      id: 'CAMP-003',
      name: 'Anti-Counterfeit Awareness',
      description: 'Educational campaign about spotting fake products',
      type: 'awareness',
      status: 'completed',
      startDate: '2023-11-01',
      endDate: '2023-12-31',
      budget: 25000,
      spent: 24890,
      tokensAllocated: 250000,
      tokensUsed: 248900,
      participants: 34567,
      scansGenerated: 156789,
      roi: 4.12,
      targetRegions: ['Asia Pacific'],
      targetProducts: ['Premium Products']
    }
  ];

  // Mock environmental data
  const environmentalData: EnvironmentalData[] = [
    { period: 'Jan', bottlesRecycled: 45890, carbonOffset: 89.2, energySaved: 234.5, waterSaved: 1235 },
    { period: 'Feb', bottlesRecycled: 52340, carbonOffset: 102.4, energySaved: 267.8, waterSaved: 1423 },
    { period: 'Mar', bottlesRecycled: 48760, carbonOffset: 95.6, energySaved: 249.2, waterSaved: 1324 },
    { period: 'Apr', bottlesRecycled: 56780, carbonOffset: 111.3, energySaved: 290.1, waterSaved: 1567 },
    { period: 'May', bottlesRecycled: 61250, carbonOffset: 120.0, energySaved: 313.2, waterSaved: 1678 },
    { period: 'Jun', bottlesRecycled: 58940, carbonOffset: 115.4, energySaved: 301.5, waterSaved: 1589 }
  ];

  // Mock product line data
  const productLines: ProductLineData[] = [
    {
      name: 'Classic Cola',
      sku: 'CC-*',
      totalScans: 456780,
      genuineScans: 432890,
      counterfeitScans: 23890,
      verificationRate: 94.8,
      bottlesRecycled: 123456,
      carbonOffset: 245.6,
      topRegions: ['North America', 'Europe', 'Asia Pacific']
    },
    {
      name: 'Premium Energy Drinks',
      sku: 'PED-*',
      totalScans: 234560,
      genuineScans: 198745,
      counterfeitScans: 35815,
      verificationRate: 84.7,
      bottlesRecycled: 87654,
      carbonOffset: 178.9,
      topRegions: ['North America', 'Europe']
    },
    {
      name: 'Natural Water',
      sku: 'NW-*',
      totalScans: 567890,
      genuineScans: 556234,
      counterfeitScans: 11656,
      verificationRate: 97.9,
      bottlesRecycled: 234567,
      carbonOffset: 467.8,
      topRegions: ['Global']
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'new': return 'text-blue-600 bg-blue-100';
      case 'investigating': return 'text-yellow-600 bg-yellow-100';
      case 'resolved': return 'text-gray-600 bg-gray-100';
      case 'completed': return 'text-purple-600 bg-purple-100';
      case 'paused': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{companyInfo.name}</h1>
          <p className="text-muted-foreground">
            Brand Dashboard • {companyInfo.industry} • {companyInfo.marketRegions} Markets
          </p>
        </div>
        <div className="flex space-x-3">
          <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <Settings className="w-4 h-4 mr-2" />
            Brand Settings
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-8 h-8 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">{companyInfo.totalScans.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Scans</div>
                <div className="text-xs text-green-600">+12.5% this month</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Shield className="w-8 h-8 text-green-500" />
              <div>
                <div className="text-2xl font-bold">{companyInfo.verificationRate}%</div>
                <div className="text-sm text-muted-foreground">Verification Rate</div>
                <div className="text-xs text-green-600">Target: 95%</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-8 h-8 text-red-500" />
              <div>
                <div className="text-2xl font-bold">{companyInfo.counterfeitDetections.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Counterfeits Detected</div>
                <div className="text-xs text-red-600">5.2% of total scans</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Leaf className="w-8 h-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold">{companyInfo.carbonOffset}t</div>
                <div className="text-sm text-muted-foreground">CO₂ Offset</div>
                <div className="text-xs text-green-600">{companyInfo.bottlesRecycled.toLocaleString()} bottles recycled</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="analytics" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="analytics">Verification Analytics</TabsTrigger>
          <TabsTrigger value="alerts">Counterfeit Alerts</TabsTrigger>
          <TabsTrigger value="campaigns">Consumer Engagement</TabsTrigger>
          <TabsTrigger value="environmental">Environmental Impact</TabsTrigger>
          <TabsTrigger value="sponsorship">Reward Sponsorship</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-6">
          {/* Map Controls */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Map className="w-5 h-5" />
                    <span>Global Scan Heatmap</span>
                  </CardTitle>
                  <CardDescription>Interactive map showing scan locations and counterfeit detection rates</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant={mapView === 'scans' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setMapView('scans')}
                  >
                    Scan Density
                  </Button>
                  <Button 
                    variant={mapView === 'counterfeits' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setMapView('counterfeits')}
                  >
                    Counterfeit Hotspots
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Mock Map Visualization */}
              <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center relative">
                <div className="text-center space-y-2">
                  <Globe className="w-16 h-16 text-gray-400 mx-auto" />
                  <p className="text-gray-500 font-medium">Interactive Map View</p>
                  <p className="text-sm text-gray-400">
                    {mapView === 'scans' ? 'Showing scan density heatmap' : 'Showing counterfeit detection hotspots'}
                  </p>
                </div>
                
                {/* Mock location markers */}
                {scanLocations.map((location) => (
                  <div 
                    key={location.id}
                    className="absolute w-4 h-4 rounded-full cursor-pointer"
                    style={{
                      left: `${20 + Math.random() * 60}%`,
                      top: `${20 + Math.random() * 60}%`,
                      backgroundColor: mapView === 'scans' 
                        ? `rgba(59, 130, 246, ${Math.min(location.scans / 25000, 1)})` 
                        : `rgba(239, 68, 68, ${location.counterfeits / location.scans})`
                    }}
                    title={`${location.city}: ${location.scans} scans, ${location.counterfeits} counterfeits`}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Regional Analytics */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Scan Frequency by Region</CardTitle>
                <CardDescription>Product verification trends across markets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {scanLocations.map((location) => (
                    <div key={location.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <div>
                          <div className="font-medium">{location.city}, {location.country}</div>
                          <div className="text-sm text-muted-foreground">
                            {location.counterfeits} counterfeits detected
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{location.scans.toLocaleString()}</div>
                        <div className={`text-sm ${
                          location.genuineRate >= 95 ? 'text-green-600' :
                          location.genuineRate >= 90 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {location.genuineRate}% genuine
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Product Line Performance</CardTitle>
                <CardDescription>Verification rates by product category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {productLines.map((product) => (
                    <div key={product.sku} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">{product.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {product.verificationRate}%
                        </span>
                      </div>
                      <Progress 
                        value={product.verificationRate} 
                        className="h-2"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{product.totalScans.toLocaleString()} total scans</span>
                        <span>{product.counterfeitScans.toLocaleString()} counterfeits</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Trending Charts */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Daily Verification Trends</CardTitle>
                <CardDescription>Product scans and authenticity rates over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    scans: { label: 'Scans', color: '#3B82F6' },
                    genuine: { label: 'Genuine Rate', color: '#10B981' }
                  }}
                  className="h-64"
                >
                  <AreaChart data={environmentalData}>
                    <XAxis dataKey="period" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area type="monotone" dataKey="bottlesRecycled" stroke="var(--color-scans)" fill="var(--color-scans)" fillOpacity={0.3} />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Counterfeit Detection by Severity</CardTitle>
                <CardDescription>Distribution of threat levels in detected counterfeits</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    value: { label: 'Count' }
                  }}
                  className="h-64"
                >
                  <RechartsPieChart>
                    <Pie
                      data={[
                        { name: 'Critical', value: 15, color: '#EF4444' },
                        { name: 'High', value: 35, color: '#F97316' },
                        { name: 'Medium', value: 30, color: '#EAB308' },
                        { name: 'Low', value: 20, color: '#22C55E' }
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {[
                        { name: 'Critical', value: 15, color: '#EF4444' },
                        { name: 'High', value: 35, color: '#F97316' },
                        { name: 'Medium', value: 30, color: '#EAB308' },
                        { name: 'Low', value: 20, color: '#22C55E' }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </RechartsPieChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          {/* Alert Summary */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                  <div>
                    <div className="text-xl font-bold">{counterfeitAlerts.filter(a => a.status === 'new').length}</div>
                    <div className="text-sm text-muted-foreground">New Alerts</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Clock className="w-6 h-6 text-yellow-500" />
                  <div>
                    <div className="text-xl font-bold">{counterfeitAlerts.filter(a => a.status === 'investigating').length}</div>
                    <div className="text-sm text-muted-foreground">Under Investigation</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Camera className="w-6 h-6 text-blue-500" />
                  <div>
                    <div className="text-xl font-bold">{counterfeitAlerts.filter(a => a.photoRequested).length}</div>
                    <div className="text-sm text-muted-foreground">Photos Requested</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <div>
                    <div className="text-xl font-bold">{counterfeitAlerts.filter(a => a.status === 'resolved').length}</div>
                    <div className="text-sm text-muted-foreground">Resolved</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Counterfeit Alerts Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Suspected Fake Product Logs</span>
              </CardTitle>
              <CardDescription>
                Real-time counterfeit detection alerts with location and forensic capabilities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Photo</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {counterfeitAlerts.map((alert) => (
                    <TableRow key={alert.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{alert.productName}</div>
                          <div className="text-sm text-muted-foreground">SKU: {alert.sku}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{alert.location}</div>
                          <div className="text-xs text-muted-foreground">
                            {alert.coordinates.lat}, {alert.coordinates.lng}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{alert.timestamp}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                          {alert.severity.toUpperCase()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(alert.status)}`}>
                          {alert.status.replace('-', ' ').toUpperCase()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          {alert.photoRequested && (
                            <Badge variant={alert.photoProvided ? 'default' : 'secondary'} className="text-xs">
                              {alert.photoProvided ? '✓ Received' : 'Requested'}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                              <DialogHeader>
                                <DialogTitle>Counterfeit Alert Details</DialogTitle>
                                <DialogDescription>
                                  Investigation details for {alert.productName}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label>Reported by</Label>
                                  <p className="text-sm">{alert.reportedBy}</p>
                                </div>
                                <div>
                                  <Label>Location</Label>
                                  <p className="text-sm">{alert.location}</p>
                                </div>
                                {alert.forensicNotes && (
                                  <div>
                                    <Label>Forensic Notes</Label>
                                    <p className="text-sm">{alert.forensicNotes}</p>
                                  </div>
                                )}
                                <div className="flex space-x-2">
                                  {!alert.photoRequested && (
                                    <Button size="sm">
                                      <Camera className="w-4 h-4 mr-2" />
                                      Request Photo
                                    </Button>
                                  )}
                                  <Button variant="outline" size="sm">
                                    Update Status
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          {!alert.photoRequested && (
                            <Button variant="outline" size="sm">
                              <Camera className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          {/* Campaign Overview */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Consumer Engagement Campaigns</h2>
              <p className="text-muted-foreground">Manage token reward campaigns and consumer messaging</p>
            </div>
            <Dialog open={newCampaignDialogOpen} onOpenChange={setNewCampaignDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Target className="w-4 h-4 mr-2" />
                  Create Campaign
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Campaign</DialogTitle>
                  <DialogDescription>Set up a new consumer engagement campaign</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="campaign-name">Campaign Name</Label>
                    <Input id="campaign-name" placeholder="Enter campaign name" />
                  </div>
                  <div>
                    <Label htmlFor="campaign-type">Campaign Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="product-verification">Product Verification</SelectItem>
                        <SelectItem value="recycling">Recycling Initiative</SelectItem>
                        <SelectItem value="awareness">Brand Awareness</SelectItem>
                        <SelectItem value="loyalty">Customer Loyalty</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="campaign-budget">Budget (USD)</Label>
                    <Input id="campaign-budget" type="number" placeholder="10000" />
                  </div>
                  <div>
                    <Label htmlFor="campaign-tokens">Token Allocation</Label>
                    <Input id="campaign-tokens" type="number" placeholder="100000" />
                  </div>
                  <div>
                    <Label htmlFor="campaign-description">Description</Label>
                    <Textarea id="campaign-description" placeholder="Describe your campaign objectives..." />
                  </div>
                  <div className="flex space-x-2">
                    <Button className="flex-1">Create Campaign</Button>
                    <Button variant="outline" onClick={() => setNewCampaignDialogOpen(false)}>Cancel</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Active Campaigns */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign) => (
              <Card key={campaign.id} className={`${
                campaign.status === 'active' ? 'border-green-200 bg-green-50' : ''
              }`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{campaign.name}</CardTitle>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                      {campaign.status.toUpperCase()}
                    </span>
                  </div>
                  <CardDescription>{campaign.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Budget Spent</div>
                      <div className="font-semibold">${campaign.spent.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">
                        of ${campaign.budget.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">ROI</div>
                      <div className="font-semibold text-green-600">{campaign.roi}x</div>
                      <div className="text-xs text-muted-foreground">
                        {campaign.participants.toLocaleString()} participants
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Token Usage</span>
                      <span>{Math.round((campaign.tokensUsed / campaign.tokensAllocated) * 100)}%</span>
                    </div>
                    <Progress value={(campaign.tokensUsed / campaign.tokensAllocated) * 100} />
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Activity className="w-4 h-4 mr-2" />
                      Analytics
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Message
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Telegram Bot Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Send className="w-5 h-5" />
                <span>Telegram Bot Messaging</span>
              </CardTitle>
              <CardDescription>Push notifications to consumers via Ping Telegram bot</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="message-type">Message Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select message type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="campaign-launch">Campaign Launch</SelectItem>
                      <SelectItem value="reward-bonus">Bonus Rewards</SelectItem>
                      <SelectItem value="product-alert">Product Alert</SelectItem>
                      <SelectItem value="recycling-challenge">Recycling Challenge</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="target-region">Target Region</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="global">Global</SelectItem>
                      <SelectItem value="north-america">North America</SelectItem>
                      <SelectItem value="europe">Europe</SelectItem>
                      <SelectItem value="asia-pacific">Asia Pacific</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="message-content">Message Content</Label>
                <Textarea 
                  id="message-content" 
                  placeholder="Compose your message to consumers..."
                  className="min-h-24"
                />
              </div>
              <div className="flex items-center space-x-4">
                <Button>
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
                <div className="text-sm text-muted-foreground">
                  Estimated reach: 15,420 active users
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="environmental" className="space-y-6">
          {/* Environmental Impact Overview */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Recycle className="w-8 h-8 text-green-500" />
                  <div>
                    <div className="text-2xl font-bold">{companyInfo.bottlesRecycled.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Bottles Recycled</div>
                    <div className="text-xs text-green-600">This year</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Leaf className="w-8 h-8 text-green-600" />
                  <div>
                    <div className="text-2xl font-bold">{companyInfo.carbonOffset}t</div>
                    <div className="text-sm text-muted-foreground">CO₂ Offset</div>
                    <div className="text-xs text-green-600">Carbon saved</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Zap className="w-8 h-8 text-yellow-500" />
                  <div>
                    <div className="text-2xl font-bold">1,854</div>
                    <div className="text-sm text-muted-foreground">kWh Saved</div>
                    <div className="text-xs text-yellow-600">Energy equivalent</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Award className="w-8 h-8 text-purple-500" />
                  <div>
                    <div className="text-2xl font-bold">#3</div>
                    <div className="text-sm text-muted-foreground">Global Ranking</div>
                    <div className="text-xs text-purple-600">Among F&B brands</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Environmental Charts */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Recycling Impact</CardTitle>
                <CardDescription>PET bottle recycling data tied to brand products</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    bottles: { label: 'Bottles Recycled', color: '#10B981' },
                    carbon: { label: 'CO₂ Offset (kg)', color: '#3B82F6' }
                  }}
                  className="h-64"
                >
                  <BarChart data={environmentalData}>
                    <XAxis dataKey="period" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="bottlesRecycled" fill="var(--color-bottles)" />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Carbon Offset by Product Line</CardTitle>
                <CardDescription>Environmental impact breakdown by product category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {productLines.map((product) => (
                    <div key={product.sku} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">{product.name}</span>
                        <span className="text-sm text-green-600 font-semibold">
                          {product.carbonOffset}t CO₂
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{product.bottlesRecycled.toLocaleString()} bottles</span>
                        <span>{product.topRegions.slice(0, 2).join(', ')}</span>
                      </div>
                      <Progress 
                        value={product.carbonOffset / 10} 
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Carbon Offset Leaderboard */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="w-5 h-5" />
                <span>Brand Carbon Offset Leaderboard</span>
              </CardTitle>
              <CardDescription>Global ranking among F&B brands for environmental impact</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { rank: 1, name: 'EcoWater Global', carbonOffset: 2456.8, badge: '🏆' },
                  { rank: 2, name: 'Green Beverages Ltd.', carbonOffset: 1987.3, badge: '🥈' },
                  { rank: 3, name: 'Global Beverages Inc.', carbonOffset: 1245.8, badge: '🥉', isCurrentBrand: true },
                  { rank: 4, name: 'Pure Drinks Co.', carbonOffset: 1156.4, badge: '' },
                  { rank: 5, name: 'Natural Choice', carbonOffset: 998.7, badge: '' }
                ].map((entry) => (
                  <div key={entry.rank} className={`flex items-center justify-between p-4 border rounded-lg ${
                    entry.isCurrentBrand ? 'bg-green-50 border-green-200' : ''
                  }`}>
                    <div className="flex items-center space-x-4">
                      <div className="text-center min-w-[2rem]">
                        <div className="font-bold text-lg">{entry.badge || `#${entry.rank}`}</div>
                      </div>
                      <div>
                        <div className="font-medium">{entry.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {entry.isCurrentBrand ? 'Your brand' : 'Competitor'}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-green-600">{entry.carbonOffset}t</div>
                      <div className="text-xs text-muted-foreground">CO₂ offset</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sponsorship" className="space-y-6">
          {/* Sponsorship Overview */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-8 h-8 text-green-500" />
                  <div>
                    <div className="text-2xl font-bold">$127,450</div>
                    <div className="text-sm text-muted-foreground">Total Budget</div>
                    <div className="text-xs text-green-600">This year</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Target className="w-8 h-8 text-blue-500" />
                  <div>
                    <div className="text-2xl font-bold">$57,285</div>
                    <div className="text-sm text-muted-foreground">Spent</div>
                    <div className="text-xs text-blue-600">45% of budget</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-8 h-8 text-purple-500" />
                  <div>
                    <div className="text-2xl font-bold">3.2x</div>
                    <div className="text-sm text-muted-foreground">Average ROI</div>
                    <div className="text-xs text-purple-600">All campaigns</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Users className="w-8 h-8 text-orange-500" />
                  <div>
                    <div className="text-2xl font-bold">58,932</div>
                    <div className="text-sm text-muted-foreground">Users Engaged</div>
                    <div className="text-xs text-orange-600">Across all campaigns</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Budget Allocation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5" />
                <span>Token Sponsorship Budget Allocation</span>
              </CardTitle>
              <CardDescription>Manage your token reward budgets across different campaign types</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { type: 'Product Verification', allocated: 50000, used: 23450, percentage: 46.9, color: 'blue' },
                { type: 'Recycling Incentives', allocated: 40000, used: 8935, percentage: 22.3, color: 'green' },
                { type: 'Brand Awareness', allocated: 25000, used: 19800, percentage: 79.2, color: 'purple' },
                { type: 'Anti-Counterfeit', allocated: 12450, used: 4250, percentage: 34.1, color: 'red' }
              ].map((budget) => (
                <div key={budget.type} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">{budget.type}</h3>
                    <div className="text-sm text-muted-foreground">
                      ${budget.used.toLocaleString()} / ${budget.allocated.toLocaleString()}
                    </div>
                  </div>
                  <Progress value={budget.percentage} />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{budget.percentage}% utilized</span>
                    <Button variant="outline" size="sm">
                      Adjust Budget
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* ROI Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Campaign ROI Metrics</CardTitle>
              <CardDescription>Return on investment analysis for token sponsorship campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-4">ROI by Campaign Type</h3>
                  <div className="space-y-3">
                    {[
                      { type: 'Product Verification', roi: 4.12, engagement: 15420 },
                      { type: 'Anti-Counterfeit', roi: 3.89, engagement: 8934 },
                      { type: 'Recycling', roi: 2.89, engagement: 12567 },
                      { type: 'Brand Awareness', roi: 2.45, engagement: 22089 }
                    ].map((metric) => (
                      <div key={metric.type} className="flex justify-between items-center p-3 border rounded-lg">
                        <div>
                          <div className="font-medium text-sm">{metric.type}</div>
                          <div className="text-xs text-muted-foreground">
                            {metric.engagement.toLocaleString()} users engaged
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-green-600">{metric.roi}x</div>
                          <div className="text-xs text-muted-foreground">ROI</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-4">Monthly Spending Trends</h3>
                  <ChartContainer
                    config={{
                      spending: { label: 'Spending ($)', color: '#3B82F6' },
                      roi: { label: 'ROI', color: '#10B981' }
                    }}
                    className="h-48"
                  >
                    <LineChart data={environmentalData.map((d, i) => ({ 
                      month: d.period, 
                      spending: 8000 + Math.random() * 4000,
                      roi: 2.1 + Math.random() * 2 
                    }))}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line type="monotone" dataKey="spending" stroke="var(--color-spending)" strokeWidth={2} />
                    </LineChart>
                  </ChartContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}