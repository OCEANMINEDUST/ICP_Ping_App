import React, { useState, useEffect } from 'react';
import { Globe, TrendingUp, Award, Leaf, MapPin, Users, Factory, Recycle, BarChart3, Eye, Clock, Calendar, TreePine, Zap, Star, Trophy, Target, Activity, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Progress } from './ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from './ui/chart';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';

interface LiveCounter {
  label: string;
  value: number;
  change: number;
  icon: React.ElementType;
  color: string;
  unit: string;
  target?: number;
}

interface LeaderboardEntry {
  rank: number;
  name: string;
  location: string;
  type: 'recycler' | 'verifier';
  score: number;
  bottles?: number;
  authentications?: number;
  co2Saved: number;
  isTopPerformer: boolean;
}

interface BrandSustainability {
  rank: number;
  brandName: string;
  industry: string;
  participationScore: number;
  productsAuthenticated: number;
  recyclingSupported: number;
  co2Impact: number;
  sustainabilityGrade: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C';
  impactTrend: 'up' | 'down' | 'stable';
}

interface RegionData {
  region: string;
  country: string;
  verificationPoints: number;
  recyclingPoints: number;
  totalImpact: number;
  coordinates: { lat: number; lng: number };
  isActive: boolean;
}

export function PublicDashboard() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [selectedRegion, setSelectedRegion] = useState('global');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second for live feeling
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Mock live counters with animated values
  const liveCounters: LiveCounter[] = [
    {
      label: 'Products Authenticated Today',
      value: 47892,
      change: 12.3,
      icon: Eye,
      color: 'blue',
      unit: '',
      target: 50000
    },
    {
      label: 'PET Bottles Recycled This Week',
      value: 234567,
      change: 8.7,
      icon: Recycle,
      color: 'green',
      unit: '',
      target: 250000
    },
    {
      label: 'CO₂ Saved This Month',
      value: 15.8,
      change: 15.2,
      icon: TreePine,
      color: 'emerald',
      unit: 'tons',
      target: 20
    },
    {
      label: 'Active Users Globally',
      value: 1254300,
      change: 5.4,
      icon: Users,
      color: 'purple',
      unit: '',
      target: 1500000
    }
  ];

  // Mock impact map data
  const regionData: RegionData[] = [
    {
      region: 'North America',
      country: 'United States',
      verificationPoints: 1250,
      recyclingPoints: 890,
      totalImpact: 2140,
      coordinates: { lat: 40.7128, lng: -74.0060 },
      isActive: true
    },
    {
      region: 'Europe',
      country: 'Germany',
      verificationPoints: 980,
      recyclingPoints: 1120,
      totalImpact: 2100,
      coordinates: { lat: 52.5200, lng: 13.4050 },
      isActive: true
    },
    {
      region: 'Asia Pacific',
      country: 'Japan',
      verificationPoints: 1450,
      recyclingPoints: 780,
      totalImpact: 2230,
      coordinates: { lat: 35.6762, lng: 139.6503 },
      isActive: true
    },
    {
      region: 'Latin America',
      country: 'Brazil',
      verificationPoints: 650,
      recyclingPoints: 890,
      totalImpact: 1540,
      coordinates: { lat: -23.5505, lng: -46.6333 },
      isActive: true
    },
    {
      region: 'Africa',
      country: 'South Africa',
      verificationPoints: 280,
      recyclingPoints: 340,
      totalImpact: 620,
      coordinates: { lat: -33.9249, lng: 18.4241 },
      isActive: false
    }
  ];

  // Mock leaderboard data
  const leaderboardData: LeaderboardEntry[] = [
    {
      rank: 1,
      name: 'GreenCycle Tokyo',
      location: 'Tokyo, Japan',
      type: 'recycler',
      score: 98500,
      bottles: 45000,
      co2Saved: 12.5,
      isTopPerformer: true
    },
    {
      rank: 2,
      name: 'EcoVerify Berlin',
      location: 'Berlin, Germany',
      type: 'verifier',
      score: 92300,
      authentications: 78000,
      co2Saved: 8.9,
      isTopPerformer: true
    },
    {
      rank: 3,
      name: 'RecyclePro NYC',
      location: 'New York, USA',
      type: 'recycler',
      score: 87600,
      bottles: 38900,
      co2Saved: 10.2,
      isTopPerformer: true
    },
    {
      rank: 4,
      name: 'AuthGuard London',
      location: 'London, UK',
      type: 'verifier',
      score: 84200,
      authentications: 65400,
      co2Saved: 7.8,
      isTopPerformer: false
    },
    {
      rank: 5,
      name: 'São Paulo Recicla',
      location: 'São Paulo, Brazil',
      type: 'recycler',
      score: 79800,
      bottles: 35600,
      co2Saved: 9.1,
      isTopPerformer: false
    },
    {
      rank: 6,
      name: 'Singapore Verify',
      location: 'Singapore',
      type: 'verifier',
      score: 76300,
      authentications: 58900,
      co2Saved: 6.7,
      isTopPerformer: false
    }
  ];

  // Mock brand sustainability data
  const brandSustainabilityData: BrandSustainability[] = [
    {
      rank: 1,
      brandName: 'EcoGlobal Beverages',
      industry: 'Beverages',
      participationScore: 95,
      productsAuthenticated: 2345000,
      recyclingSupported: 1890000,
      co2Impact: 45.2,
      sustainabilityGrade: 'A+',
      impactTrend: 'up'
    },
    {
      rank: 2,
      brandName: 'GreenTech Foods',
      industry: 'Food & Snacks',
      participationScore: 89,
      productsAuthenticated: 1890000,
      recyclingSupported: 1560000,
      co2Impact: 38.7,
      sustainabilityGrade: 'A',
      impactTrend: 'up'
    },
    {
      rank: 3,
      brandName: 'Sustainable Solutions Inc.',
      industry: 'Household Products',
      participationScore: 85,
      productsAuthenticated: 1670000,
      recyclingSupported: 1340000,
      co2Impact: 32.1,
      sustainabilityGrade: 'A',
      impactTrend: 'stable'
    },
    {
      rank: 4,
      brandName: 'Nature\'s Choice',
      industry: 'Personal Care',
      participationScore: 78,
      productsAuthenticated: 1340000,
      recyclingSupported: 1120000,
      co2Impact: 28.4,
      sustainabilityGrade: 'B+',
      impactTrend: 'up'
    },
    {
      rank: 5,
      brandName: 'FreshMarket Corp.',
      industry: 'Beverages',
      participationScore: 72,
      productsAuthenticated: 1190000,
      recyclingSupported: 890000,
      co2Impact: 23.8,
      sustainabilityGrade: 'B+',
      impactTrend: 'stable'
    },
    {
      rank: 6,
      brandName: 'CleanLife Products',
      industry: 'Household Products',
      participationScore: 68,
      productsAuthenticated: 980000,
      recyclingSupported: 780000,
      co2Impact: 19.2,
      sustainabilityGrade: 'B',
      impactTrend: 'down'
    }
  ];

  // Mock chart data
  const impactTrendsData = [
    { month: 'Jan', authentications: 850000, recycling: 680000, co2Saved: 18.2 },
    { month: 'Feb', authentications: 920000, recycling: 740000, co2Saved: 19.8 },
    { month: 'Mar', authentications: 1050000, recycling: 820000, co2Saved: 22.1 },
    { month: 'Apr', authentications: 1180000, recycling: 890000, co2Saved: 24.5 },
    { month: 'May', authentications: 1320000, recycling: 950000, co2Saved: 26.8 },
    { month: 'Jun', authentications: 1450000, recycling: 1020000, co2Saved: 29.3 },
    { month: 'Jul', authentications: 1590000, recycling: 1150000, co2Saved: 31.7 }
  ];

  const regionalImpactData = [
    { region: 'North America', impact: 2140, percentage: 32 },
    { region: 'Europe', impact: 2100, percentage: 31 },
    { region: 'Asia Pacific', impact: 2230, percentage: 33 },
    { region: 'Latin America', impact: 1540, percentage: 23 },
    { region: 'Africa', impact: 620, percentage: 9 }
  ];

  const getSustainabilityGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+': return 'text-green-600 bg-green-100';
      case 'A': return 'text-green-600 bg-green-100';
      case 'B+': return 'text-blue-600 bg-blue-100';
      case 'B': return 'text-blue-600 bg-blue-100';
      case 'C+': return 'text-yellow-600 bg-yellow-100';
      case 'C': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '↗️';
      case 'down': return '↘️';
      case 'stable': return '➡️';
      default: return '➡️';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-3">
            <Globe className="w-8 h-8 text-blue-500" />
            <div>
              <h1 className="text-3xl font-bold">Public Transparency Dashboard</h1>
              <p className="text-muted-foreground">
                Real-time public data showing our collective impact on sustainability and authenticity
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <div className="text-sm font-medium">Live Data</div>
            <div className="text-xs text-muted-foreground">
              {currentTime.toLocaleTimeString()} UTC
            </div>
          </div>
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Live Counters */}
      <div className="grid md:grid-cols-4 gap-4">
        {liveCounters.map((counter) => (
          <Card key={counter.label} className="relative overflow-hidden">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-${counter.color}-100`}>
                  <counter.icon className={`w-6 h-6 text-${counter.color}-600`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <div className="text-2xl font-bold">
                      {counter.value.toLocaleString()}
                      {counter.unit && <span className="text-sm text-muted-foreground ml-1">{counter.unit}</span>}
                    </div>
                    <div className={`text-sm font-medium ${counter.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {counter.change >= 0 ? '+' : ''}{counter.change}%
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">{counter.label}</div>
                  {counter.target && (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Progress to Target</span>
                        <span>{((counter.value / counter.target) * 100).toFixed(0)}%</span>
                      </div>
                      <Progress value={(counter.value / counter.target) * 100} className="h-1" />
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-${counter.color}-500/10 to-transparent`}></div>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="impact-map" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="impact-map">Global Impact Map</TabsTrigger>
          <TabsTrigger value="leaderboard">Community Leaders</TabsTrigger>
          <TabsTrigger value="brand-scores">Brand Sustainability</TabsTrigger>
          <TabsTrigger value="trends">Impact Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="impact-map" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <span>Global Impact Map</span>
              </CardTitle>
              <CardDescription>Real-time view of verified products and recycling points worldwide</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Mock Global Map */}
              <div className="h-96 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <Globe className="w-16 h-16 text-blue-400 mx-auto animate-pulse" />
                    <p className="text-lg font-medium text-blue-600">Interactive Global Impact Map</p>
                    <p className="text-sm text-muted-foreground">
                      Showing {regionData.length} active regions with real-time data
                    </p>
                  </div>
                </div>
                
                {/* Mock impact points */}
                {regionData.map((region, index) => (
                  <div 
                    key={region.region}
                    className={`absolute w-8 h-8 rounded-full cursor-pointer flex items-center justify-center text-white text-xs font-bold animate-pulse ${
                      region.isActive ? 'bg-green-500' : 'bg-gray-400'
                    }`}
                    style={{
                      left: `${20 + index * 15}%`,
                      top: `${30 + index * 12}%`
                    }}
                    title={`${region.region}: ${region.totalImpact} total impact points`}
                  >
                    {region.totalImpact > 2000 ? '🟢' : region.totalImpact > 1000 ? '🟡' : '🔴'}
                  </div>
                ))}

                {/* Legend */}
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3">
                  <h3 className="font-medium text-sm mb-2">Impact Levels</h3>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center space-x-2">
                      <span>🟢</span>
                      <span>High Impact (2000+ points)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span>🟡</span>
                      <span>Medium Impact (1000+ points)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span>🔴</span>
                      <span>Growing Impact (&lt;1000 points)</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Regional Summary Cards */}
          <div className="grid md:grid-cols-3 gap-4">
            {regionData.slice(0, 3).map((region) => (
              <Card key={region.region} className={`${region.isActive ? 'border-green-200' : 'border-gray-200'}`}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{region.region}</h3>
                      <p className="text-sm text-muted-foreground">{region.country}</p>
                    </div>
                    {region.isActive && <Badge className="bg-green-100 text-green-800">Active</Badge>}
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-blue-600">{region.verificationPoints}</div>
                      <div className="text-muted-foreground">Verification Points</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-green-600">{region.recyclingPoints}</div>
                      <div className="text-muted-foreground">Recycling Points</div>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Impact</span>
                      <span className="font-semibold text-purple-600">{region.totalImpact}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="w-5 h-5" />
                <span>Community Leaderboard</span>
              </CardTitle>
              <CardDescription>Top recyclers and verifiers making the biggest impact globally</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaderboardData.map((entry) => (
                  <div 
                    key={entry.rank} 
                    className={`p-4 rounded-lg border ${
                      entry.rank <= 3 ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200' : 'bg-card'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-center min-w-[60px]">
                          <div className="text-2xl font-bold text-yellow-600">
                            {entry.rank <= 3 ? ['🥇', '🥈', '🥉'][entry.rank - 1] : `#${entry.rank}`}
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{entry.name}</h3>
                          <p className="text-sm text-muted-foreground flex items-center space-x-2">
                            <MapPin className="w-4 h-4" />
                            <span>{entry.location}</span>
                            <Badge variant={entry.type === 'recycler' ? 'default' : 'secondary'}>
                              {entry.type}
                            </Badge>
                          </p>
                        </div>
                      </div>
                      {entry.isTopPerformer && (
                        <Badge className="bg-purple-100 text-purple-800">
                          <Star className="w-3 h-3 mr-1" />
                          Top Performer
                        </Badge>
                      )}
                    </div>

                    <div className="grid md:grid-cols-4 gap-4 mt-4 text-sm">
                      <div className="text-center">
                        <div className="text-xl font-semibold text-blue-600">{entry.score.toLocaleString()}</div>
                        <div className="text-muted-foreground">Impact Score</div>
                      </div>
                      {entry.bottles && (
                        <div className="text-center">
                          <div className="text-xl font-semibold text-green-600">{entry.bottles.toLocaleString()}</div>
                          <div className="text-muted-foreground">Bottles Recycled</div>
                        </div>
                      )}
                      {entry.authentications && (
                        <div className="text-center">
                          <div className="text-xl font-semibold text-purple-600">{entry.authentications.toLocaleString()}</div>
                          <div className="text-muted-foreground">Products Verified</div>
                        </div>
                      )}
                      <div className="text-center">
                        <div className="text-xl font-semibold text-emerald-600">{entry.co2Saved} tons</div>
                        <div className="text-muted-foreground">CO₂ Saved</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="brand-scores" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="w-5 h-5" />
                <span>Brand Sustainability Rankings</span>
              </CardTitle>
              <CardDescription>FMCG companies ranked by their participation impact and sustainability efforts</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rank</TableHead>
                    <TableHead>Brand</TableHead>
                    <TableHead>Industry</TableHead>
                    <TableHead>Participation Score</TableHead>
                    <TableHead>Products Authenticated</TableHead>
                    <TableHead>Recycling Supported</TableHead>
                    <TableHead>CO₂ Impact</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Trend</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {brandSustainabilityData.map((brand) => (
                    <TableRow key={brand.rank}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-yellow-600">
                            {brand.rank <= 3 ? ['🥇', '🥈', '🥉'][brand.rank - 1] : `#${brand.rank}`}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{brand.brandName}</div>
                          <div className="text-sm text-muted-foreground">{brand.industry}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{brand.industry}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold">{brand.participationScore}/100</span>
                          <Progress value={brand.participationScore} className="w-16 h-2" />
                        </div>
                      </TableCell>
                      <TableCell>{brand.productsAuthenticated.toLocaleString()}</TableCell>
                      <TableCell>{brand.recyclingSupported.toLocaleString()}</TableCell>
                      <TableCell className="font-semibold text-green-600">{brand.co2Impact} tons</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSustainabilityGradeColor(brand.sustainabilityGrade)}`}>
                          {brand.sustainabilityGrade}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <span className="text-lg">{getTrendIcon(brand.impactTrend)}</span>
                          <span className={`text-xs font-medium ${
                            brand.impactTrend === 'up' ? 'text-green-600' :
                            brand.impactTrend === 'down' ? 'text-red-600' : 'text-gray-600'
                          }`}>
                            {brand.impactTrend}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Brand Impact Summary */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {brandSustainabilityData.reduce((sum, brand) => sum + brand.productsAuthenticated, 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Products Authenticated</div>
                  <div className="text-xs text-green-600">Across all participating brands</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {brandSustainabilityData.reduce((sum, brand) => sum + brand.recyclingSupported, 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Recycling Initiatives Supported</div>
                  <div className="text-xs text-green-600">Industry-wide collaboration</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600">
                    {brandSustainabilityData.reduce((sum, brand) => sum + brand.co2Impact, 0).toFixed(1)} tons
                  </div>
                  <div className="text-sm text-muted-foreground">Combined CO₂ Impact</div>
                  <div className="text-xs text-green-600">Environmental contribution</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Platform Impact Trends</CardTitle>
                <CardDescription>Growth in authentications, recycling, and environmental impact over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    authentications: { label: 'Authentications', color: '#3B82F6' },
                    recycling: { label: 'Bottles Recycled', color: '#10B981' },
                    co2Saved: { label: 'CO₂ Saved (tons)', color: '#059669' }
                  }}
                  className="h-64"
                >
                  <LineChart data={impactTrendsData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="authentications" stroke="var(--color-authentications)" strokeWidth={2} />
                    <Line type="monotone" dataKey="recycling" stroke="var(--color-recycling)" strokeWidth={2} />
                    <Line type="monotone" dataKey="co2Saved" stroke="var(--color-co2Saved)" strokeWidth={2} />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Regional Impact Distribution</CardTitle>
                <CardDescription>Impact contribution by geographic region</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {regionalImpactData.map((region) => (
                    <div key={region.region} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">{region.region}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-semibold">{region.impact}</span>
                          <span className="text-sm text-muted-foreground">({region.percentage}%)</span>
                        </div>
                      </div>
                      <Progress value={region.percentage} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Real-Time Activity Feed</CardTitle>
              <CardDescription>Live updates from the Ping ecosystem (anonymized)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { time: '2 seconds ago', action: 'Product authenticated in Berlin, Germany', icon: Eye, color: 'blue' },
                  { time: '5 seconds ago', action: 'PET bottle recycled in Tokyo, Japan', icon: Recycle, color: 'green' },
                  { time: '8 seconds ago', action: 'Counterfeit product detected in New York, USA', icon: AlertTriangle, color: 'red' },
                  { time: '12 seconds ago', action: 'New user joined in São Paulo, Brazil', icon: Users, color: 'purple' },
                  { time: '15 seconds ago', action: 'Brand campaign launched globally', icon: Target, color: 'orange' },
                  { time: '18 seconds ago', action: '10kg CO₂ milestone reached in London, UK', icon: TreePine, color: 'emerald' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3 p-2 rounded-lg bg-muted/30">
                    <div className={`w-8 h-8 rounded-full bg-${activity.color}-100 flex items-center justify-center`}>
                      <activity.icon className={`w-4 h-4 text-${activity.color}-600`} />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm">{activity.action}</div>
                      <div className="text-xs text-muted-foreground">{activity.time}</div>
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