import React, { useState } from 'react';
import { Award, TrendingUp, Gift, Zap, Star, ArrowRight, Coins, Target, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { Input } from './ui/input';
import { Label } from './ui/label';

export function UserDashboard() {
  const [points, setPoints] = useState(1250);
  const [pingTokens, setPingTokens] = useState(8);
  const [convertAmount, setConvertAmount] = useState('');
  const [isConverting, setIsConverting] = useState(false);
  const [activeTab, setActiveTab] = useState('convert');

  const maxConvertible = Math.floor(points / 100);
  const nextMilestone = 2000;
  const progressToMilestone = (points / nextMilestone) * 100;

  const handleConversion = () => {
    const amount = parseInt(convertAmount);
    if (amount && amount <= maxConvertible) {
      setIsConverting(true);
      
      setTimeout(() => {
        setPoints(prev => prev - (amount * 100));
        setPingTokens(prev => prev + amount);
        setConvertAmount('');
        setIsConverting(false);
      }, 2000);
    }
  };

  const recentActivity = [
    { type: 'scan', description: 'Scanned Coca-Cola bottle', points: 15, time: '2 hours ago', verified: true },
    { type: 'recycle', description: 'Recycled 3 PET bottles', points: 25, time: '1 day ago', verified: true },
    { type: 'scan', description: 'Detected counterfeit Nestle product', points: 20, time: '2 days ago', verified: true },
    { type: 'conversion', description: 'Converted 300 points to 3 Ping tokens', points: -300, time: '3 days ago', verified: true },
    { type: 'scan', description: 'Scanned Unilever soap', points: 12, time: '4 days ago', verified: true },
  ];

  const achievements = [
    { name: 'First Scan', description: 'Complete your first product scan', completed: true, points: 50 },
    { name: 'Counterfeit Hunter', description: 'Detect your first counterfeit product', completed: true, points: 100 },
    { name: 'Eco Warrior', description: 'Recycle 10 PET bottles', completed: false, progress: 7, total: 10, points: 200 },
    { name: 'Point Collector', description: 'Accumulate 1000 points', completed: true, points: 150 },
    { name: 'Token Converter', description: 'Convert points to Ping tokens', completed: true, points: 100 },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1>Your Rewards Dashboard</h1>
        <p className="text-muted-foreground">
          Track your points, convert to Ping tokens, and monitor your impact
        </p>
      </div>

      {/* Main Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Points</p>
                <p>{points.toLocaleString()}</p>
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
                <p className="text-sm text-muted-foreground">Ping Tokens</p>
                <p>{pingTokens}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Products Scanned</p>
                <p>47</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Weekly Growth</p>
                <p>+23%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Milestone Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <span>Next Milestone</span>
          </CardTitle>
          <CardDescription>
            Reach {nextMilestone.toLocaleString()} points to unlock premium features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{points.toLocaleString()} points</span>
              <span>{nextMilestone.toLocaleString()} points</span>
            </div>
            <Progress value={progressToMilestone} />
            <p className="text-xs text-muted-foreground">
              {nextMilestone - points} points remaining
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Tab Navigation */}
      <div className="border-b">
        <nav className="flex space-x-8">
          {['convert', 'activity', 'achievements'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
              }`}
            >
              {tab === 'convert' && 'Convert Points'}
              {tab === 'activity' && 'Recent Activity'}
              {tab === 'achievements' && 'Achievements'}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'convert' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Coins className="w-5 h-5" />
              <span>Convert Points to Ping Tokens</span>
            </CardTitle>
            <CardDescription>
              Exchange your points for Ping tokens that can be used across the platform
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Conversion Rate Display */}
            <div className="bg-muted rounded-lg p-6">
              <div className="text-center space-y-4">
                <h3>Current Exchange Rate</h3>
                <div className="flex items-center justify-center space-x-4">
                  <div className="text-center">
                    <p className="text-blue-600">100</p>
                    <p className="text-sm text-muted-foreground">Points</p>
                  </div>
                  <ArrowRight className="w-6 h-6 text-muted-foreground" />
                  <div className="text-center">
                    <p className="text-purple-600">1</p>
                    <p className="text-sm text-muted-foreground">Ping Token</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  You can convert up to {maxConvertible} tokens right now
                </p>
              </div>
            </div>

            {/* Conversion Form */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="convert-amount">Ping Tokens to Receive</Label>
                  <Input
                    id="convert-amount"
                    type="number"
                    placeholder="Enter amount"
                    value={convertAmount}
                    onChange={(e) => setConvertAmount(e.target.value)}
                    max={maxConvertible}
                    min="1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Maximum: {maxConvertible} tokens
                  </p>
                </div>

                {convertAmount && parseInt(convertAmount) > 0 && (
                  <Alert>
                    <CheckCircle className="w-4 h-4" />
                    <AlertDescription>
                      You will spend {parseInt(convertAmount) * 100} points to receive {convertAmount} Ping tokens
                    </AlertDescription>
                  </Alert>
                )}

                <Button 
                  onClick={handleConversion}
                  disabled={!convertAmount || parseInt(convertAmount) > maxConvertible || isConverting}
                  className="w-full"
                  size="lg"
                >
                  {isConverting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-r-transparent rounded-full animate-spin mr-2" />
                      Converting...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Convert to Ping Tokens
                    </>
                  )}
                </Button>
              </div>

              <div className="space-y-4">
                <h4>Ping Token Benefits</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Premium platform features</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Higher rewards multiplier</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Exclusive product access</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Trading on ICP ecosystem</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Governance voting rights</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'activity' && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your recent scans, recycling, and point transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      activity.type === 'scan' ? 'bg-blue-100' :
                      activity.type === 'recycle' ? 'bg-green-100' :
                      'bg-purple-100'
                    }`}>
                      {activity.type === 'scan' && <Award className="w-4 h-4 text-blue-600" />}
                      {activity.type === 'recycle' && <Gift className="w-4 h-4 text-green-600" />}
                      {activity.type === 'conversion' && <Zap className="w-4 h-4 text-purple-600" />}
                    </div>
                    <div>
                      <p>{activity.description}</p>
                      <p className="text-sm text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={activity.points > 0 ? "default" : "secondary"}>
                      {activity.points > 0 ? '+' : ''}{activity.points} pts
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'achievements' && (
        <div className="grid md:grid-cols-2 gap-4">
          {achievements.map((achievement, index) => (
            <Card key={index} className={achievement.completed ? 'border-green-200 bg-green-50' : ''}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center space-x-2">
                      <h4>{achievement.name}</h4>
                      {achievement.completed && (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    
                    {!achievement.completed && achievement.progress && (
                      <div className="space-y-1">
                        <Progress value={(achievement.progress / achievement.total!) * 100} />
                        <p className="text-xs text-muted-foreground">
                          {achievement.progress}/{achievement.total}
                        </p>
                      </div>
                    )}
                  </div>
                  <Badge variant={achievement.completed ? "default" : "secondary"}>
                    {achievement.points} pts
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}