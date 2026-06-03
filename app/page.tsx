import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Activity, Calendar, Lock, Phone, Mail, MapPin } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/95 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold text-primary">kobitMed</h1>
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

      {/* Hero Section - Enhanced Gradient */}
      <section className="relative flex-1 flex items-center justify-center bg-gradient-to-br from-primary/10 via-accent/10 to-purple-500/10 px-4 py-20 overflow-hidden">
        <img
          src="/hero1.jpeg"
          alt="Hero Background"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70 z-10" />
        
        <div className="relative z-20 max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl md:text-[4.5rem] leading-none font-bold text-white tracking-[-2px] font-space-grotesk">
              kobitMed
            </h1>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Your Health in Your Hands
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Connect with healthcare professionals, monitor your health metrics, and manage your medical records — all in one secure, beautiful platform.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="w-full sm:w-auto bg-white text-primary hover:bg-white/90">
                Sign Up as Patient
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-blue-950 hover:bg-gray-500 hover:text-primary">
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
          <p className="text-muted-foreground text-lg">
            Everything you need for modern telemedicine
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {[
            { icon: Activity, title: "Health Metrics Tracking", desc: "Sync your wearable devices to automatically track heart rate, steps, sleep, and more." },
            { icon: Calendar, title: "Easy Appointments", desc: "Book and manage appointments with healthcare providers in seconds." },
            { icon: Heart, title: "Medical Records", desc: "Securely store and access your medical history, prescriptions, and test results." },
            { icon: Lock, title: "Privacy & Security", desc: "Your data is encrypted and protected with industry-standard security measures." },
          ].map((feature, i) => (
            <Card key={i} className="group hover:shadow-lg transition-all duration-300 border border-border/50 hover:border-primary/30">
              <CardHeader>
                <feature.icon className="w-10 h-10 text-primary mb-4 group-hover:scale-110 transition-transform" />
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription className="text-base">{feature.desc}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQs Section */}
      <section className="bg-gradient-to-b from-background to-muted/30 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Frequently Asked Questions</h3>
            <p className="text-muted-foreground">Got questions? We’ve got answers.</p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "How do I connect my wearable device?",
                a: "We currently support Fitbit, Apple Health, and Google Fit. Just go to Settings → Connected Devices and follow the simple steps."
              },
              {
                q: "Is my medical data secure?",
                a: "Absolutely. All data is encrypted both in transit and at rest. We are HIPAA compliant and use industry-leading security practices."
              },
              {
                q: "Can I book appointments with any doctor?",
                a: "Yes! You can browse and book appointments with licensed doctors available on our platform."
              },
              {
                q: "What if I need to cancel an appointment?",
                a: "You can cancel or reschedule appointments up to 24 hours before the scheduled time directly from your dashboard."
              },
              {
                q: "Is there a mobile app?",
                a: "Yes! Our mobile app is available on both iOS and Android with all the features available on the web."
              }
            ].map((faq, i) => (
              <details key={i} className="group bg-card border border-border rounded-xl p-6 cursor-pointer hover:border-primary/30 transition-colors">
                <summary className="font-medium flex justify-between items-center text-lg">
                  {faq.q}
                  <span className="text-2xl group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-4xl font-bold mb-6">Get In Touch</h3>
              <p className="text-primary-foreground/80 text-lg mb-8">
                Have questions or need support? Our team is ready to help you.
              </p>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-medium">Phone</p>
                    <p>+234 800 123 4567</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-medium">Email</p>
                    <p>support@kobitmed.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-medium">Office</p>
                    <p>Lagos, Nigeria</p>
                  </div>
                </div>
              </div>
            </div>

            <Card className="bg-white/10 border-white/20 backdrop-blur-md">
              <CardContent className="p-8">
                <h4 className="text-xl font-semibold mb-6 text-white">Send us a message</h4>
                <form className="space-y-5">
                  <div>
                    <input type="text" placeholder="Your Name" className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 placeholder:text-white/50 focus:outline-none focus:border-white" />
                  </div>
                  <div>
                    <input type="email" placeholder="Email Address" className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 placeholder:text-white/50 focus:outline-none focus:border-white" />
                  </div>
                  <div>
                    <textarea placeholder="How can we help you?" rows={5} className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 placeholder:text-white/50 focus:outline-none focus:border-white resize-y" />
                  </div>
                  <Button className="w-full py-6 text-lg bg-white text-primary hover:bg-white/90">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-r from-primary via-accent to-purple-600 py-16 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h3 className="text-4xl font-bold mb-4">Ready to transform your healthcare experience?</h3>
          <p className="text-xl opacity-90 mb-8">Join thousands of users who trust kobitMed with their health.</p>
          <Link href="/auth/signup">
            <Button size="lg" variant="secondary" className="text-lg px-10 py-7">
              Create Your Free Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
          <p>© 2026 kobitMed. All rights reserved. Your health, our priority.</p>
          <div className="flex justify-center gap-6 mt-4 text-xs">
            <Link href="#" className="hover:text-foreground">Privacy Policy</Link>
            <Link href="#" className="hover:text-foreground">Terms of Service</Link>
            <Link href="#" className="hover:text-foreground">Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}