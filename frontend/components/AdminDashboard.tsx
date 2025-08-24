import React, { useState } from 'react';
import { Settings, Users, Building2, Shield, TrendingUp, AlertTriangle, Database, Globe, Bell, Download, Search, Filter, Plus, Edit, Trash2, Eye, BarChart3, PieChart, Activity, Crown, Zap, Lock, Flag, CheckCircle, XCircle, DollarSign, Coins, Target, Brain, FileText, Scale, UserCheck, AlertCircle, Bot, Fingerprint, ExternalLink } from 'lucide-react';
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
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, AreaChart, Area } from 'recharts';

interface PlatformUser {
  id: string;
  name: string;
  email: string;
  role: 'consumer' | 'brand' | 'recycler' | 'admin';
  status: 'active' | 'suspended' | 'flagged' | 'pending-kyc';
  joinDate: string;
  lastActive: string;
  tokensEarned: number;
  activityScore: number;
  kycStatus: 'verified' | 'pending' | 'rejected' | 'not-required';
  flagReason?: string;
  ipfsHash?: string;
}

interface TokenEconomyMetrics {
  totalSupply: number;
  circulatingSupply: number;
  stakingPool: number;
  burnedTokens: number;
  dailyMinted: number;
  dailyBurned: number;
  inflationRate: number;
  transactionVolume: number;
  liquidityPools: number;
  averageTransactionSize: number;
}

interface FraudAlert {
  id: string;
  type: 'scanning-anomaly' | 'token-manipulation' | 'account-farming' | 'counterfeit-evidence';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  userId: string;
  userName: string;
  timestamp: string;
  aiConfidence: number;
  ipfsHash?: string;
  status: 'open' | 'investigating' | 'resolved' | 'false-positive';
  actionsTaken: string[];
}

interface CampaignApproval {
  id: string;
  campaignName: string;
  brandName: string;
  brandId: string;
  type: 'verification' | 'recycling' | 'awareness' | 'loyalty';
  budgetRequested: number;
  tokenAllocation: number;
  duration: string;
  targetAudience: string;
  expectedReach: number;
  status: 'pending' | 'approved' | 'rejected' | 'revision-required';
  submissionDate: string;
  description: string;
  riskAssessment: 'low' | 'medium' | 'high';
}

interface ComplianceRecord {
  id: string;
  type: 'gdpr-request' | 'kyc-verification' | 'audit-log' | 'data-export';
  userId?: string;
  userName?: string;
  requestDate: string;
  status: 'pending' | 'completed' | 'failed';
  region: string;
  dataTypes: string[];
  complianceOfficer: string;
  notes?: string;
}

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('system-overview');
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');

  // Mock platform ecosystem data
  const ecosystemStats = {
    totalUsers: 1254300,
    activeUsers: 896500,
    totalBrands: 1250,
    activeBrands: 1180,
    totalRecyclers: 245,
    activeRecyclers: 189,
    totalScans: 45892000,
    totalRecycled: 15674000,
    systemUptime: 99.97,
    globalRegions: 45,
    supportedCountries: 89
  };

  // Mock token economy data
  const tokenEconomy: TokenEconomyMetrics = {
    totalSupply: 1000000000,
    circulatingSupply: 456789000,
    stakingPool: 123456000,
    burnedTokens: 87654000,
    dailyMinted: 456789,
    dailyBurned: 234567,
    inflationRate: 2.34,
    transactionVolume: 12345678,
    liquidityPools: 45678900,
    averageTransactionSize: 234.56
  };

  // Mock users data
  const platformUsers: PlatformUser[] = [
    {
      id: 'USR-001',
      name: 'John Doe',
      email: 'john.doe@email.com',
      role: 'consumer',
      status: 'active',
      joinDate: '2024-01-15',
      lastActive: '2024-01-15 14:30',
      tokensEarned: 2485,
      activityScore: 92.5,
      kycStatus: 'verified'
    },
    {
      id: 'BRD-001',
      name: 'Global Beverages Inc.',
      email: 'admin@globalbev.com',
      role: 'brand',
      status: 'active',
      joinDate: '2023-10-20',
      lastActive: '2024-01-15 16:45',
      tokensEarned: 0,
      activityScore: 87.3,
      kycStatus: 'verified'
    },
    {
      id: 'USR-002',
      name: 'Suspicious User',
      email: 'suspect@temp.com',
      role: 'consumer',
      status: 'flagged',
      joinDate: '2024-01-10',
      lastActive: '2024-01-15 08:20',
      tokensEarned: 15000,
      activityScore: 15.2,
      kycStatus: 'rejected',
      flagReason: 'Abnormal scanning patterns detected',
      ipfsHash: 'QmX7Y8Z9...'
    }
  ];

  // Mock fraud alerts
  const fraudAlerts: FraudAlert[] = [
    {
      id: 'FRD-001',
      type: 'scanning-anomaly',
      severity: 'critical',
      description: 'User scanning 1000+ products per hour from single location',
      userId: 'USR-002',
      userName: 'Suspicious User',
      timestamp: '2024-01-15 09:30:22',
      aiConfidence: 97.8,
      status: 'investigating',
      actionsTaken: ['Account flagged', 'Tokens frozen', 'Evidence stored']
    },
    {
      id: 'FRD-002',
      type: 'counterfeit-evidence',
      severity: 'high',
      description: 'Coordinated counterfeit reporting from multiple accounts',
      userId: 'USR-045',
      userName: 'Network Account 1',
      timestamp: '2024-01-15 08:15:45',
      aiConfidence: 89.3,
      ipfsHash: 'QmA1B2C3...',
      status: 'open',
      actionsTaken: ['Evidence preserved', 'Pattern analysis initiated']
    },
    {
      id: 'FRD-003',
      type: 'token-manipulation',
      severity: 'medium',
      description: 'Unusual token transfer patterns detected',
      userId: 'USR-123',
      userName: 'Token Farmer',
      timestamp: '2024-01-14 20:45:18',
      aiConfidence: 76.4,
      status: 'resolved',
      actionsTaken: ['Tokens recovered', 'Account suspended', 'Warning issued']
    }
  ];

  // Mock campaign approvals
  const campaignApprovals: CampaignApproval[] = [
    {
      id: 'CMP-001',
      campaignName: 'Summer Authenticity Drive 2024',
      brandName: 'Global Beverages Inc.',
      brandId: 'BRD-001',
      type: 'verification',
      budgetRequested: 75000,
      tokenAllocation: 750000,
      duration: '3 months',
      targetAudience: 'Young adults 18-35',
      expectedReach: 150000,
      status: 'pending',
      submissionDate: '2024-01-14',
      description: 'Incentivize product verification during summer peak season',
      riskAssessment: 'low'
    },
    {
      id: 'CMP-002',
      campaignName: 'Eco-Friendly Recycling Challenge',
      brandName: 'Pacific Foods Corp.',
      brandId: 'BRD-002',
      type: 'recycling',
      budgetRequested: 50000,
      tokenAllocation: 500000,
      duration: '6 months',
      targetAudience: 'Environmentally conscious consumers',
      expectedReach: 80000,
      status: 'approved',
      submissionDate: '2024-01-10',
      description: 'Boost PET bottle recycling with bonus rewards',
      riskAssessment: 'low'
    }
  ];

  // Mock compliance records
  const complianceRecords: ComplianceRecord[] = [
    {
      id: 'CMP-001',
      type: 'gdpr-request',
      userId: 'USR-456',
      userName: 'EU Citizen User',
      requestDate: '2024-01-15',
      status: 'pending',
      region: 'EU',
      dataTypes: ['Personal Info', 'Transaction History', 'Scan Records'],
      complianceOfficer: 'Alice Johnson',
      notes: 'Right to be forgotten request'
    },
    {
      id: 'CMP-002',
      type: 'kyc-verification',
      userId: 'BRD-003',
      userName: 'New Beverage Brand Ltd.',
      requestDate: '2024-01-14',
      status: 'completed',
      region: 'US',
      dataTypes: ['Business Registration', 'Tax Documents', 'Identity Verification'],
      complianceOfficer: 'Bob Smith'
    }
  ];

  // Mock chart data
  const ecosystemGrowthData = [
    { month: 'Jul', users: 980000, brands: 980, recyclers: 180, scans: 38000000 },
    { month: 'Aug', users: 1050000, brands: 1050, recyclers: 195, scans: 40500000 },
    { month: 'Sep', users: 1120000, brands: 1120, recyclers: 210, scans: 42800000 },
    { month: 'Oct', users: 1180000, brands: 1180, recyclers: 225, scans: 44200000 },
    { month: 'Nov', users: 1220000, brands: 1220, recyclers: 235, scans: 45100000 },
    { month: 'Dec', users: 1254300, brands: 1250, recyclers: 245, scans: 45892000 }
  ];

  const tokenFlowData = [
    { time: '00:00', minted: 15000, burned: 8000, transferred: 45000 },
    { time: '04:00', minted: 12000, burned: 6000, transferred: 32000 },
    { time: '08:00', minted: 25000, burned: 15000, transferred: 78000 },
    { time: '12:00', minted: 35000, burned: 22000, transferred: 95000 },
    { time: '16:00', minted: 28000, burned: 18000, transferred: 85000 },
    { time: '20:00', minted: 20000, burned: 12000, transferred: 65000 }
  ];

  const fraudTrendsData = [
    { month: 'Jul', anomalies: 45, resolved: 38, falsePositives: 7 },
    { month: 'Aug', anomalies: 52, resolved: 45, falsePositives: 7 },
    { month: 'Sep', anomalies: 38, resolved: 35, falsePositives: 3 },
    { month: 'Oct', anomalies: 41, resolved: 39, falsePositives: 2 },
    { month: 'Nov', anomalies: 36, resolved: 34, falsePositives: 2 },
    { month: 'Dec', anomalies: 29, resolved: 27, falsePositives: 2 }
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
      case 'active': 
      case 'approved': 
      case 'completed': 
      case 'resolved': return 'text-green-600 bg-green-100';
      case 'pending': 
      case 'investigating': return 'text-blue-600 bg-blue-100';
      case 'flagged': 
      case 'rejected': 
      case 'failed': return 'text-red-600 bg-red-100';
      case 'suspended': return 'text-orange-600 bg-orange-100';
      case 'revision-required': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-3">
            <Crown className="w-8 h-8 text-yellow-500" />
            <div>
              <h1 className="text-3xl font-bold">Platform Owner Dashboard</h1>
              <p className="text-muted-foreground">
                Ecosystem oversight, token economy, and strategic platform management
              </p>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
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
            Platform Settings
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="system-overview">System Overview</TabsTrigger>
          <TabsTrigger value="user-management">User Management</TabsTrigger>
          <TabsTrigger value="token-economy">Token Economy</TabsTrigger>
          <TabsTrigger value="fraud-detection">Fraud Detection</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="system-overview" className="space-y-6">
          {/* Ecosystem Health Metrics */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Users className="w-8 h-8 text-blue-500" />
                  <div>
                    <div className="text-2xl font-bold">{(ecosystemStats.totalUsers / 1000000).toFixed(1)}M</div>
                    <div className="text-sm text-muted-foreground">Total Users</div>
                    <div className="text-xs text-green-600">
                      {((ecosystemStats.activeUsers / ecosystemStats.totalUsers) * 100).toFixed(1)}% active
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Building2 className="w-8 h-8 text-green-500" />
                  <div>
                    <div className="text-2xl font-bold">{ecosystemStats.totalBrands.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Brands Onboarded</div>
                    <div className="text-xs text-green-600">
                      {ecosystemStats.activeBrands} active
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-8 h-8 text-purple-500" />
                  <div>
                    <div className="text-2xl font-bold">{(ecosystemStats.totalScans / 1000000).toFixed(0)}M</div>
                    <div className="text-sm text-muted-foreground">Total Scans</div>
                    <div className="text-xs text-purple-600">All-time authentication</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Activity className="w-8 h-8 text-red-500" />
                  <div>
                    <div className="text-2xl font-bold">{ecosystemStats.systemUptime}%</div>
                    <div className="text-sm text-muted-foreground">System Uptime</div>
                    <div className="text-xs text-green-600">Last 30 days</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Token Circulation Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Coins className="w-5 h-5" />
                <span>Token Circulation & Burn Metrics</span>
              </CardTitle>
              <CardDescription>Real-time token economy health indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {(tokenEconomy.circulatingSupply / 1000000).toFixed(0)}M
                  </div>
                  <div className="text-sm text-muted-foreground">Circulating Supply</div>
                  <div className="text-xs text-muted-foreground">
                    {((tokenEconomy.circulatingSupply / tokenEconomy.totalSupply) * 100).toFixed(1)}% of total
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {(tokenEconomy.stakingPool / 1000000).toFixed(0)}M
                  </div>
                  <div className="text-sm text-muted-foreground">Staking Pool</div>
                  <div className="text-xs text-purple-600">
                    {((tokenEconomy.stakingPool / tokenEconomy.circulatingSupply) * 100).toFixed(1)}% staked
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {(tokenEconomy.burnedTokens / 1000000).toFixed(0)}M
                  </div>
                  <div className="text-sm text-muted-foreground">Burned Tokens</div>
                  <div className="text-xs text-red-600">Deflationary pressure</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{tokenEconomy.inflationRate}%</div>
                  <div className="text-sm text-muted-foreground">Inflation Rate</div>
                  <div className="text-xs text-green-600">Annual target: 3%</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ecosystem Growth Charts */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Ecosystem Growth Trends</CardTitle>
                <CardDescription>User acquisition, brand onboarding, and platform adoption</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    users: { label: 'Users (K)', color: '#3B82F6' },
                    brands: { label: 'Brands', color: '#10B981' },
                    recyclers: { label: 'Recyclers', color: '#F59E0B' }
                  }}
                  className="h-64"
                >
                  <LineChart data={ecosystemGrowthData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="users" stroke="var(--color-users)" strokeWidth={2} />
                    <Line type="monotone" dataKey="brands" stroke="var(--color-brands)" strokeWidth={2} />
                    <Line type="monotone" dataKey="recyclers" stroke="var(--color-recyclers)" strokeWidth={2} />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Global Platform Reach</CardTitle>
                <CardDescription>Regional distribution and market penetration</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{ecosystemStats.globalRegions}</div>
                    <div className="text-sm text-muted-foreground">Active Regions</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center text-sm">
                    <div>
                      <div className="font-semibold">{ecosystemStats.supportedCountries}</div>
                      <div className="text-muted-foreground">Countries</div>
                    </div>
                    <div>
                      <div className="font-semibold">{ecosystemStats.activeRecyclers}</div>
                      <div className="text-muted-foreground">Recycling Partners</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {[
                      { region: 'North America', percentage: 35 },
                      { region: 'Europe', percentage: 28 },
                      { region: 'Asia Pacific', percentage: 22 },
                      { region: 'Latin America', percentage: 10 },
                      { region: 'Others', percentage: 5 }
                    ].map((region) => (
                      <div key={region.region} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{region.region}</span>
                          <span>{region.percentage}%</span>
                        </div>
                        <Progress value={region.percentage} />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="user-management" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Role-Based Access Control</h2>
              <p className="text-muted-foreground">Manage user roles, permissions, and fraud detection</p>
            </div>
            <div className="flex space-x-3">
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="consumer">Consumers</SelectItem>
                  <SelectItem value="brand">Brands</SelectItem>
                  <SelectItem value="recycler">Recyclers</SelectItem>
                  <SelectItem value="admin">Administrators</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Users className="w-6 h-6 text-blue-500" />
                  <div>
                    <div className="text-xl font-bold">{(ecosystemStats.totalUsers / 1000).toFixed(0)}K</div>
                    <div className="text-sm text-muted-foreground">Total Users</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Flag className="w-6 h-6 text-red-500" />
                  <div>
                    <div className="text-xl font-bold">
                      {platformUsers.filter(u => u.status === 'flagged').length}
                    </div>
                    <div className="text-sm text-muted-foreground">Flagged Accounts</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <UserCheck className="w-6 h-6 text-green-500" />
                  <div>
                    <div className="text-xl font-bold">
                      {platformUsers.filter(u => u.kycStatus === 'verified').length}
                    </div>
                    <div className="text-sm text-muted-foreground">KYC Verified</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Lock className="w-6 h-6 text-orange-500" />
                  <div>
                    <div className="text-xl font-bold">
                      {platformUsers.filter(u => u.status === 'suspended').length}
                    </div>
                    <div className="text-sm text-muted-foreground">Suspended</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Platform Users</CardTitle>
              <CardDescription>Comprehensive user management with fraud detection indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>KYC Status</TableHead>
                    <TableHead>Activity Score</TableHead>
                    <TableHead>Tokens</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {platformUsers.map((user) => (
                    <TableRow key={user.id} className={user.status === 'flagged' ? 'bg-red-50' : ''}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                            <div className="text-xs text-muted-foreground">{user.id}</div>
                          </div>
                          {user.status === 'flagged' && <Flag className="w-4 h-4 text-red-500" />}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{user.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                          {user.status.toUpperCase()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.kycStatus === 'verified' ? 'text-green-600 bg-green-100' :
                          user.kycStatus === 'pending' ? 'text-yellow-600 bg-yellow-100' :
                          user.kycStatus === 'rejected' ? 'text-red-600 bg-red-100' : 'text-gray-600 bg-gray-100'
                        }`}>
                          {user.kycStatus.toUpperCase()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span className={`font-semibold ${
                            user.activityScore >= 80 ? 'text-green-600' :
                            user.activityScore >= 50 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {user.activityScore}%
                          </span>
                          {user.activityScore < 30 && <AlertTriangle className="w-4 h-4 text-red-500" />}
                        </div>
                      </TableCell>
                      <TableCell>{user.tokensEarned.toLocaleString()}</TableCell>
                      <TableCell className="text-sm">{user.lastActive}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          {user.status === 'flagged' && (
                            <Button variant="outline" size="sm">
                              <Lock className="w-4 h-4" />
                            </Button>
                          )}
                          {user.ipfsHash && (
                            <Button variant="outline" size="sm">
                              <ExternalLink className="w-4 h-4" />
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

        <TabsContent value="token-economy" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Token Economy Control</h2>
              <p className="text-muted-foreground">Dynamic reward rates, inflation monitoring, and liquidity management</p>
            </div>
            <Button>
              <Target className="w-4 h-4 mr-2" />
              Adjust Reward Rates
            </Button>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Coins className="w-6 h-6 text-yellow-500" />
                  <div>
                    <div className="text-xl font-bold">{tokenEconomy.inflationRate}%</div>
                    <div className="text-sm text-muted-foreground">Inflation Rate</div>
                    <div className="text-xs text-green-600">Target: 3.0%</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-6 h-6 text-blue-500" />
                  <div>
                    <div className="text-xl font-bold">{(tokenEconomy.transactionVolume / 1000000).toFixed(1)}M</div>
                    <div className="text-sm text-muted-foreground">Daily Volume</div>
                    <div className="text-xs text-blue-600">24h transactions</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-6 h-6 text-green-500" />
                  <div>
                    <div className="text-xl font-bold">${tokenEconomy.averageTransactionSize}</div>
                    <div className="text-sm text-muted-foreground">Avg Transaction</div>
                    <div className="text-xs text-green-600">USD equivalent</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Database className="w-6 h-6 text-purple-500" />
                  <div>
                    <div className="text-xl font-bold">{(tokenEconomy.liquidityPools / 1000000).toFixed(0)}M</div>
                    <div className="text-sm text-muted-foreground">Liquidity Pools</div>
                    <div className="text-xs text-purple-600">Total locked value</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Real-Time Token Flow</CardTitle>
              <CardDescription>Monitor minting, burning, and transfer activity</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  minted: { label: 'Minted', color: '#10B981' },
                  burned: { label: 'Burned', color: '#EF4444' },
                  transferred: { label: 'Transferred', color: '#3B82F6' }
                }}
                className="h-64"
              >
                <AreaChart data={tokenFlowData}>
                  <XAxis dataKey="time" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area type="monotone" dataKey="minted" stackId="1" stroke="var(--color-minted)" fill="var(--color-minted)" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="burned" stackId="2" stroke="var(--color-burned)" fill="var(--color-burned)" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="transferred" stackId="3" stroke="var(--color-transferred)" fill="var(--color-transferred)" fillOpacity={0.6} />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fraud-detection" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">AI-Powered Fraud Detection Center</h2>
              <p className="text-muted-foreground">Anomaly detection, pattern analysis, and counterfeit evidence storage</p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">
                <Brain className="w-4 h-4 mr-2" />
                AI Model Status
              </Button>
              <Button>
                <Bot className="w-4 h-4 mr-2" />
                Train Model
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                  <div>
                    <div className="text-xl font-bold">{fraudAlerts.filter(a => a.status === 'open').length}</div>
                    <div className="text-sm text-muted-foreground">Open Alerts</div>
                    <div className="text-xs text-red-600">Requires attention</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Brain className="w-6 h-6 text-purple-500" />
                  <div>
                    <div className="text-xl font-bold">89.3%</div>
                    <div className="text-sm text-muted-foreground">AI Accuracy</div>
                    <div className="text-xs text-purple-600">Last 30 days</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Fingerprint className="w-6 h-6 text-blue-500" />
                  <div>
                    <div className="text-xl font-bold">
                      {fraudAlerts.filter(a => a.ipfsHash).length}
                    </div>
                    <div className="text-sm text-muted-foreground">IPFS Records</div>
                    <div className="text-xs text-blue-600">Evidence stored</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <div>
                    <div className="text-xl font-bold">
                      {fraudAlerts.filter(a => a.status === 'resolved').length}
                    </div>
                    <div className="text-sm text-muted-foreground">Resolved Cases</div>
                    <div className="text-xs text-green-600">This month</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Fraud Detection Alerts</span>
              </CardTitle>
              <CardDescription>AI-powered anomaly detection with IPFS evidence storage</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Alert Type</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>AI Confidence</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Evidence</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fraudAlerts.map((alert) => (
                    <TableRow key={alert.id}>
                      <TableCell>
                        <Badge variant="outline">{alert.type.replace('-', ' ')}</Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{alert.userName}</div>
                          <div className="text-sm text-muted-foreground">{alert.userId}</div>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="text-sm">{alert.description}</div>
                        <div className="text-xs text-muted-foreground">{alert.timestamp}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className={`text-sm font-semibold ${
                            alert.aiConfidence >= 90 ? 'text-red-600' :
                            alert.aiConfidence >= 75 ? 'text-orange-600' :
                            alert.aiConfidence >= 60 ? 'text-yellow-600' : 'text-green-600'
                          }`}>
                            {alert.aiConfidence}%
                          </div>
                          <Brain className="w-4 h-4 text-purple-500" />
                        </div>
                      </TableCell>
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
                        {alert.ipfsHash ? (
                          <Button variant="outline" size="sm">
                            <ExternalLink className="w-4 h-4 mr-1" />
                            IPFS
                          </Button>
                        ) : (
                          <span className="text-xs text-muted-foreground">None</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Lock className="w-4 h-4" />
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
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Campaign & Partnership Management</h2>
              <p className="text-muted-foreground">Approve brand campaigns and manage token sponsorships</p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filter Campaigns
              </Button>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Campaign
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Target className="w-6 h-6 text-blue-500" />
                  <div>
                    <div className="text-xl font-bold">
                      {campaignApprovals.filter(c => c.status === 'pending').length}
                    </div>
                    <div className="text-sm text-muted-foreground">Pending Approval</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <div>
                    <div className="text-xl font-bold">
                      {campaignApprovals.filter(c => c.status === 'approved').length}
                    </div>
                    <div className="text-sm text-muted-foreground">Approved</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-6 h-6 text-purple-500" />
                  <div>
                    <div className="text-xl font-bold">
                      ${campaignApprovals.reduce((sum, c) => sum + c.budgetRequested, 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Budget</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Coins className="w-6 h-6 text-yellow-500" />
                  <div>
                    <div className="text-xl font-bold">
                      {(campaignApprovals.reduce((sum, c) => sum + c.tokenAllocation, 0) / 1000000).toFixed(1)}M
                    </div>
                    <div className="text-sm text-muted-foreground">Token Allocation</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Campaign Approval Queue</CardTitle>
              <CardDescription>Review and approve brand campaign requests</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Brand</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Token Allocation</TableHead>
                    <TableHead>Risk Assessment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaignApprovals.map((campaign) => (
                    <TableRow key={campaign.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{campaign.campaignName}</div>
                          <div className="text-sm text-muted-foreground">
                            {campaign.duration} • {campaign.expectedReach.toLocaleString()} reach
                          </div>
                          <div className="text-xs text-muted-foreground">{campaign.submissionDate}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{campaign.brandName}</div>
                        <div className="text-sm text-muted-foreground">{campaign.brandId}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{campaign.type}</Badge>
                      </TableCell>
                      <TableCell className="font-semibold">${campaign.budgetRequested.toLocaleString()}</TableCell>
                      <TableCell className="font-semibold text-purple-600">
                        {campaign.tokenAllocation.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          campaign.riskAssessment === 'low' ? 'text-green-600 bg-green-100' :
                          campaign.riskAssessment === 'medium' ? 'text-yellow-600 bg-yellow-100' :
                          'text-red-600 bg-red-100'
                        }`}>
                          {campaign.riskAssessment.toUpperCase()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                          {campaign.status.replace('-', ' ').toUpperCase()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          {campaign.status === 'pending' && (
                            <>
                              <Button variant="outline" size="sm">
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <XCircle className="w-4 h-4" />
                              </Button>
                            </>
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

        <TabsContent value="compliance" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Compliance & Legal Management</h2>
              <p className="text-muted-foreground">GDPR/KYC verification and exportable compliance reports</p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
              <Button>
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Scale className="w-6 h-6 text-blue-500" />
                  <div>
                    <div className="text-xl font-bold">
                      {complianceRecords.filter(r => r.status === 'pending').length}
                    </div>
                    <div className="text-sm text-muted-foreground">Pending Requests</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <UserCheck className="w-6 h-6 text-green-500" />
                  <div>
                    <div className="text-xl font-bold">94.8%</div>
                    <div className="text-sm text-muted-foreground">KYC Completion</div>
                    <div className="text-xs text-green-600">Above target</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Globe className="w-6 h-6 text-purple-500" />
                  <div>
                    <div className="text-xl font-bold">28</div>
                    <div className="text-sm text-muted-foreground">GDPR Requests</div>
                    <div className="text-xs text-purple-600">This month</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <FileText className="w-6 h-6 text-orange-500" />
                  <div>
                    <div className="text-xl font-bold">15</div>
                    <div className="text-sm text-muted-foreground">Audit Reports</div>
                    <div className="text-xs text-orange-600">Generated</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Compliance Requests</CardTitle>
              <CardDescription>GDPR data requests, KYC verifications, and audit logs</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request Type</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead>Data Types</TableHead>
                    <TableHead>Officer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {complianceRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        <Badge variant="outline">{record.type.replace('-', ' ')}</Badge>
                      </TableCell>
                      <TableCell>
                        {record.userName ? (
                          <div>
                            <div className="font-medium">{record.userName}</div>
                            <div className="text-sm text-muted-foreground">{record.userId}</div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">System</span>
                        )}
                      </TableCell>
                      <TableCell>{record.region}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {record.dataTypes.join(', ')}
                        </div>
                      </TableCell>
                      <TableCell>{record.complianceOfficer}</TableCell>
                      <TableCell className="text-sm">{record.requestDate}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                          {record.status.toUpperCase()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
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
      </Tabs>
    </div>
  );
}