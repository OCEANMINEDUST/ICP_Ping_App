import React, { useState } from 'react';
import { Scan, CheckCircle, AlertTriangle, Camera, Zap, Gift, ArrowRight, Star } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Progress } from './ui/progress';

export function ProductAuthentication() {
  const [scanResult, setScanResult] = useState<'idle' | 'scanning' | 'authentic' | 'counterfeit' | 'unknown'>('idle');
  const [pointsEarned, setPointsEarned] = useState(0);
  const [totalPoints, setTotalPoints] = useState(1250);
  const [scanCount, setScanCount] = useState(47);

  const handleScan = () => {
    setScanResult('scanning');
    
    setTimeout(() => {
      const outcomes = ['authentic', 'counterfeit', 'unknown'];
      const result = outcomes[Math.floor(Math.random() * outcomes.length)] as any;
      setScanResult(result);
      
      if (result === 'authentic') {
        const earned = Math.floor(Math.random() * 20) + 5;
        setPointsEarned(earned);
        setTotalPoints(prev => prev + earned);
        setScanCount(prev => prev + 1);
      } else if (result === 'counterfeit') {
        const earned = Math.floor(Math.random() * 15) + 10;
        setPointsEarned(earned);
        setTotalPoints(prev => prev + earned);
        setScanCount(prev => prev + 1);
      } else {
        const earned = 2;
        setPointsEarned(earned);
        setTotalPoints(prev => prev + earned);
        setScanCount(prev => prev + 1);
      }
    }, 2000);
  };

  const resetScan = () => {
    setScanResult('idle');
    setPointsEarned(0);
  };

  const getScanResultIcon = () => {
    switch (scanResult) {
      case 'authentic': return <CheckCircle className="w-8 h-8 text-green-500" />;
      case 'counterfeit': return <AlertTriangle className="w-8 h-8 text-red-500" />;
      case 'unknown': return <AlertTriangle className="w-8 h-8 text-yellow-500" />;
      default: return <Scan className="w-8 h-8 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1>Product Authentication</h1>
        <p className="text-muted-foreground">
          Scan FMCG products to verify authenticity and earn points
        </p>
      </div>

      {/* Points Summary */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Points</p>
                <p>{totalPoints.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Scan className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Products Scanned</p>
                <p>{scanCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ping Tokens Available</p>
                <p>{Math.floor(totalPoints / 100)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Scanning Interface */}
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle>QR Code Scanner</CardTitle>
          <CardDescription>
            Point your camera at the product's QR code or barcode
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Scanner Viewfinder */}
          <div className="aspect-square bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
            {scanResult === 'scanning' ? (
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-600/20 animate-pulse" />
            ) : null}
            
            <div className="text-center space-y-4">
              {getScanResultIcon()}
              <div>
                {scanResult === 'idle' && <p>Ready to scan</p>}
                {scanResult === 'scanning' && <p>Scanning...</p>}
                {scanResult === 'authentic' && (
                  <div className="space-y-2">
                    <p>Product Authentic!</p>
                    <Badge className="bg-green-100 text-green-800">
                      +{pointsEarned} points earned
                    </Badge>
                  </div>
                )}
                {scanResult === 'counterfeit' && (
                  <div className="space-y-2">
                    <p>Counterfeit Detected!</p>
                    <Badge className="bg-red-100 text-red-800">
                      +{pointsEarned} points (bonus for detection)
                    </Badge>
                  </div>
                )}
                {scanResult === 'unknown' && (
                  <div className="space-y-2">
                    <p>Product Unknown</p>
                    <Badge className="bg-yellow-100 text-yellow-800">
                      +{pointsEarned} points for attempt
                    </Badge>
                  </div>
                )}
              </div>
            </div>

            {/* Scanning overlay */}
            {scanResult === 'scanning' && (
              <div className="absolute inset-4 border-2 border-blue-500 rounded-lg">
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-blue-500"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-blue-500"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-blue-500"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-blue-500"></div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {scanResult === 'idle' ? (
              <Button onClick={handleScan} className="w-full" size="lg">
                <Scan className="w-5 h-5 mr-2" />
                Start Scanning
              </Button>
            ) : scanResult === 'scanning' ? (
              <Button disabled className="w-full" size="lg">
                <div className="w-5 h-5 border-2 border-current border-r-transparent rounded-full animate-spin mr-2" />
                Scanning...
              </Button>
            ) : (
              <div className="space-y-2">
                <Button onClick={resetScan} className="w-full" size="lg">
                  <Scan className="w-5 h-5 mr-2" />
                  Scan Another Product
                </Button>
                <Button variant="outline" className="w-full">
                  <Camera className="w-4 h-4 mr-2" />
                  Switch to Camera
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Points Conversion Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Gift className="w-5 h-5" />
            <span>Point Rewards System</span>
          </CardTitle>
          <CardDescription>
            Earn points for every scan and convert them to Ping tokens
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4>Points per Scan</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Authentic Product</span>
                  <Badge variant="secondary">5-25 points</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Counterfeit Detected</span>
                  <Badge variant="secondary">10-25 points</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Unknown Product</span>
                  <Badge variant="secondary">2 points</Badge>
                </div>
              </div>
            </div>
            
            <div>
              <h4>Conversion Rate</h4>
              <div className="bg-muted rounded-lg p-4">
                <div className="text-center space-y-2">
                  <p>100 Points</p>
                  <ArrowRight className="w-5 h-5 mx-auto text-muted-foreground" />
                  <p className="text-purple-600">1 Ping Token</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Convert points to Ping tokens in your dashboard
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      {scanResult !== 'idle' && (
        <Card>
          <CardHeader>
            <CardTitle>Scan Results</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert className={
              scanResult === 'authentic' ? 'border-green-200 bg-green-50' :
              scanResult === 'counterfeit' ? 'border-red-200 bg-red-50' :
              'border-yellow-200 bg-yellow-50'
            }>
              <AlertTriangle className="w-4 h-4" />
              <AlertDescription>
                {scanResult === 'authentic' && 
                  `✅ Product verified as authentic! You earned ${pointsEarned} points. This product is safe to purchase.`
                }
                {scanResult === 'counterfeit' && 
                  `⚠️ COUNTERFEIT DETECTED! You earned ${pointsEarned} points for helping us identify this fake product. Do not purchase this item.`
                }
                {scanResult === 'unknown' && 
                  `❓ Product not found in our database. You earned ${pointsEarned} points for the scan attempt. We'll add this product soon.`
                }
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  );
}