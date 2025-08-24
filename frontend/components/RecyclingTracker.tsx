import React, { useState } from 'react';
import { Recycle, Plus, Camera, MapPin, Star, Zap, CheckCircle, TrendingUp, Award } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { Input } from './ui/input';
import { Label } from './ui/label';

export function RecyclingTracker() {
  const [bottlesRecycled, setBottlesRecycled] = useState(23);
  const [pointsEarned, setPointsEarned] = useState(850);
  const [weeklyGoal] = useState(10);
  const [weeklyProgress, setWeeklyProgress] = useState(7);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newBottles, setNewBottles] = useState('');
  const [activeTab, setActiveTab] = useState('track');

  const handleSubmitRecycling = () => {
    if (newBottles && parseInt(newBottles) > 0) {
      setIsSubmitting(true);
      
      setTimeout(() => {
        const bottles = parseInt(newBottles);
        const pointsPerBottle = 8;
        const earnedPoints = bottles * pointsPerBottle;
        
        setBottlesRecycled(prev => prev + bottles);
        setPointsEarned(prev => prev + earnedPoints);
        setWeeklyProgress(prev => Math.min(prev + bottles, weeklyGoal));
        setNewBottles('');
        setIsSubmitting(false);
      }, 2000);
    }
  };

  const recyclingHistory = [
    { date: '2024-01-15', bottles: 5, points: 40, location: 'Mall Collection Point', verified: true },
    { date: '2024-01-12', bottles: 3, points: 24, location: 'Home Pickup', verified: true },
    { date: '2024-01-10', bottles: 4, points: 32, location: 'Supermarket Bin', verified: true },
    { date: '2024-01-08', bottles: 2, points: 16, location: 'Office Collection', verified: true },
    { date: '2024-01-05', bottles: 6, points: 48, location: 'Mall Collection Point', verified: true },
  ];

  const impactStats = {
    co2Saved: bottlesRecycled * 0.05,
    energySaved: bottlesRecycled * 0.35,
    waterSaved: bottlesRecycled * 2.1,
  };

  const collectionPoints = [
    { name: 'Central Mall Collection Point', distance: '0.5 km', bottles: 145, points: 12 },
    { name: 'Supermarket Recycling Bin', distance: '1.2 km', bottles: 89, points: 8 },
    { name: 'Community Center', distance: '1.8 km', bottles: 234, points: 15 },
    { name: 'Office Complex', distance: '2.1 km', bottles: 67, points: 10 },
  ];

  const weeklyProgressPercent = (weeklyProgress / weeklyGoal) * 100;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1>PET Bottle Recycling</h1>
        <p className="text-muted-foreground">
          Track your recycling impact and earn points for a sustainable future
        </p>
      </div>

      {/* Main Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Recycle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Bottles Recycled</p>
                <p>{bottlesRecycled}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Points Earned</p>
                <p>{pointsEarned}</p>
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
                <p>{Math.floor(pointsEarned / 100)}</p>
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
                <p className="text-sm text-muted-foreground">CO₂ Saved</p>
                <p>{impactStats.co2Saved.toFixed(1)} kg</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Goal Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="w-5 h-5" />
            <span>Weekly Recycling Goal</span>
          </CardTitle>
          <CardDescription>
            Recycle {weeklyGoal} bottles this week to earn bonus points
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{weeklyProgress} bottles recycled</span>
              <span>{weeklyGoal} bottles goal</span>
            </div>
            <Progress value={weeklyProgressPercent} />
            <div className="flex justify-between items-center">
              <p className="text-xs text-muted-foreground">
                {weeklyGoal - weeklyProgress} bottles remaining
              </p>
              {weeklyProgress >= weeklyGoal && (
                <Badge className="bg-green-100 text-green-800">
                  Goal Achieved! +50 bonus points
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tab Navigation */}
      <div className="border-b">
        <nav className="flex space-x-8">
          {['track', 'locations', 'history', 'impact'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
              }`}
            >
              {tab === 'track' && 'Track Recycling'}
              {tab === 'locations' && 'Collection Points'}
              {tab === 'history' && 'History'}
              {tab === 'impact' && 'Environmental Impact'}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'track' && (
        <Card>
          <CardHeader>
            <CardTitle>Submit Recycling Activity</CardTitle>
            <CardDescription>
              Log your PET bottle recycling and earn points
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="bottle-count">Number of Bottles Recycled</Label>
                  <Input
                    id="bottle-count"
                    type="number"
                    placeholder="Enter bottle count"
                    value={newBottles}
                    onChange={(e) => setNewBottles(e.target.value)}
                    min="1"
                  />
                </div>

                {newBottles && parseInt(newBottles) > 0 && (
                  <Alert>
                    <CheckCircle className="w-4 h-4" />
                    <AlertDescription>
                      You will earn {parseInt(newBottles) * 8} points for recycling {newBottles} bottles
                    </AlertDescription>
                  </Alert>
                )}

                <Button 
                  onClick={handleSubmitRecycling}
                  disabled={!newBottles || parseInt(newBottles) <= 0 || isSubmitting}
                  className="w-full"
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-r-transparent rounded-full animate-spin mr-2" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Submit Recycling
                    </>
                  )}
                </Button>
              </div>

              <div className="space-y-4">
                <h4>Point Rewards</h4>
                <div className="bg-muted rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Points per bottle</span>
                    <Badge variant="secondary">8 points</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Weekly goal bonus</span>
                    <Badge variant="secondary">50 points</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Monthly challenge</span>
                    <Badge variant="secondary">200 points</Badge>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  <Camera className="w-4 h-4 mr-2" />
                  Upload Photo Proof
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'locations' && (
        <div className="grid gap-4">
          {collectionPoints.map((point, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <h4>{point.name}</h4>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3" />
                        <span>{point.distance}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Recycle className="w-3 h-3" />
                        <span>{point.bottles} bottles collected</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge>{point.points} pts/bottle</Badge>
                    <Button variant="outline" size="sm" className="mt-2 w-full">
                      Get Directions
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'history' && (
        <Card>
          <CardHeader>
            <CardTitle>Recycling History</CardTitle>
            <CardDescription>Your recycling activity and points earned</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recyclingHistory.map((entry, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Recycle className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p>{entry.bottles} bottles recycled</p>
                      <p className="text-sm text-muted-foreground">{entry.location}</p>
                      <p className="text-xs text-muted-foreground">{entry.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge>+{entry.points} pts</Badge>
                    {entry.verified && (
                      <CheckCircle className="w-4 h-4 text-green-500 mt-1 ml-auto" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'impact' && (
        <div className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-green-600">{impactStats.co2Saved.toFixed(1)} kg</p>
                <p className="text-sm text-muted-foreground">CO₂ Emissions Saved</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-8 h-8 text-blue-600" />
                </div>
                <p className="text-blue-600">{impactStats.energySaved.toFixed(1)} kWh</p>
                <p className="text-sm text-muted-foreground">Energy Saved</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Award className="w-8 h-8 text-purple-600" />
                </div>
                <p className="text-purple-600">{impactStats.waterSaved.toFixed(1)} L</p>
                <p className="text-sm text-muted-foreground">Water Saved</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Your Environmental Impact</CardTitle>
              <CardDescription>See how your recycling contributes to sustainability</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <CheckCircle className="w-4 h-4" />
                  <AlertDescription>
                    By recycling {bottlesRecycled} PET bottles, you've prevented them from potentially ending up in landfills or oceans, while saving valuable natural resources.
                  </AlertDescription>
                </Alert>
                
                <div className="bg-muted rounded-lg p-4">
                  <h4>Fun Facts About Your Impact:</h4>
                  <ul className="text-sm space-y-1 mt-2">
                    <li>• Each recycled PET bottle can be turned into new products like clothing or carpets</li>
                    <li>• You've saved enough energy to power a laptop for {(impactStats.energySaved * 2).toFixed(0)} hours</li>
                    <li>• The water you've saved could fill {Math.floor(impactStats.waterSaved / 0.5)} standard water bottles</li>
                    <li>• Your CO₂ savings are equivalent to taking a car off the road for {(impactStats.co2Saved * 5).toFixed(0)} km</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}