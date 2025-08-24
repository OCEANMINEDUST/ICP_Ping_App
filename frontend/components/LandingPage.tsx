import React from 'react';
import { Shield, Recycle, Award, Zap, Users, Globe, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function LandingPage() {
  const features = [
    {
      icon: Shield,
      title: 'Product Authentication',
      description: 'Verify FMCG products using blockchain technology to detect counterfeits instantly',
      color: 'text-blue-500'
    },
    {
      icon: Recycle,
      title: 'PET Bottle Recycling',
      description: 'Track and incentivize plastic bottle recycling with token rewards',
      color: 'text-green-500'
    },
    {
      icon: Award,
      title: 'Token Rewards',
      description: 'Earn tokens for every authenticated product and recycled bottle',
      color: 'text-purple-500'
    },
    {
      icon: Zap,
      title: 'Real-time Alerts',
      description: 'Instant notifications to companies and regulators when counterfeits are detected',
      color: 'text-orange-500'
    }
  ];

  const benefits = [
    'Eliminates counterfeit products from supply chains',
    'Reduces plastic waste through incentivized recycling',
    'Transparent and immutable tracking on ICP blockchain',
    'Seamless Telegram integration for notifications',
    'Scalable solution for global FMCG markets',
    'Regulatory compliance and oversight tools'
  ];

  const stats = [
    { value: '10M+', label: 'Products Authenticated' },
    { value: '2.5M', label: 'PET Bottles Recycled' },
    { value: '50K+', label: 'Active Users' },
    { value: '150+', label: 'Partner Companies' }
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <div className="space-y-4">
          <Badge variant="secondary" className="mb-4">
            Built on The Open Network ICP
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Ping Platform
          </h1>
          <h2 className="text-2xl md:text-3xl text-muted-foreground max-w-3xl mx-auto">
            Decentralized Authentication & Recycling Platform
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Authenticate FMCG products, combat counterfeits, and incentivize PET bottle recycling 
            through blockchain technology and token rewards.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button size="lg" className="flex items-center space-x-2">
            <span>Start Authenticating</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="lg">
            Learn More
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">Platform Features</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Comprehensive solution for product authentication and environmental sustainability
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-all">
              <CardHeader>
                <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-muted flex items-center justify-center">
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">How It Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Simple steps to authenticate products and earn rewards
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-600">1</span>
            </div>
            <h3 className="text-xl font-semibold">Scan Product</h3>
            <p className="text-muted-foreground">
              Use your device to scan QR codes or barcodes on FMCG products
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-green-600">2</span>
            </div>
            <h3 className="text-xl font-semibold">Verify Authenticity</h3>
            <p className="text-muted-foreground">
              Our blockchain-based system instantly verifies product authenticity
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-purple-600">3</span>
            </div>
            <h3 className="text-xl font-semibold">Earn Rewards</h3>
            <p className="text-muted-foreground">
              Receive tokens for authentic products and recycling activities
            </p>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-muted/30 rounded-2xl p-8 space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">Platform Benefits</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Creating value for consumers, businesses, and the environment
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span>{benefit}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Technology Stack */}
      <section className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">Built on Cutting-Edge Technology</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Leveraging The Open Network ICP for scalability and security
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="text-center">
            <CardHeader>
              <Globe className="w-8 h-8 mx-auto text-blue-500" />
              <CardTitle>The Open Network ICP</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Built on Internet Computer Protocol for infinite scalability and low costs
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="w-8 h-8 mx-auto text-green-500" />
              <CardTitle>Telegram Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Seamless notifications and user interactions through Telegram bots
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Shield className="w-8 h-8 mx-auto text-purple-500" />
              <CardTitle>Blockchain Security</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Immutable records and transparent tracking for all transactions
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-12 text-white">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Join the Revolution</h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Be part of the movement to eliminate counterfeits and promote sustainable recycling
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary">
              Get Started Now
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
              Contact Sales
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}