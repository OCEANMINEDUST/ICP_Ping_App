import React, { useState } from 'react';
import { Shield, AlertTriangle, Building, FileText, TrendingDown, Globe, Eye, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription } from './ui/alert';

interface ComplianceReport {
  companyId: string;
  companyName: string;
  industry: string;
  productsMonitored: number;
  counterfeitRate: number;
  complianceScore: number;
  lastReported: string;
  status: 'compliant' | 'warning' | 'violation';
}

interface Investigation {
  id: string;
  title: string;
  company: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  reportedDate: string;
  estimatedLoss: number;
  affectedRegions: string[];
}

export function RegulatoryPanel() {
  const [selectedRegion, setSelectedRegion] = useState('global');
  const [selectedIndustry, setSelectedIndustry] = useState('all');

  // Mock regulatory data
  const regulatoryStats = {
    totalCompanies: 1250,
    compliantCompanies: 1180,
    activeInvestigations: 15,
    counterfeitReports: 3420,
    economicImpact: 45.6, // Million USD
    publicSafetyIncidents: 8
  };

  // Mock compliance reports
  const complianceReports: ComplianceReport[] = [
    {
      companyId: 'COMP-001',
      companyName: 'Global Beverages Inc.',
      industry: 'Food & Beverage',
      productsMonitored: 1250000,
      counterfeitRate: 0.12,
      complianceScore: 98.5,
      lastReported: '2024-01-15',
      status: 'compliant'
    },
    {
      companyId: 'COMP-002',
      companyName: 'Pacific Foods Corp.',
      industry: 'Food & Beverage',
      productsMonitored: 850000,
      counterfeitRate: 2.8,
      complianceScore: 75.2,
      lastReported: '2024-01-12',
      status: 'warning'
    },
    {
      companyId: 'COMP-003',
      companyName: 'MegaDrink Ltd.',
      industry: 'Beverages',
      productsMonitored: 2100000,
      counterfeitRate: 5.4,
      complianceScore: 62.1,
      lastReported: '2024-01-08',
      status: 'violation'
    }
  ];

  // Mock investigations
  const investigations: Investigation[] = [
    {
      id: 'INV-001',
      title: 'Large-scale counterfeit operation in Southeast Asia',
      company: 'MegaDrink Ltd.',
      severity: 'critical',
      status: 'investigating',
      reportedDate: '2024-01-10',
      estimatedLoss: 12.5,
      affectedRegions: ['Thailand', 'Vietnam', 'Philippines']
    },
    {
      id: 'INV-002',
      title: 'Contaminated counterfeit baby formula',
      company: 'Nutrition Plus Inc.',
      severity: 'critical',
      status: 'open',
      reportedDate: '2024-01-12',
      estimatedLoss: 8.2,
      affectedRegions: ['India', 'Bangladesh']
    },
    {
      id: 'INV-003',
      title: 'Fake luxury water brand distribution',
      company: 'Premium Waters SA',
      severity: 'medium',
      status: 'resolved',
      reportedDate: '2024-01-05',
      estimatedLoss: 2.1,
      affectedRegions: ['France', 'Italy', 'Spain']
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
      case 'compliant': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'violation': return 'text-red-600 bg-red-100';
      case 'open': return 'text-blue-600 bg-blue-100';
      case 'investigating': return 'text-orange-600 bg-orange-100';
      case 'resolved': return 'text-green-600 bg-green-100';
      case 'closed': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Regulatory Oversight Panel</h1>
          <p className="text-muted-foreground">
            Monitor compliance, investigate counterfeits, and protect public safety
          </p>
        </div>
        <div className="flex space-x-2">
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="global">Global</SelectItem>
              <SelectItem value="north-america">North America</SelectItem>
              <SelectItem value="europe">Europe</SelectItem>
              <SelectItem value="asia-pacific">Asia Pacific</SelectItem>
              <SelectItem value="latin-america">Latin America</SelectItem>
              <SelectItem value="africa">Africa</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Critical Alerts */}
      <div className="space-y-3">
        {investigations.filter(inv => inv.severity === 'critical' && inv.status !== 'closed').map((investigation) => (
          <Alert key={investigation.id} variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Critical Investigation:</strong> {investigation.title} affecting {investigation.affectedRegions.join(', ')}. 
              Estimated loss: ${investigation.estimatedLoss}M. <Button variant="link" className="p-0 h-auto text-destructive underline">Take Action</Button>
            </AlertDescription>
          </Alert>
        ))}
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="investigations">Investigations</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="public-safety">Public Safety</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Building className="w-8 h-8 text-blue-500" />
                  <div>
                    <div className="text-2xl font-bold">{regulatoryStats.totalCompanies}</div>
                    <div className="text-sm text-muted-foreground">Monitored Companies</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Shield className="w-8 h-8 text-green-500" />
                  <div>
                    <div className="text-2xl font-bold">{regulatoryStats.compliantCompanies}</div>
                    <div className="text-sm text-muted-foreground">Compliant</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Eye className="w-8 h-8 text-orange-500" />
                  <div>
                    <div className="text-2xl font-bold">{regulatoryStats.activeInvestigations}</div>
                    <div className="text-sm text-muted-foreground">Active Cases</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                  <div>
                    <div className="text-2xl font-bold">{regulatoryStats.counterfeitReports}</div>
                    <div className="text-sm text-muted-foreground">Reports Filed</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <TrendingDown className="w-8 h-8 text-purple-500" />
                  <div>
                    <div className="text-2xl font-bold">${regulatoryStats.economicImpact}M</div>
                    <div className="text-sm text-muted-foreground">Economic Impact</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-600">⚠️</span>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{regulatoryStats.publicSafetyIncidents}</div>
                    <div className="text-sm text-muted-foreground">Safety Incidents</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Compliance Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Compliance Overview</CardTitle>
              <CardDescription>
                Overall industry compliance with anti-counterfeiting regulations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center space-y-2">
                  <div className="text-4xl font-bold text-green-600">94.4%</div>
                  <div className="text-sm text-muted-foreground">Overall Compliance Rate</div>
                  <Badge variant="default">+2.1% from last month</Badge>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-4xl font-bold text-orange-600">5.6%</div>
                  <div className="text-sm text-muted-foreground">Companies Under Review</div>
                  <Badge variant="secondary">70 companies</Badge>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-4xl font-bold text-red-600">0.8%</div>
                  <div className="text-sm text-muted-foreground">Non-Compliant</div>
                  <Badge variant="destructive">10 companies</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent High Priority Cases */}
          <Card>
            <CardHeader>
              <CardTitle>High Priority Investigations</CardTitle>
              <CardDescription>Cases requiring immediate regulatory attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {investigations.filter(inv => inv.severity === 'critical' || inv.severity === 'high').slice(0, 3).map((investigation) => (
                  <div key={investigation.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        investigation.severity === 'critical' ? 'bg-red-100' : 'bg-orange-100'
                      }`}>
                        <AlertTriangle className={`w-6 h-6 ${
                          investigation.severity === 'critical' ? 'text-red-600' : 'text-orange-600'
                        }`} />
                      </div>
                      <div>
                        <div className="font-medium">{investigation.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {investigation.company} • {investigation.affectedRegions.join(', ')}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Reported: {investigation.reportedDate} • Loss: ${investigation.estimatedLoss}M
                        </div>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(investigation.severity)}`}>
                        {investigation.severity.toUpperCase()}
                      </span>
                      <div className="text-xs text-muted-foreground">
                        {investigation.status.replace('-', ' ').toUpperCase()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                View All Investigations
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Company Compliance Status</CardTitle>
              <CardDescription>
                Monitor regulatory compliance across all registered companies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Industries</SelectItem>
                    <SelectItem value="food-beverage">Food & Beverage</SelectItem>
                    <SelectItem value="pharmaceuticals">Pharmaceuticals</SelectItem>
                    <SelectItem value="cosmetics">Cosmetics</SelectItem>
                    <SelectItem value="electronics">Electronics</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Industry</TableHead>
                    <TableHead>Products Monitored</TableHead>
                    <TableHead>Counterfeit Rate</TableHead>
                    <TableHead>Compliance Score</TableHead>
                    <TableHead>Last Report</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {complianceReports.map((report) => (
                    <TableRow key={report.companyId}>
                      <TableCell className="font-medium">{report.companyName}</TableCell>
                      <TableCell>{report.industry}</TableCell>
                      <TableCell>{report.productsMonitored.toLocaleString()}</TableCell>
                      <TableCell className={`${report.counterfeitRate > 2 ? 'text-red-600' : 'text-green-600'}`}>
                        {report.counterfeitRate}%
                      </TableCell>
                      <TableCell>
                        <span className={`font-semibold ${
                          report.complianceScore >= 90 ? 'text-green-600' :
                          report.complianceScore >= 70 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {report.complianceScore}%
                        </span>
                      </TableCell>
                      <TableCell>{report.lastReported}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                          {report.status.toUpperCase()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          Review
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="investigations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Investigations</CardTitle>
              <CardDescription>
                Ongoing counterfeit and compliance investigations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {investigations.map((investigation) => (
                  <div key={investigation.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <AlertTriangle className={`w-5 h-5 ${
                          investigation.severity === 'critical' ? 'text-red-500' :
                          investigation.severity === 'high' ? 'text-orange-500' :
                          investigation.severity === 'medium' ? 'text-yellow-500' : 'text-green-500'
                        }`} />
                        <div>
                          <div className="font-semibold">{investigation.title}</div>
                          <div className="text-sm text-muted-foreground">
                            Target: {investigation.company}
                          </div>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(investigation.severity)}`}>
                          {investigation.severity.toUpperCase()}
                        </span>
                        <div className="text-xs text-muted-foreground">
                          ID: {investigation.id}
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-4 gap-4 text-sm mb-4">
                      <div>
                        <span className="text-muted-foreground">Status:</span>
                        <span className={`ml-2 px-2 py-1 rounded text-xs ${getStatusColor(investigation.status)}`}>
                          {investigation.status.replace('-', ' ').toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Reported:</span>
                        <span className="ml-2 font-medium">{investigation.reportedDate}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Est. Loss:</span>
                        <span className="ml-2 font-medium">${investigation.estimatedLoss}M</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Regions:</span>
                        <span className="ml-2 font-medium">{investigation.affectedRegions.length}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {investigation.affectedRegions.map((region, index) => (
                        <Badge key={index} variant="secondary">
                          {region}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm">View Details</Button>
                      <Button variant="outline" size="sm">Update Status</Button>
                      <Button variant="outline" size="sm">Contact Company</Button>
                      {investigation.severity === 'critical' && (
                        <Button variant="destructive" size="sm">Emergency Action</Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Compliance Report</CardTitle>
                <CardDescription>Generate comprehensive compliance reports</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Companies Monitored:</span>
                    <span className="font-semibold">{regulatoryStats.totalCompanies}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Compliance Rate:</span>
                    <span className="font-semibold text-green-600">94.4%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Violations Identified:</span>
                    <span className="font-semibold text-red-600">10</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fines Issued:</span>
                    <span className="font-semibold">$2.3M</span>
                  </div>
                </div>
                <Button className="w-full">
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Industry Analysis</CardTitle>
                <CardDescription>Sector-specific counterfeit trends</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Most Targeted Sector:</span>
                    <span className="font-semibold">Food & Beverage</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Highest Risk Products:</span>
                    <span className="font-semibold">Premium Waters</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Detection Time:</span>
                    <span className="font-semibold">2.3 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Recovery Rate:</span>
                    <span className="font-semibold text-green-600">87.2%</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  <Globe className="w-4 h-4 mr-2" />
                  View Full Analysis
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Regulatory Actions Taken</CardTitle>
              <CardDescription>Recent enforcement activities and outcomes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">23</div>
                  <div className="text-sm text-muted-foreground">Warnings Issued</div>
                  <div className="text-xs text-muted-foreground mt-1">This month</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">7</div>
                  <div className="text-sm text-muted-foreground">Fines Imposed</div>
                  <div className="text-xs text-muted-foreground mt-1">Total: $2.3M</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-red-600">2</div>
                  <div className="text-sm text-muted-foreground">Licenses Suspended</div>
                  <div className="text-xs text-muted-foreground mt-1">Under review</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="public-safety" className="space-y-6">
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-red-700">
                <AlertTriangle className="w-5 h-5" />
                <span>Public Safety Alerts</span>
              </CardTitle>
              <CardDescription className="text-red-600">
                Active safety incidents requiring immediate public attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-4 border border-red-200 rounded-lg bg-white">
                  <div className="font-semibold text-red-700">Critical: Contaminated Baby Formula</div>
                  <div className="text-sm text-red-600 mt-1">
                    Counterfeit baby formula containing harmful chemicals detected in 3 countries. 
                    Immediate recall and public warning issued.
                  </div>
                  <div className="mt-2">
                    <Button size="sm" variant="destructive">Issue Emergency Alert</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Safety Impact Assessment</CardTitle>
              <CardDescription>
                Health and safety implications of counterfeit products
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{regulatoryStats.publicSafetyIncidents}</div>
                  <div className="text-sm text-muted-foreground">Safety Incidents</div>
                  <div className="text-xs text-muted-foreground mt-1">This quarter</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">156</div>
                  <div className="text-sm text-muted-foreground">Health Complaints</div>
                  <div className="text-xs text-muted-foreground mt-1">Reported</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">12</div>
                  <div className="text-sm text-muted-foreground">Product Recalls</div>
                  <div className="text-xs text-muted-foreground mt-1">Initiated</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">98.7%</div>
                  <div className="text-sm text-muted-foreground">Resolution Rate</div>
                  <div className="text-xs text-muted-foreground mt-1">Within 48 hours</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}