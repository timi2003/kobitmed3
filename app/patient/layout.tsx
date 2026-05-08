'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Heart, Home, Calendar, FileText, LogOut, Menu, X } from 'lucide-react'

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [userName, setUserName] = useState('User')

  useEffect(() => {
    // Check if user is authenticated
    const userId = localStorage.getItem('userId')
    const userType = localStorage.getItem('userType')
    
    if (!userId || userType !== 'patient') {
      router.push('/auth/login')
      return
    }
    
    setIsAuthenticated(true)
    // Could fetch user name here
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('userId')
    localStorage.removeItem('userType')
    router.push('/auth/login')
  }

  if (!isAuthenticated) {
    return <div>Loading...</div>
  }

  const navItems = [
    { href: '/patient/dashboard', label: 'Dashboard', icon: Home },
    { href: '/patient/health-metrics', label: 'Health Metrics', icon: Heart },
    { href: '/patient/appointments', label: 'Appointments', icon: Calendar },
    { href: '/patient/medical-records', label: 'Medical Records', icon: FileText },
  ]

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Heart className="w-6 h-6 text-primary" />
          <span className="font-bold text-primary">TeleMed</span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2"
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`${
        isMobileMenuOpen ? 'block' : 'hidden'
      } md:block md:w-64 bg-sidebar border-r border-border`}>
        {/* Logo - Desktop Only */}
        <div className="hidden md:flex items-center gap-2 p-6 border-b border-border">
          <Heart className="w-6 h-6 text-sidebar-primary" />
          <h1 className="font-bold text-sidebar-primary">TeleMed</h1>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}>
                <button
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent/20'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              </Link>
            )
          })}
        </nav>

        {/* User Section */}
        <div className="absolute bottom-0 left-0 right-0 md:static p-4 border-t border-border bg-sidebar">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/20 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  )
}
