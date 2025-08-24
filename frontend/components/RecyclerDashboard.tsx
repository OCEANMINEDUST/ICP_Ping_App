import React, { useState, useRef } from 'react';
import { Upload, Download, FileText, Database, Settings, Camera, MapPin, Calendar, QrCode, Smartphone, Wifi, Users, DollarSign, TrendingUp, Truck, Leaf, BarChart3, Clock, Filter, Search, RefreshCw, ExternalLink, Copy, Eye, Trash2, Edit, Plus, CheckCircle, AlertTriangle, Package } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Progress } from './ui/progress';
import { Switch } from './ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Separator } from './ui/separator';

interface CollectionLog {
  id: string;
  date: string;
  volume: number;
  unit: 'kg' | 'liters';
  location: string;
  collectorId: string;
  collectorName: string;
  contaminationRate: number;
  bottleTypes: {
    clearPET: number;
    coloredPET: number;
    other: number;
  };
  sortingCategories: string[];
  hasProofPhotos: boolean;
  hasSignature: boolean;
  qrVerified: boolean;
  co2Saved: number;
  uploadMethod: 'csv' | 'mobile' | 'iot';
  status: 'verified' | 'pending' | 'flagged';
}

interface CollectorPayout {
  id: string;
  collectorId: string;
  collectorName: string;
  location: string;
  tokensEarned: number;
  volumeCollected: number;
  payoutDate: string;
  payoutStatus: 'pending' | 'processed' | 'failed';
  transactionHash?: string;
  walletAddress: string;
  performanceRating: number;
}

interface PickupRequest {
  id: string;
  requestDate: string;
  scheduledDate: string;
  location: string;
  estimatedVolume: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  driverAssigned?: string;
  coordinates: { lat: number; lng: number };
  contactPerson: string;
  contactPhone: string;
  notes: string;
}

interface AggregatorReport {
  id: string;
  centerName: string;
  location: string;
  reportPeriod: string;
  volumeProcessed: number;
  co2SavedEstimate: number;
  contaminationRate: number;
  throughputEfficiency: number;
  operationalCosts: number;
  qualityScore: number;
  certifications: string[];
}

export function RecyclerDashboard() {
  const [activeTab, setActiveTab] = useState('collection-upload');
  const [uploadType, setUploadType] = useState<'csv' | 'mobile' | 'iot'>('csv');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock data
  const collectionLogs: CollectionLog[] = [
    {
      id: 'CL001',
      date: '2024-08-16T14:30:00Z',
      volume: 45.6,
      unit: 'kg',
      location: 'Downtown Collection Point A',
      collectorId: 'COL001',
      collectorName: 'Maria Santos',
      contaminationRate: 8.5,
      bottleTypes: { clearPET: 32.1, coloredPET: 11.2, other: 2.3 },
      sortingCategories: ['Clear PET', 'Colored PET', 'Labels Removed'],
      hasProofPhotos: true,
      hasSignature: true,
      qrVerified: true,
      co2Saved: 12.4,
      uploadMethod: 'mobile',
      status: 'verified'
    },
    {
      id: 'CL002',
      date: '2024-08-16T09:15:00Z',
      volume: 78.2,
      unit: 'kg',
      location: 'Smart Bin - Mall Entrance',
      collectorId: 'IOT003',
      collectorName: 'Smart Bin #003',
      contaminationRate: 3.2,
      bottleTypes: { clearPET: 65.4, coloredPET: 12.8, other: 0.0 },
      sortingCategories: ['Clear PET', 'Colored PET'],
      hasProofPhotos: false,
      hasSignature: false,
      qrVerified: false,
      co2Saved: 21.2,
      uploadMethod: 'iot',
      status: 'verified'
    },
    {
      id: 'CL003',
      date: '2024-08-15T16:45:00Z',
      volume: 23.8,
      unit: 'kg',
      location: 'Residential Area - Block C',
      collectorId: 'COL005',
      collectorName: 'John Chen',
      contaminationRate: 15.3,
      bottleTypes: { clearPET: 18.2, coloredPET: 4.1, other: 1.5 },
      sortingCategories: ['Clear PET', 'Mixed Colored', 'Contaminated'],
      hasProofPhotos: true,
      hasSignature: true,
      qrVerified: true,
      co2Saved: 6.5,
      uploadMethod: 'csv',
      status: 'flagged'
    }
  ];

  const collectorPayouts: CollectorPayout[] = [
    {
      id: 'PAY001',
      collectorId: 'COL001',
      collectorName: 'Maria Santos',
      location: 'Downtown Area',
      tokensEarned: 456,
      volumeCollected: 45.6,
      payoutDate: '2024-08-16',
      payoutStatus: 'processed',
      transactionHash: '0x1a2b3c4d5e6f789012345678901234567890abcd',
      walletAddress: '0xABCD...5678',
      performanceRating: 4.8
    },
    {
      id: 'PAY002',
      collectorId: 'COL005',
      collectorName: 'John Chen',
      location: 'Residential Area',
      tokensEarned: 238,
      volumeCollected: 23.8,
      payoutDate: '2024-08-16',
      payoutStatus: 'pending',
      walletAddress: '0x1234...ABCD',
      performanceRating: 4.2
    },
    {
      id: 'PAY003',
      collectorId: 'COL009',
      collectorName: 'Sarah Johnson',
      location: 'Industrial Zone',
      tokensEarned: 892,
      volumeCollected: 89.2,
      payoutDate: '2024-08-15',
      payoutStatus: 'processed',
      transactionHash: '0x9876543210abcdef0123456789abcdef01234567',
      walletAddress: '0x9876...DEF0',
      performanceRating: 4.9
    }
  ];

  const pickupRequests: PickupRequest[] = [
    {
      id: 'PU001',
      requestDate: '2024-08-16T08:00:00Z',
      scheduledDate: '2024-08-17T10:00:00Z',
      location: 'Green Mart Supermarket',
      estimatedVolume: 120,
      priority: 'high',
      status: 'scheduled',
      driverAssigned: 'Driver Tom Wilson',
      coordinates: { lat: 40.7589, lng: -73.9851 },
      contactPerson: 'Mike Rodriguez',
      contactPhone: '+1-555-0123',
      notes: 'Loading dock access required. Contact security at gate.'
    },
    {
      id: 'PU002',
      requestDate: '2024-08-15T14:30:00Z',
      scheduledDate: '2024-08-16T15:00:00Z',
      location: 'Riverside Community Center',
      estimatedVolume: 85,
      priority: 'medium',
      status: 'completed',
      driverAssigned: 'Driver Lisa Chang',
      coordinates: { lat: 40.7614, lng: -73.9776 },
      contactPerson: 'Anna Smith',
      contactPhone: '+1-555-0456',
      notes: 'Collection completed successfully. Community very engaged.'
    },
    {
      id: 'PU003',
      requestDate: '2024-08-16T11:15:00Z',
      scheduledDate: '2024-08-18T09:00:00Z',
      location: 'Tech Innovation Hub',
      estimatedVolume: 200,
      priority: 'urgent',
      status: 'in-progress',
      driverAssigned: 'Driver Carlos Martinez',
      coordinates: { lat: 40.7505, lng: -73.9934 },
      contactPerson: 'David Kim',
      contactPhone: '+1-555-0789',
      notes: 'Large volume expected. Bring extra containers.'
    }
  ];

  const aggregatorReports: AggregatorReport[] = [
    {
      id: 'AGG001',
      centerName: 'Central Processing Facility',
      location: 'Brooklyn, NY',
      reportPeriod: 'August 2024',
      volumeProcessed: 2450,
      co2SavedEstimate: 665.5,
      contaminationRate: 6.2,
      throughputEfficiency: 94.5,
      operationalCosts: 15400,
      qualityScore: 92,
      certifications: ['ISO 14001', 'R2 Certified']
    },
    {
      id: 'AGG002',
      centerName: 'Northside Recycling Hub',
      location: 'Queens, NY',
      reportPeriod: 'August 2024',
      volumeProcessed: 1890,
      co2SavedEstimate: 513.3,
      contaminationRate: 4.8,
      throughputEfficiency: 97.2,
      operationalCosts: 12200,
      qualityScore: 95,
      certifications: ['ISO 14001', 'LEED Gold']
    }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const simulateUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': case 'processed': case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': case 'scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'flagged': case 'failed': case 'cancelled': return 'bg-red-100 text-red-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredLogs = collectionLogs.filter(log => {
    const matchesSearch = log.collectorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Truck className="w-8 h-8 text-green-500" />
          <div>
            <h1 className="text-3xl font-bold">Recycler Dashboard</h1>
            <p className="text-muted-foreground">PET bottle collection data upload and management center</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-green-50 text-green-700">
            <Wifi className="w-3 h-3 mr-1" />
            IoT Connected
          </Badge>
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            <Database className="w-3 h-3 mr-1" />
            API Active
          </Badge>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <Package className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{collectionLogs.reduce((sum, log) => sum + log.volume, 0).toFixed(1)}kg</div>
                <div className="text-sm text-muted-foreground">Total Collected</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{new Set(collectionLogs.map(log => log.collectorId)).size}</div>
                <div className="text-sm text-muted-foreground">Active Collectors</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{collectorPayouts.reduce((sum, payout) => sum + payout.tokensEarned, 0)}</div>
                <div className="text-sm text-muted-foreground">Tokens Earned</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <Leaf className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{collectionLogs.reduce((sum, log) => sum + log.co2Saved, 0).toFixed(1)}</div>
                <div className="text-sm text-muted-foreground">CO₂ Saved (kg)</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="collection-upload">Collection Data Upload</TabsTrigger>
          <TabsTrigger value="payment-rewards">Payment & Rewards</TabsTrigger>
          <TabsTrigger value="partner-data">Partner Data</TabsTrigger>
          <TabsTrigger value="analytics-export">Analytics & Export</TabsTrigger>
        </TabsList>

        <TabsContent value="collection-upload" className="space-y-6">
          {/* Collection Data Upload Options */}
          <Card>
            <CardHeader>
              <CardTitle>Collection Data Upload</CardTitle>
              <CardDescription>Choose your method to upload PET bottle collection data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <Card className={`cursor-pointer transition-all ${uploadType === 'csv' ? 'ring-2 ring-green-500 bg-green-50' : 'hover:bg-muted/50'}`} onClick={() => setUploadType('csv')}>
                  <CardContent className="pt-6 text-center">
                    <FileText className="w-12 h-12 text-green-500 mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">CSV/Excel Upload</h3>
                    <p className="text-sm text-muted-foreground">Bulk collection logs</p>
                  </CardContent>
                </Card>

                <Card className={`cursor-pointer transition-all ${uploadType === 'mobile' ? 'ring-2 ring-green-500 bg-green-50' : 'hover:bg-muted/50'}`} onClick={() => setUploadType('mobile')}>
                  <CardContent className="pt-6 text-center">
                    <Smartphone className="w-12 h-12 text-blue-500 mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">Mobile App Entry</h3>
                    <p className="text-sm text-muted-foreground">Direct from collectors</p>
                  </CardContent>
                </Card>

                <Card className={`cursor-pointer transition-all ${uploadType === 'iot' ? 'ring-2 ring-green-500 bg-green-50' : 'hover:bg-muted/50'}`} onClick={() => setUploadType('iot')}>
                  <CardContent className="pt-6 text-center">
                    <Wifi className="w-12 h-12 text-purple-500 mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">IoT Integration</h3>
                    <p className="text-sm text-muted-foreground">Smart bins automated</p>
                  </CardContent>
                </Card>
              </div>

              {uploadType === 'csv' && (
                <div className="space-y-4 border-t pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">CSV/Excel Collection Logs Upload</h4>
                      <p className="text-sm text-muted-foreground">
                        Upload collection data with date, volume, location, collector ID, and quality metrics
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Template
                    </Button>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv,.xlsx,.xls"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <Button
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full h-24 border-dashed"
                      >
                        <div className="text-center">
                          <Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                          <div className="text-sm">Choose file or drag and drop</div>
                          <div className="text-xs text-muted-foreground">CSV, Excel files up to 50MB</div>
                        </div>
                      </Button>
                      {selectedFile && (
                        <div className="mt-2 text-sm text-muted-foreground">
                          Selected: {selectedFile.name}
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div>
                        <Label>Collection Region</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select region" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="downtown">Downtown Area</SelectItem>
                            <SelectItem value="residential">Residential Areas</SelectItem>
                            <SelectItem value="commercial">Commercial Districts</SelectItem>
                            <SelectItem value="industrial">Industrial Zones</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label>Quality Check Level</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select quality level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="basic">Basic (Visual Inspection)</SelectItem>
                            <SelectItem value="standard">Standard (Contamination Check)</SelectItem>
                            <SelectItem value="comprehensive">Comprehensive (Full Analysis)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch id="auto-verify" />
                        <Label htmlFor="auto-verify">Auto-verify collections</Label>
                      </div>
                    </div>
                  </div>

                  {selectedFile && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Upload Progress</span>
                        <span className="text-sm text-muted-foreground">{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} />
                      <div className="flex space-x-2">
                        <Button 
                          onClick={simulateUpload}
                          disabled={isUploading}
                          className="flex-1"
                        >
                          {isUploading ? (
                            <>
                              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <Upload className="w-4 h-4 mr-2" />
                              Upload Collection Data
                            </>
                          )}
                        </Button>
                        <Button variant="outline">
                          <Eye className="w-4 h-4 mr-2" />
                          Preview
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {uploadType === 'mobile' && (
                <div className="space-y-4 border-t pt-6">
                  <h4 className="font-medium">Mobile App Integration</h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <Alert>
                        <Smartphone className="w-4 h-4" />
                        <AlertTitle>Mobile App Status</AlertTitle>
                        <AlertDescription>
                          Connected to Ping Collector Mobile App v2.1.0
                        </AlertDescription>
                      </Alert>
                      <div className="space-y-3">
                        <div>
                          <Label>Real-time Sync</Label>
                          <div className="flex items-center justify-between p-3 border rounded-lg">
                            <span className="text-sm">Auto-sync collection entries</span>
                            <Switch defaultChecked />
                          </div>
                        </div>
                        <div>
                          <Label>Photo Verification</Label>
                          <div className="flex items-center justify-between p-3 border rounded-lg">
                            <span className="text-sm">Require proof photos</span>
                            <Switch defaultChecked />
                          </div>
                        </div>
                        <div>
                          <Label>GPS Tracking</Label>
                          <div className="flex items-center justify-between p-3 border rounded-lg">
                            <span className="text-sm">Track collection locations</span>
                            <Switch defaultChecked />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label>Connected Collectors</Label>
                        <div className="border rounded-lg p-4 space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Maria Santos</span>
                            <Badge variant="outline" className="bg-green-50 text-green-700">Active</Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span>John Chen</span>
                            <Badge variant="outline" className="bg-green-50 text-green-700">Active</Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span>Sarah Johnson</span>
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Offline</Badge>
                          </div>
                        </div>
                      </div>
                      <Button className="w-full">
                        <Users className="w-4 h-4 mr-2" />
                        Manage Collector Access
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {uploadType === 'iot' && (
                <div className="space-y-4 border-t pt-6">
                  <h4 className="font-medium">IoT Smart Bins Integration</h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label>API Endpoint Configuration</Label>
                        <Input value="https://api.ping.com/v1/iot/collection" readOnly />
                      </div>
                      <div>
                        <Label>Authentication Key</Label>
                        <div className="flex space-x-2">
                          <Input type="password" value="iot_key_************************" readOnly />
                          <Button variant="outline" size="sm">
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div>
                        <Label>Data Format</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="JSON (Recommended)" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="json">JSON</SelectItem>
                            <SelectItem value="xml">XML</SelectItem>
                            <SelectItem value="csv">CSV</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label>Connected Smart Bins</Label>
                        <div className="border rounded-lg p-4 space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Bin #003 - Mall Entrance</span>
                            <Badge variant="outline" className="bg-green-50 text-green-700">Online</Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span>Bin #007 - Park Avenue</span>
                            <Badge variant="outline" className="bg-green-50 text-green-700">Online</Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span>Bin #012 - Transit Hub</span>
                            <Badge variant="outline" className="bg-red-50 text-red-700">Offline</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" className="flex-1">
                          <Wifi className="w-4 h-4 mr-2" />
                          Test Connection
                        </Button>
                        <Button variant="outline" className="flex-1">
                          <Settings className="w-4 h-4 mr-2" />
                          Configure
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Collection Logs Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Collection Logs</CardTitle>
                  <CardDescription>Monitor and manage PET bottle collection data</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search collections..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="verified">Verified</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="flagged">Flagged</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Collection Details</TableHead>
                    <TableHead>Collector</TableHead>
                    <TableHead>Volume & Quality</TableHead>
                    <TableHead>Verification</TableHead>
                    <TableHead>Environmental Impact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{log.id}</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(log.date).toLocaleDateString()} {new Date(log.date).toLocaleTimeString()}
                          </div>
                          <div className="text-xs text-muted-foreground">{log.location}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{log.collectorName}</div>
                          <div className="text-sm text-muted-foreground">{log.collectorId}</div>
                          <div className="flex items-center space-x-1 mt-1">
                            {log.uploadMethod === 'mobile' && <Smartphone className="w-3 h-3 text-blue-500" />}
                            {log.uploadMethod === 'iot' && <Wifi className="w-3 h-3 text-purple-500" />}
                            {log.uploadMethod === 'csv' && <FileText className="w-3 h-3 text-green-500" />}
                            <span className="text-xs text-muted-foreground">{log.uploadMethod}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{log.volume} {log.unit}</div>
                          <div className="text-xs">
                            <span className="text-muted-foreground">Contamination: </span>
                            <span className={log.contaminationRate > 10 ? 'text-red-600' : 'text-green-600'}>
                              {log.contaminationRate}%
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Clear: {log.bottleTypes.clearPET}kg | Colored: {log.bottleTypes.coloredPET}kg
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col space-y-1">
                          {log.hasProofPhotos && (
                            <Badge variant="outline" className="text-xs w-fit">
                              <Camera className="w-3 h-3 mr-1" />
                              Photos
                            </Badge>
                          )}
                          {log.hasSignature && (
                            <Badge variant="outline" className="text-xs w-fit">
                              <Edit className="w-3 h-3 mr-1" />
                              Signed
                            </Badge>
                          )}
                          {log.qrVerified && (
                            <Badge variant="outline" className="text-xs w-fit">
                              <QrCode className="w-3 h-3 mr-1" />
                              QR Verified
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-center">
                          <div className="font-semibold text-green-600">{log.co2Saved} kg</div>
                          <div className="text-xs text-muted-foreground">CO₂ Saved</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(log.status)}>
                          {log.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment-rewards" className="space-y-6">
          {/* Payout Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Collector Payout Management</CardTitle>
              <CardDescription>Upload and manage token distributions to collectors</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Bulk Payout Upload</h4>
                  <div>
                    <Label>Payout List (CSV)</Label>
                    <input
                      type="file"
                      accept=".csv,.xlsx"
                      className="hidden"
                      id="payout-upload"
                    />
                    <Button
                      variant="outline"
                      className="w-full mt-2"
                      onClick={() => document.getElementById('payout-upload')?.click()}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Payout List
                    </Button>
                  </div>
                  <div>
                    <Label>Total Payout Amount</Label>
                    <Input type="number" placeholder="Total tokens to distribute" />
                  </div>
                  <div>
                    <Label>Payout Period</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input type="date" />
                      <Input type="date" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">API Integration</h4>
                  <Alert>
                    <Database className="w-4 h-4" />
                    <AlertTitle>Ping Wallet Integration</AlertTitle>
                    <AlertDescription>
                      Connected to Ping wallet system for automated token distribution
                    </AlertDescription>
                  </Alert>
                  <div>
                    <Label>Auto-payout Settings</Label>
                    <div className="space-y-2 mt-2">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="text-sm">Enable auto-payouts</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="text-sm">Weekly batch processing</span>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="text-sm">Minimum payout threshold (10 tokens)</span>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-4">Manual Payout Entry</h4>
                <div className="grid md:grid-cols-4 gap-4">
                  <div>
                    <Label>Collector ID</Label>
                    <Input placeholder="COL001" />
                  </div>
                  <div>
                    <Label>Tokens</Label>
                    <Input type="number" placeholder="250" />
                  </div>
                  <div>
                    <Label>Volume (kg)</Label>
                    <Input type="number" placeholder="25.0" />
                  </div>
                  <div className="flex items-end">
                    <Button className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Payout
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payout Records */}
          <Card>
            <CardHeader>
              <CardTitle>Payout Records</CardTitle>
              <CardDescription>Track token distributions and payment status</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Collector</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Volume Collected</TableHead>
                    <TableHead>Tokens Earned</TableHead>
                    <TableHead>Payout Status</TableHead>
                    <TableHead>Transaction</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {collectorPayouts.map((payout) => (
                    <TableRow key={payout.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{payout.collectorName}</div>
                          <div className="text-sm text-muted-foreground">{payout.collectorId}</div>
                          <div className="text-xs text-muted-foreground">{payout.location}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={`text-sm ${i < Math.floor(payout.performanceRating) ? 'text-yellow-500' : 'text-gray-300'}`}>★</span>
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">{payout.performanceRating}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-center">
                          <div className="font-semibold">{payout.volumeCollected} kg</div>
                          <div className="text-xs text-muted-foreground">collected</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-center">
                          <div className="font-semibold text-blue-600">{payout.tokensEarned}</div>
                          <div className="text-xs text-muted-foreground">tokens</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(payout.payoutStatus)}>
                          {payout.payoutStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          {payout.transactionHash ? (
                            <div>
                              <div className="text-xs text-muted-foreground">
                                {payout.transactionHash.slice(0, 8)}...{payout.transactionHash.slice(-6)}
                              </div>
                              <Button variant="ghost" size="sm" className="p-0 h-auto">
                                <ExternalLink className="w-3 h-3" />
                              </Button>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">Pending</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          {payout.payoutStatus === 'pending' && (
                            <Button variant="ghost" size="sm">
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="sm">
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="partner-data" className="space-y-6">
          {/* Pickup Requests */}
          <Card>
            <CardHeader>
              <CardTitle>Pickup Requests Management</CardTitle>
              <CardDescription>Manage scheduled pickups and driver assignments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      New Pickup Request
                    </Button>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <MapPin className="w-4 h-4 mr-2" />
                      View Map
                    </Button>
                    <Button variant="outline" size="sm">
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule View
                    </Button>
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Request Details</TableHead>
                      <TableHead>Location & Contact</TableHead>
                      <TableHead>Schedule</TableHead>
                      <TableHead>Volume</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Driver</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pickupRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{request.id}</div>
                            <div className="text-sm text-muted-foreground">
                              Requested: {new Date(request.requestDate).toLocaleDateString()}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{request.location}</div>
                            <div className="text-sm text-muted-foreground">{request.contactPerson}</div>
                            <div className="text-xs text-muted-foreground">{request.contactPhone}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {new Date(request.scheduledDate).toLocaleDateString()}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(request.scheduledDate).toLocaleTimeString()}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-center">
                            <div className="font-semibold">{request.estimatedVolume} kg</div>
                            <div className="text-xs text-muted-foreground">estimated</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getPriorityColor(request.priority)}>
                            {request.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(request.status)}>
                            {request.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {request.driverAssigned || (
                              <Button variant="ghost" size="sm" className="p-0 h-auto text-blue-600">
                                Assign Driver
                              </Button>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Pickup Request Details</DialogTitle>
                                  <DialogDescription>Request ID: {request.id}</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label>Location</Label>
                                      <p className="text-sm">{request.location}</p>
                                    </div>
                                    <div>
                                      <Label>Estimated Volume</Label>
                                      <p className="text-sm">{request.estimatedVolume} kg</p>
                                    </div>
                                    <div>
                                      <Label>Contact Person</Label>
                                      <p className="text-sm">{request.contactPerson}</p>
                                    </div>
                                    <div>
                                      <Label>Phone</Label>
                                      <p className="text-sm">{request.contactPhone}</p>
                                    </div>
                                  </div>
                                  <div>
                                    <Label>Notes</Label>
                                    <p className="text-sm mt-1">{request.notes}</p>
                                  </div>
                                  <div className="flex items-center space-x-4">
                                    <Badge className={getPriorityColor(request.priority)}>
                                      {request.priority} priority
                                    </Badge>
                                    <Badge className={getStatusColor(request.status)}>
                                      {request.status}
                                    </Badge>
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button variant="outline">Edit Request</Button>
                                  <Button>Update Status</Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                            <Button variant="ghost" size="sm">
                              <MapPin className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Aggregator Reports */}
          <Card>
            <CardHeader>
              <CardTitle>Aggregator Performance Reports</CardTitle>
              <CardDescription>Monitor processing centers and performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Processing Center</TableHead>
                    <TableHead>Report Period</TableHead>
                    <TableHead>Volume Processed</TableHead>
                    <TableHead>Environmental Impact</TableHead>
                    <TableHead>Quality Metrics</TableHead>
                    <TableHead>Certifications</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {aggregatorReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{report.centerName}</div>
                          <div className="text-sm text-muted-foreground">{report.location}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{report.reportPeriod}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-center">
                          <div className="font-semibold text-blue-600">{report.volumeProcessed} kg</div>
                          <div className="text-xs text-muted-foreground">processed</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm">
                            <span className="font-medium text-green-600">{report.co2SavedEstimate} kg</span>
                            <span className="text-muted-foreground text-xs"> CO₂ saved</span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            ${report.operationalCosts.toLocaleString()} costs
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm">
                            <span className="text-muted-foreground">Quality: </span>
                            <span className={report.qualityScore >= 90 ? 'text-green-600 font-medium' : 'text-yellow-600 font-medium'}>
                              {report.qualityScore}%
                            </span>
                          </div>
                          <div className="text-xs">
                            <span className="text-muted-foreground">Contamination: </span>
                            <span className={report.contaminationRate <= 5 ? 'text-green-600' : 'text-red-600'}>
                              {report.contaminationRate}%
                            </span>
                          </div>
                          <div className="text-xs">
                            <span className="text-muted-foreground">Efficiency: </span>
                            <span className="text-blue-600">{report.throughputEfficiency}%</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {report.certifications.map((cert, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {cert}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <BarChart3 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics-export" className="space-y-6">
          {/* Export Options */}
          <Card>
            <CardHeader>
              <CardTitle>Data Export & Analytics</CardTitle>
              <CardDescription>Export recycling data and generate compliance reports</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Export Filters</h4>
                  <div className="space-y-3">
                    <div>
                      <Label>Date Range</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Input type="date" />
                        <Input type="date" />
                      </div>
                    </div>
                    <div>
                      <Label>Region</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="All regions" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Regions</SelectItem>
                          <SelectItem value="downtown">Downtown</SelectItem>
                          <SelectItem value="residential">Residential</SelectItem>
                          <SelectItem value="commercial">Commercial</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Data Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select data type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="collections">Collection Logs</SelectItem>
                          <SelectItem value="payouts">Payout Records</SelectItem>
                          <SelectItem value="environmental">Environmental Impact</SelectItem>
                          <SelectItem value="performance">Performance Metrics</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Export Format</h4>
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-2">
                      <Card className="cursor-pointer p-3 text-center hover:bg-muted/50">
                        <FileText className="w-6 h-6 mx-auto mb-1" />
                        <div className="text-xs">CSV</div>
                      </Card>
                      <Card className="cursor-pointer p-3 text-center hover:bg-muted/50">
                        <FileText className="w-6 h-6 mx-auto mb-1" />
                        <div className="text-xs">Excel</div>
                      </Card>
                      <Card className="cursor-pointer p-3 text-center hover:bg-muted/50">
                        <Database className="w-6 h-6 mx-auto mb-1" />
                        <div className="text-xs">PDF</div>
                      </Card>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Quick Export</h4>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="w-4 h-4 mr-2" />
                      This Week's Collections
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Monthly Performance
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Leaf className="w-4 h-4 mr-2" />
                      Environmental Impact
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Generate Custom Export
                </Button>
                <Button variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Export
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Compliance Reports */}
          <Card>
            <CardHeader>
              <CardTitle>Government & CSR Compliance Reports</CardTitle>
              <CardDescription>Pre-formatted reports for sustainability disclosures</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Government Compliance</h4>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start h-auto p-4">
                      <div className="text-left">
                        <div className="font-medium">EPA Waste Diversion Report</div>
                        <div className="text-sm text-muted-foreground">US Environmental Protection Agency format</div>
                      </div>
                    </Button>
                    <Button variant="outline" className="w-full justify-start h-auto p-4">
                      <div className="text-left">
                        <div className="font-medium">EU Circular Economy Report</div>
                        <div className="text-sm text-muted-foreground">European Union compliance format</div>
                      </div>
                    </Button>
                    <Button variant="outline" className="w-full justify-start h-auto p-4">
                      <div className="text-left">
                        <div className="font-medium">ISO 14001 Environmental Report</div>
                        <div className="text-sm text-muted-foreground">International standards format</div>
                      </div>
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Corporate Social Responsibility</h4>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start h-auto p-4">
                      <div className="text-left">
                        <div className="font-medium">GRI Sustainability Report</div>
                        <div className="text-sm text-muted-foreground">Global Reporting Initiative standard</div>
                      </div>
                    </Button>
                    <Button variant="outline" className="w-full justify-start h-auto p-4">
                      <div className="text-left">
                        <div className="font-medium">SASB Environmental Metrics</div>
                        <div className="text-sm text-muted-foreground">Sustainability Accounting Standards</div>
                      </div>
                    </Button>
                    <Button variant="outline" className="w-full justify-start h-auto p-4">
                      <div className="text-left">
                        <div className="font-medium">Carbon Footprint Assessment</div>
                        <div className="text-sm text-muted-foreground">CO₂ reduction and impact analysis</div>
                      </div>
                    </Button>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="space-y-4">
                <h4 className="font-medium">Custom Report Builder</h4>
                <div className="grid md:grid-cols-4 gap-4">
                  <div>
                    <Label>Report Template</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select template" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sustainability">Sustainability Report</SelectItem>
                        <SelectItem value="performance">Performance Metrics</SelectItem>
                        <SelectItem value="compliance">Compliance Summary</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Reporting Period</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="annually">Annually</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Include Charts</Label>
                    <div className="flex items-center space-x-2 mt-2">
                      <Switch defaultChecked />
                      <span className="text-sm">Visual analytics</span>
                    </div>
                  </div>
                  <div className="flex items-end">
                    <Button className="w-full">
                      <FileText className="w-4 h-4 mr-2" />
                      Generate Report
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Exports */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Exports</CardTitle>
              <CardDescription>Download previously generated reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: 'Collection_Data_Aug_2024.xlsx', date: '2024-08-16', size: '2.3 MB', type: 'Excel' },
                  { name: 'Environmental_Impact_Q3_2024.pdf', date: '2024-08-15', size: '1.8 MB', type: 'PDF' },
                  { name: 'Payout_Records_Weekly.csv', date: '2024-08-14', size: '876 KB', type: 'CSV' },
                  { name: 'EPA_Compliance_Report_2024.pdf', date: '2024-08-13', size: '3.1 MB', type: 'PDF' }
                ].map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-8 h-8 text-blue-500" />
                      <div>
                        <div className="font-medium">{file.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {file.date} • {file.size} • {file.type}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}