import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Heart, Activity, Calendar, Lock } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold text-primary">TeleMed</h1>
          </div>
          <div className="flex gap-2">
            <Link href="/auth/login">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10 px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground">
              Your Health in Your Hands
            </h2>
            <p className="text-xl text-muted-foreground">
              Connect with healthcare professionals, monitor your health metrics from wearable devices, and manage your medical records all in one secure platform.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Sign Up as Patient
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Sign Up as Doctor
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold text-foreground mb-4">
            Comprehensive Healthcare at Your Fingertips
          </h3>
          <p className="text-muted-foreground">
            Everything you need for modern telemedicine
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <Activity className="w-8 h-8 text-accent mb-2" />
              <CardTitle>Health Metrics Tracking</CardTitle>
              <CardDescription>
                Sync your Fitbit smartwatch to automatically track heart rate, steps, sleep, and more
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Calendar className="w-8 h-8 text-accent mb-2" />
              <CardTitle>Easy Appointments</CardTitle>
              <CardDescription>
                Book and manage appointments with healthcare providers in seconds
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Heart className="w-8 h-8 text-accent mb-2" />
              <CardTitle>Medical Records</CardTitle>
              <CardDescription>
                Securely store and access your medical history, prescriptions, and test results
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Lock className="w-8 h-8 text-accent mb-2" />
              <CardTitle>Privacy & Security</CardTitle>
              <CardDescription>
                Your data is encrypted and protected with industry-standard security measures
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-16 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h3 className="text-3xl font-bold">Ready to Get Started?</h3>
          <p className="text-lg opacity-90">
            Join thousands of users who are taking control of their health
          </p>
          <Link href="/auth/signup">
            <Button size="lg" variant="secondary" className="w-full sm:w-auto">
              Create Your Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          <p>© 2026 TeleMed. All rights reserved. Your health, our priority.</p>
        </div>
      </footer>
    </div>
  )
}
