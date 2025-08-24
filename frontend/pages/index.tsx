import React, { useState } from "react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

export default function App() {
  const [currentView, setCurrentView] = useState("home");
  const [points, setPoints] = useState(1250);
  const [tokens, setTokens] = useState(8);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-medium text-sm">
                P
              </span>
            </div>
            <div>
              <h1 className="text-xl font-medium">Ping</h1>
              <p className="text-xs text-muted-foreground">
                Decentralized Authentication Platform
              </p>
            </div>
          </div>

          <nav className="flex space-x-2">
            <Button
              variant={
                currentView === "home" ? "default" : "ghost"
              }
              size="sm"
              onClick={() => setCurrentView("home")}
            >
              Home
            </Button>
            <Button
              variant={
                currentView === "scan" ? "default" : "ghost"
              }
              size="sm"
              onClick={() => setCurrentView("scan")}
            >
              Scan
            </Button>
            <Button
              variant={
                currentView === "recycle" ? "default" : "ghost"
              }
              size="sm"
              onClick={() => setCurrentView("recycle")}
            >
              Recycle
            </Button>
            <Button
              variant={
                currentView === "rewards" ? "default" : "ghost"
              }
              size="sm"
              onClick={() => setCurrentView("rewards")}
            >
              Rewards
            </Button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto p-6">
        {currentView === "home" && (
          <div className="text-center space-y-6">
            <div>
              <h1 className="text-3xl font-medium mb-4">
                Welcome to Ping Platform
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Decentralized FMCG authentication and PET bottle
                recycling platform. Earn points for scanning
                products and recycling bottles, convert them to
                Ping tokens.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <Card>
                <CardHeader>
                  <div className="text-4xl mb-2">🔍</div>
                  <CardTitle>Product Authentication</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Scan FMCG products to verify authenticity
                    and detect counterfeits. Earn 5-25 points
                    per scan.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="text-4xl mb-2">♻️</div>
                  <CardTitle>PET Bottle Recycling</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Track and submit your PET bottle recycling
                    activities. Earn 8 points per bottle
                    recycled.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="text-4xl mb-2">🪙</div>
                  <CardTitle>Ping Token Rewards</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Convert your earned points to Ping tokens.
                    100 points = 1 Ping token for platform
                    benefits.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {currentView === "scan" && (
          <ScanView points={points} setPoints={setPoints} />
        )}

        {currentView === "recycle" && <RecycleView />}

        {currentView === "rewards" && (
          <RewardsView
            points={points}
            tokens={tokens}
            setPoints={setPoints}
            setTokens={setTokens}
          />
        )}
      </main>
    </div>
  );
}

function ScanView({ points, setPoints }) {
  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      const results = ["authentic", "counterfeit", "unknown"];
      const result =
        results[Math.floor(Math.random() * results.length)];
      const earnedPoints =
        result === "authentic"
          ? 15
          : result === "counterfeit"
            ? 20
            : 2;

      setScanResult({ type: result, points: earnedPoints });
      setPoints((prev) => prev + earnedPoints);
      setIsScanning(false);
    }, 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-medium mb-2">
          Product Authentication
        </h1>
        <p className="text-muted-foreground">
          Scan FMCG products to verify authenticity and earn
          points
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-medium">
              {points.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">
              Total Points
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-medium">47</div>
            <div className="text-sm text-muted-foreground">
              Products Scanned
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-medium">
              {Math.floor(points / 100)}
            </div>
            <div className="text-sm text-muted-foreground">
              Ping Tokens
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-8 text-center space-y-6">
          <div className="w-48 h-48 mx-auto border-2 border-dashed border-muted rounded-lg flex items-center justify-center bg-muted/20">
            <div className="text-6xl">
              {isScanning ? "⏳" : "📱"}
            </div>
          </div>

          {!isScanning && !scanResult && (
            <Button onClick={handleScan} size="lg">
              Start Scanning
            </Button>
          )}

          {isScanning && (
            <p className="text-muted-foreground">
              Scanning product...
            </p>
          )}

          {scanResult && (
            <div className="space-y-4">
              <div
                className={`p-4 rounded-lg border ${
                  scanResult.type === "authentic"
                    ? "bg-green-50 border-green-200"
                    : scanResult.type === "counterfeit"
                      ? "bg-red-50 border-red-200"
                      : "bg-yellow-50 border-yellow-200"
                }`}
              >
                <p className="font-medium">
                  {scanResult.type === "authentic" &&
                    "✅ Product Authentic!"}
                  {scanResult.type === "counterfeit" &&
                    "⚠️ Counterfeit Detected!"}
                  {scanResult.type === "unknown" &&
                    "❓ Product Unknown"}
                </p>
                <p className="text-sm mt-1">
                  +{scanResult.points} points earned
                </p>
              </div>
              <Button
                onClick={() => setScanResult(null)}
                variant="outline"
              >
                Scan Another Product
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function RecycleView() {
  const [bottles, setBottles] = useState("");
  const [recycled, setRecycled] = useState(23);

  const handleSubmit = () => {
    if (bottles && parseInt(bottles) > 0) {
      const newBottles = parseInt(bottles);
      const earnedPoints = newBottles * 8;
      setBottles("");
      alert(
        `Success! You earned ${earnedPoints} points for recycling ${newBottles} bottles.`,
      );
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-medium mb-2">
          PET Bottle Recycling
        </h1>
        <p className="text-muted-foreground">
          Track your recycling impact and earn points
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-medium">
              {recycled}
            </div>
            <div className="text-sm text-muted-foreground">
              Bottles Recycled
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-medium">850</div>
            <div className="text-sm text-muted-foreground">
              Points Earned
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-medium">
              {(recycled * 0.05).toFixed(1)} kg
            </div>
            <div className="text-sm text-muted-foreground">
              CO₂ Saved
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Submit Recycling Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Number of Bottles Recycled
            </label>
            <input
              type="number"
              value={bottles}
              onChange={(e) => setBottles(e.target.value)}
              placeholder="Enter bottle count"
              min="1"
              className="w-full p-3 border border-border rounded-lg bg-input-background"
            />
          </div>

          {bottles && parseInt(bottles) > 0 && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800">
                You will earn {parseInt(bottles) * 8} points for
                recycling {bottles} bottles
              </p>
            </div>
          )}

          <Button
            onClick={handleSubmit}
            disabled={!bottles || parseInt(bottles) <= 0}
            className="w-full"
          >
            Submit Recycling
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function RewardsView({ points, tokens, setPoints, setTokens }) {
  const [convertAmount, setConvertAmount] = useState("");
  const maxConvertible = Math.floor(points / 100);

  const handleConvert = () => {
    const amount = parseInt(convertAmount);
    if (amount && amount <= maxConvertible) {
      setPoints((prev) => prev - amount * 100);
      setTokens((prev) => prev + amount);
      setConvertAmount("");
      alert(
        `Successfully converted ${amount * 100} points to ${amount} Ping tokens!`,
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-medium mb-2">
          Rewards Dashboard
        </h1>
        <p className="text-muted-foreground">
          Track your points, convert to Ping tokens, and monitor
          your impact
        </p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-medium">
              {points.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">
              Total Points
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-medium">{tokens}</div>
            <div className="text-sm text-muted-foreground">
              Ping Tokens
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-medium">47</div>
            <div className="text-sm text-muted-foreground">
              Products Scanned
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-medium">23</div>
            <div className="text-sm text-muted-foreground">
              Bottles Recycled
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Convert Points to Ping Tokens</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Exchange rate: 100 points = 1 Ping token
          </p>

          <div>
            <label className="block text-sm font-medium mb-2">
              Ping Tokens to Receive (Max: {maxConvertible})
            </label>
            <input
              type="number"
              value={convertAmount}
              onChange={(e) => setConvertAmount(e.target.value)}
              placeholder="Enter amount"
              min="1"
              max={maxConvertible}
              className="w-full p-3 border border-border rounded-lg bg-input-background"
            />
          </div>

          {convertAmount && parseInt(convertAmount) > 0 && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800">
                You will spend {parseInt(convertAmount) * 100}{" "}
                points to receive {convertAmount} Ping tokens
              </p>
            </div>
          )}

          <Button
            onClick={handleConvert}
            disabled={
              !convertAmount ||
              parseInt(convertAmount) > maxConvertible ||
              parseInt(convertAmount) <= 0
            }
            className="w-full"
          >
            Convert to Ping Tokens
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ping Token Benefits</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-center space-x-2">
              <span className="text-green-500">✓</span>
              <span>Premium platform features</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-green-500">✓</span>
              <span>Higher rewards multiplier</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-green-500">✓</span>
              <span>Exclusive product access</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-green-500">✓</span>
              <span>Trading on ICP ecosystem</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-green-500">✓</span>
              <span>Governance voting rights</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}