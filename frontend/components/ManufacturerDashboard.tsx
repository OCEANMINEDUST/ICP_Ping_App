import React, { useState, useRef } from 'react';
import { Upload, Download, FileText, Database, Settings, Camera, MapPin, Calendar, QrCode, Nfc, Zap, Image, Video, Globe, AlertTriangle, CheckCircle, Clock, Filter, Search, RefreshCw, ExternalLink, Copy, Eye, Trash2, Edit, Plus, BarChart3, TrendingUp, Factory } from 'lucide-react';
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

interface ProductBatch {
  id: string;
  sku: string;
  batchNo: string;
  productName: string;
  expiryDate: string;
  packageId: string;
  productionPlant: string;
  productionDate: string;
  region: string;
  qrCodeGenerated: boolean;
  nfcEnabled: boolean;
  icpCanisterId: string;
  status: 'active' | 'archived' | 'pending';
  verificationsCount: number;
  uploadDate: string;
}

interface CounterfeitReport {
  id: string;
  reportDate: string;
  productSku: string;
  batchNo: string;
  location: string;
  reporterType: 'consumer' | 'retailer' | 'authority';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'investigating' | 'confirmed' | 'false-positive';
  hasImages: boolean;
  hasVideo: boolean;
  description: string;
  geoLocation?: { lat: number; lng: number };
}

interface Campaign {
  id: string;
  name: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  startDate: string;
  endDate: string;
  targetSKUs: string[];
  tokenRewardPerVerification: number;
  totalBudget: number;
  spentBudget: number;
  regions: string[];
  languages: string[];
  hasMarketingAssets: boolean;
  verifications: number;
}

export function ManufacturerDashboard() {
  const [activeTab, setActiveTab] = useState('product-upload');
  const [uploadType, setUploadType] = useState<'csv' | 'api' | 'manual'>('csv');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock data
  const productBatches: ProductBatch[] = [
    {
      id: 'PB001',
      sku: 'BEV-001-COLA-500ML',
      batchNo: 'BCH20240815001',
      productName: 'Premium Cola 500ml',
      expiryDate: '2025-02-15',
      packageId: 'PKG-BEV-001-500',
      productionPlant: 'Plant A - Germany',
      productionDate: '2024-08-15',
      region: 'Europe',
      qrCodeGenerated: true,
      nfcEnabled: false,
      icpCanisterId: 'rdmx6-jaaaa-aaaah-qcaiq-cai',
      status: 'active',
      verificationsCount: 15420,
      uploadDate: '2024-08-15T10:30:00Z'
    },
    {
      id: 'PB002',
      sku: 'SNK-002-CHIPS-150G',
      batchNo: 'BCH20240814002',
      productName: 'Crispy Chips Original 150g',
      expiryDate: '2024-12-20',
      packageId: 'PKG-SNK-002-150',
      productionPlant: 'Plant B - USA',
      productionDate: '2024-08-14',
      region: 'North America',
      qrCodeGenerated: true,
      nfcEnabled: true,
      icpCanisterId: 'rrkah-fqaaa-aaaah-qcaiq-cai',
      status: 'active',
      verificationsCount: 8900,
      uploadDate: '2024-08-14T14:20:00Z'
    },
    {
      id: 'PB003',
      sku: 'HYG-003-SOAP-250ML',
      batchNo: 'BCH20240813003',
      productName: 'Antibacterial Hand Soap 250ml',
      expiryDate: '2026-08-13',
      packageId: 'PKG-HYG-003-250',
      productionPlant: 'Plant C - India',
      productionDate: '2024-08-13',
      region: 'Asia Pacific',
      qrCodeGenerated: false,
      nfcEnabled: false,
      icpCanisterId: 'pending',
      status: 'pending',
      verificationsCount: 0,
      uploadDate: '2024-08-13T09:15:00Z'
    }
  ];

  const counterfeitReports: CounterfeitReport[] = [
    {
      id: 'CR001',
      reportDate: '2024-08-16T11:30:00Z',
      productSku: 'BEV-001-COLA-500ML',
      batchNo: 'BCH20240815001',
      location: 'Berlin, Germany',
      reporterType: 'consumer',
      severity: 'high',
      status: 'investigating',
      hasImages: true,
      hasVideo: false,
      description: 'Suspicious packaging quality, different taste, QR code leads to error page',
      geoLocation: { lat: 52.5200, lng: 13.4050 }
    },
    {
      id: 'CR002',
      reportDate: '2024-08-15T16:45:00Z',
      productSku: 'SNK-002-CHIPS-150G',
      batchNo: 'BCH20240814002',
      location: 'New York, USA',
      reporterType: 'retailer',
      severity: 'critical',
      status: 'confirmed',
      hasImages: true,
      hasVideo: true,
      description: 'Counterfeit product detected in retail chain, packaging differs significantly from original',
      geoLocation: { lat: 40.7128, lng: -74.0060 }
    },
    {
      id: 'CR003',
      reportDate: '2024-08-14T08:20:00Z',
      productSku: 'HYG-003-SOAP-250ML',
      batchNo: 'BCH20240813003',
      location: 'Mumbai, India',
      reporterType: 'authority',
      severity: 'medium',
      status: 'false-positive',
      hasImages: false,
      hasVideo: false,
      description: 'Reported by customs authority, but investigation showed legitimate product with minor labeling variation'
    }
  ];

  const campaigns: Campaign[] = [
    {
      id: 'CAM001',
      name: 'Summer Cola Verification Campaign',
      status: 'active',
      startDate: '2024-08-01',
      endDate: '2024-08-31',
      targetSKUs: ['BEV-001-COLA-500ML'],
      tokenRewardPerVerification: 10,
      totalBudget: 50000,
      spentBudget: 18420,
      regions: ['Europe', 'North America'],
      languages: ['en', 'de', 'fr'],
      hasMarketingAssets: true,
      verifications: 15420
    },
    {
      id: 'CAM002',
      name: 'Global Snack Authentication Drive',
      status: 'paused',
      startDate: '2024-07-15',
      endDate: '2024-09-15',
      targetSKUs: ['SNK-002-CHIPS-150G'],
      tokenRewardPerVerification: 8,
      totalBudget: 30000,
      spentBudget: 12450,
      regions: ['North America', 'Asia Pacific'],
      languages: ['en', 'es', 'hi'],
      hasMarketingAssets: false,
      verifications: 8900
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
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      case 'investigating': return 'bg-blue-100 text-blue-800';
      case 'confirmed': return 'bg-red-100 text-red-800';
      case 'false-positive': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-blue-100 text-blue-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredBatches = productBatches.filter(batch => {
    const matchesSearch = batch.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         batch.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         batch.batchNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || batch.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Factory className="w-8 h-8 text-blue-500" />
          <div>
            <h1 className="text-3xl font-bold">Manufacturer Dashboard</h1>
            <p className="text-muted-foreground">Data uploading, collection, and management center</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-green-50 text-green-700">
            <Database className="w-3 h-3 mr-1" />
            Connected to ICP
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
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Upload className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{productBatches.length}</div>
                <div className="text-sm text-muted-foreground">Product Batches</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {productBatches.reduce((sum, batch) => sum + batch.verificationsCount, 0).toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Total Verifications</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{counterfeitReports.length}</div>
                <div className="text-sm text-muted-foreground">Counterfeit Reports</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{campaigns.length}</div>
                <div className="text-sm text-muted-foreground">Active Campaigns</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="product-upload">Product Data Upload</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns & Rewards</TabsTrigger>
          <TabsTrigger value="counterfeit-reports">Counterfeit Reports</TabsTrigger>
          <TabsTrigger value="analytics-export">Analytics & Export</TabsTrigger>
        </TabsList>

        <TabsContent value="product-upload" className="space-y-6">
          {/* Upload Options */}
          <Card>
            <CardHeader>
              <CardTitle>Upload Product Catalog</CardTitle>
              <CardDescription>Choose your preferred method to upload product authentication data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <Card className={`cursor-pointer transition-all ${uploadType === 'csv' ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-muted/50'}`} onClick={() => setUploadType('csv')}>
                  <CardContent className="pt-6 text-center">
                    <FileText className="w-12 h-12 text-blue-500 mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">CSV/Excel Upload</h3>
                    <p className="text-sm text-muted-foreground">Bulk upload via file</p>
                  </CardContent>
                </Card>

                <Card className={`cursor-pointer transition-all ${uploadType === 'api' ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-muted/50'}`} onClick={() => setUploadType('api')}>
                  <CardContent className="pt-6 text-center">
                    <Database className="w-12 h-12 text-green-500 mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">API Integration</h3>
                    <p className="text-sm text-muted-foreground">Direct ERP connection</p>
                  </CardContent>
                </Card>

                <Card className={`cursor-pointer transition-all ${uploadType === 'manual' ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-muted/50'}`} onClick={() => setUploadType('manual')}>
                  <CardContent className="pt-6 text-center">
                    <Edit className="w-12 h-12 text-purple-500 mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">Manual Entry</h3>
                    <p className="text-sm text-muted-foreground">Individual product entry</p>
                  </CardContent>
                </Card>
              </div>

              {uploadType === 'csv' && (
                <div className="space-y-4 border-t pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">CSV/Excel File Upload</h4>
                      <p className="text-sm text-muted-foreground">
                        Upload your product catalog with SKU, Batch No., Expiry Date, and Packaging ID
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
                          <div className="text-xs text-muted-foreground">CSV, Excel files up to 10MB</div>
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
                        <Label>Production Plant</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select production plant" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="plant-a">Plant A - Germany</SelectItem>
                            <SelectItem value="plant-b">Plant B - USA</SelectItem>
                            <SelectItem value="plant-c">Plant C - India</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label>Distribution Region</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select region" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="europe">Europe</SelectItem>
                            <SelectItem value="north-america">North America</SelectItem>
                            <SelectItem value="asia-pacific">Asia Pacific</SelectItem>
                            <SelectItem value="latin-america">Latin America</SelectItem>
                          </SelectContent>
                        </Select>
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
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="w-4 h-4 mr-2" />
                              Upload File
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

              {uploadType === 'api' && (
                <div className="space-y-4 border-t pt-6">
                  <h4 className="font-medium">API Integration Setup</h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label>API Endpoint URL</Label>
                        <Input placeholder="https://your-erp-system.com/api/products" />
                      </div>
                      <div>
                        <Label>Authentication Method</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select auth method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="api-key">API Key</SelectItem>
                            <SelectItem value="oauth">OAuth 2.0</SelectItem>
                            <SelectItem value="basic">Basic Auth</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>API Key</Label>
                        <Input type="password" placeholder="Enter your API key" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label>Data Format</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select format" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="json">JSON</SelectItem>
                            <SelectItem value="xml">XML</SelectItem>
                            <SelectItem value="csv">CSV</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Sync Frequency</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="realtime">Real-time</SelectItem>
                            <SelectItem value="hourly">Hourly</SelectItem>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button className="w-full">
                        <Database className="w-4 h-4 mr-2" />
                        Test Connection
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {uploadType === 'manual' && (
                <div className="space-y-4 border-t pt-6">
                  <h4 className="font-medium">Manual Product Entry</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <Label>Product SKU</Label>
                        <Input placeholder="e.g., BEV-001-COLA-500ML" />
                      </div>
                      <div>
                        <Label>Batch Number</Label>
                        <Input placeholder="e.g., BCH20240816001" />
                      </div>
                      <div>
                        <Label>Product Name</Label>
                        <Input placeholder="e.g., Premium Cola 500ml" />
                      </div>
                      <div>
                        <Label>Expiry Date</Label>
                        <Input type="date" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <Label>Packaging ID</Label>
                        <Input placeholder="e.g., PKG-BEV-001-500" />
                      </div>
                      <div>
                        <Label>Production Plant</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select plant" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="plant-a">Plant A - Germany</SelectItem>
                            <SelectItem value="plant-b">Plant B - USA</SelectItem>
                            <SelectItem value="plant-c">Plant C - India</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Distribution Region</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select region" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="europe">Europe</SelectItem>
                            <SelectItem value="north-america">North America</SelectItem>
                            <SelectItem value="asia-pacific">Asia Pacific</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="nfc-enabled" />
                        <Label htmlFor="nfc-enabled">Enable NFC</Label>
                      </div>
                    </div>
                  </div>
                  <Button className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Product Batches Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Product Batches</CardTitle>
                  <CardDescription>Manage your uploaded product authentication data</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search products..."
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
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Batch Info</TableHead>
                    <TableHead>Authentication</TableHead>
                    <TableHead>Verifications</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBatches.map((batch) => (
                    <TableRow key={batch.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{batch.productName}</div>
                          <div className="text-sm text-muted-foreground">{batch.sku}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm">
                            <span className="font-medium">Batch:</span> {batch.batchNo}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Expires: {new Date(batch.expiryDate).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {batch.productionPlant}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {batch.qrCodeGenerated && (
                            <Badge variant="secondary" className="text-xs">
                              <QrCode className="w-3 h-3 mr-1" />
                              QR
                            </Badge>
                          )}
                          {batch.nfcEnabled && (
                            <Badge variant="secondary" className="text-xs">
                              <Nfc className="w-3 h-3 mr-1" />
                              NFC
                            </Badge>
                          )}
                          {batch.icpCanisterId !== 'pending' && (
                            <Badge variant="secondary" className="text-xs">
                              <Zap className="w-3 h-3 mr-1" />
                              ICP
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {batch.icpCanisterId}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-center">
                          <div className="font-semibold">{batch.verificationsCount.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">verifications</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(batch.status)}>
                          {batch.status}
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

        <TabsContent value="campaigns" className="space-y-6">
          {/* Campaign Creation */}
          <Card>
            <CardHeader>
              <CardTitle>Create New Campaign</CardTitle>
              <CardDescription>Set up token rewards and marketing campaigns for product verification</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label>Campaign Name</Label>
                    <Input placeholder="e.g., Summer Verification Campaign" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Start Date</Label>
                      <Input type="date" />
                    </div>
                    <div>
                      <Label>End Date</Label>
                      <Input type="date" />
                    </div>
                  </div>
                  <div>
                    <Label>Target SKUs</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select products" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Products</SelectItem>
                        <SelectItem value="bev-001">Premium Cola 500ml</SelectItem>
                        <SelectItem value="snk-002">Crispy Chips Original 150g</SelectItem>
                        <SelectItem value="hyg-003">Antibacterial Hand Soap 250ml</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Token Reward per Verification</Label>
                    <Input type="number" placeholder="10" />
                  </div>
                  <div>
                    <Label>Total Campaign Budget (Tokens)</Label>
                    <Input type="number" placeholder="50000" />
                  </div>
                  <div>
                    <Label>Target Regions</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select regions" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="global">Global</SelectItem>
                        <SelectItem value="europe">Europe</SelectItem>
                        <SelectItem value="north-america">North America</SelectItem>
                        <SelectItem value="asia-pacific">Asia Pacific</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Marketing Assets</h4>
                <div className="grid md:grid-cols-3 gap-4">
                  <Card className="border-dashed">
                    <CardContent className="pt-6 text-center">
                      <Image className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Upload Brand Logo</p>
                      <Button variant="ghost" size="sm" className="mt-2">
                        <Upload className="w-4 h-4 mr-2" />
                        Choose File
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-dashed">
                    <CardContent className="pt-6 text-center">
                      <Video className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Upload Campaign Video</p>
                      <Button variant="ghost" size="sm" className="mt-2">
                        <Upload className="w-4 h-4 mr-2" />
                        Choose File
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-dashed">
                    <CardContent className="pt-6 text-center">
                      <Globe className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Localized Messages</p>
                      <Button variant="ghost" size="sm" className="mt-2">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload CSV
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <Button className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Create Campaign
              </Button>
            </CardContent>
          </Card>

          {/* Active Campaigns */}
          <Card>
            <CardHeader>
              <CardTitle>Active Campaigns</CardTitle>
              <CardDescription>Monitor and manage your verification campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaigns.map((campaign) => (
                  <Card key={campaign.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <div className="flex items-center space-x-3">
                            <h3 className="font-semibold">{campaign.name}</h3>
                            <Badge className={getStatusColor(campaign.status)}>
                              {campaign.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                          <Button variant="outline" size="sm">
                            <BarChart3 className="w-4 h-4 mr-2" />
                            Analytics
                          </Button>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-lg font-semibold text-blue-600">{campaign.verifications.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">Verifications</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-green-600">{campaign.tokenRewardPerVerification} tokens</div>
                          <div className="text-sm text-muted-foreground">Per Verification</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-purple-600">{campaign.spentBudget.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">Spent Budget</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-orange-600">{((campaign.spentBudget / campaign.totalBudget) * 100).toFixed(0)}%</div>
                          <div className="text-sm text-muted-foreground">Budget Used</div>
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span>Budget Progress</span>
                          <span>{campaign.spentBudget.toLocaleString()} / {campaign.totalBudget.toLocaleString()} tokens</span>
                        </div>
                        <Progress value={(campaign.spentBudget / campaign.totalBudget) * 100} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="counterfeit-reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Counterfeit Reports Management</CardTitle>
              <CardDescription>Monitor and investigate counterfeit product reports from consumers and authorities</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report Details</TableHead>
                    <TableHead>Product Info</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Evidence</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {counterfeitReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{report.id}</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(report.reportDate).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            By: {report.reporterType}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{report.productSku}</div>
                          <div className="text-sm text-muted-foreground">
                            Batch: {report.batchNo}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{report.location}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getSeverityColor(report.severity)}>
                          {report.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {report.hasImages && (
                            <Badge variant="outline" className="text-xs">
                              <Camera className="w-3 h-3 mr-1" />
                              Photos
                            </Badge>
                          )}
                          {report.hasVideo && (
                            <Badge variant="outline" className="text-xs">
                              <Video className="w-3 h-3 mr-1" />
                              Video
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(report.status)}>
                          {report.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Counterfeit Report Details</DialogTitle>
                                <DialogDescription>Report ID: {report.id}</DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label>Product SKU</Label>
                                    <p className="text-sm">{report.productSku}</p>
                                  </div>
                                  <div>
                                    <Label>Batch Number</Label>
                                    <p className="text-sm">{report.batchNo}</p>
                                  </div>
                                  <div>
                                    <Label>Location</Label>
                                    <p className="text-sm">{report.location}</p>
                                  </div>
                                  <div>
                                    <Label>Reporter Type</Label>
                                    <p className="text-sm">{report.reporterType}</p>
                                  </div>
                                </div>
                                <div>
                                  <Label>Description</Label>
                                  <p className="text-sm mt-1">{report.description}</p>
                                </div>
                                <div className="flex items-center space-x-4">
                                  <Badge className={getSeverityColor(report.severity)}>
                                    {report.severity} severity
                                  </Badge>
                                  <Badge className={getStatusColor(report.status)}>
                                    {report.status}
                                  </Badge>
                                </div>
                              </div>
                              <DialogFooter>
                                <Button variant="outline">
                                  <Download className="w-4 h-4 mr-2" />
                                  Export Report
                                </Button>
                                <Button>Update Status</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
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

          {/* Export Reports */}
          <Card>
            <CardHeader>
              <CardTitle>Export Counterfeit Reports</CardTitle>
              <CardDescription>Download evidence and reports for legal compliance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-20 flex-col">
                  <Download className="w-6 h-6 mb-2" />
                  Export All Reports
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Camera className="w-6 h-6 mb-2" />
                  Export Evidence
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <FileText className="w-6 h-6 mb-2" />
                  Legal Compliance Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics-export" className="space-y-6">
          {/* Data Export Options */}
          <Card>
            <CardHeader>
              <CardTitle>Data Export & Analytics</CardTitle>
              <CardDescription>Export verification logs and analytics data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
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
                      <Label>Product SKU</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="All products" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Products</SelectItem>
                          <SelectItem value="bev-001">Premium Cola 500ml</SelectItem>
                          <SelectItem value="snk-002">Crispy Chips Original 150g</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Region</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="All regions" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Regions</SelectItem>
                          <SelectItem value="europe">Europe</SelectItem>
                          <SelectItem value="north-america">North America</SelectItem>
                          <SelectItem value="asia-pacific">Asia Pacific</SelectItem>
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
                        <div className="text-xs">JSON</div>
                      </Card>
                    </div>
                    <div>
                      <Label>Report Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select report type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="verification-logs">Verification Logs</SelectItem>
                          <SelectItem value="batch-analytics">Batch Analytics</SelectItem>
                          <SelectItem value="counterfeit-summary">Counterfeit Summary</SelectItem>
                          <SelectItem value="campaign-performance">Campaign Performance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
                <Button variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Report
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* API Access */}
          <Card>
            <CardHeader>
              <CardTitle>API Access</CardTitle>
              <CardDescription>Real-time data access for your internal systems</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <ExternalLink className="w-4 h-4" />
                <AlertTitle>API Endpoint</AlertTitle>
                <AlertDescription>
                  Your API base URL: https://api.ping-platform.com/v1/manufacturer/YOUR_API_KEY
                </AlertDescription>
              </Alert>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium">Available Endpoints</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between p-2 bg-muted/50 rounded">
                      <span>GET /products</span>
                      <Badge variant="outline">200ms</Badge>
                    </div>
                    <div className="flex justify-between p-2 bg-muted/50 rounded">
                      <span>GET /verifications</span>
                      <Badge variant="outline">150ms</Badge>
                    </div>
                    <div className="flex justify-between p-2 bg-muted/50 rounded">
                      <span>GET /counterfeits</span>
                      <Badge variant="outline">180ms</Badge>
                    </div>
                    <div className="flex justify-between p-2 bg-muted/50 rounded">
                      <span>POST /products</span>
                      <Badge variant="outline">220ms</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">API Configuration</h4>
                  <div className="space-y-2">
                    <div>
                      <Label>API Key</Label>
                      <div className="flex space-x-2">
                        <Input type="password" value="mk_prod_************************" readOnly />
                        <Button variant="outline" size="sm">
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label>Rate Limit</Label>
                      <p className="text-sm text-muted-foreground">1000 requests/hour</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Button variant="outline">
                  <FileText className="w-4 h-4 mr-2" />
                  API Documentation
                </Button>
                <Button variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Regenerate Key
                </Button>
                <Button variant="outline">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Usage Analytics
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Scheduled Reports */}
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Reports</CardTitle>
              <CardDescription>Automated reports delivered to your email</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center space-x-3">
                        <Clock className="w-8 h-8 text-blue-500" />
                        <div>
                          <h4 className="font-medium">Daily Verification Summary</h4>
                          <p className="text-sm text-muted-foreground">Every day at 9:00 AM</p>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <Badge variant="outline" className="bg-green-50 text-green-700">Active</Badge>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-8 h-8 text-green-500" />
                        <div>
                          <h4 className="font-medium">Weekly Analytics Report</h4>
                          <p className="text-sm text-muted-foreground">Every Monday at 8:00 AM</p>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <Badge variant="outline" className="bg-green-50 text-green-700">Active</Badge>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-dashed">
                    <CardContent className="pt-6 text-center">
                      <Plus className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <h4 className="font-medium mb-2">Add New Schedule</h4>
                      <Button variant="outline" size="sm">
                        Create Schedule
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}