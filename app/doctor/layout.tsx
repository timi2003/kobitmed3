'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Heart, TrendingUp, Users, Calendar, LogOut, Menu, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(true)
  const [doctorName, setDoctorName] = useState('Doctor')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const checkDoctorRole = async () => {
      try {
        const supabase = createClient()
        const { data: { session } } = await supabase.auth.getSession()

        if (!session) {
          router.replace('/auth/login')
          return
        }

        const user = session.user
        const userType = user.user_metadata?.user_type || user.user_metadata?.role

        if (userType !== 'doctor') {
          router.replace('/auth/login')
          return
        }

        // Set doctor name
        let name = 'Doctor'
        if (user.user_metadata?.full_name) name = user.user_metadata.full_name
        else if (user.user_metadata?.first_name) name = user.user_metadata.first_name
        else if (user.email) name = user.email.split('@')[0]

        setDoctorName(`Dr. ${name.split(' ')[0]}`)
      } catch (err) {
        console.error('Auth check failed:', err)
        router.replace('/auth/login')
      } finally {
        setIsLoading(false)
      }
    }

    checkDoctorRole()
  }, [router])

  // ==================== IMPROVED LOGOUT ====================
  const handleLogout = async () => {
    try {
      const supabase = createClient()

      // Sign out from Supabase
      await supabase.auth.signOut({ scope: 'global' })

      // Clear local storage
      localStorage.clear()

      // Hard redirect to prevent cached session issues
      window.location.href = '/auth/login?logout=true'
    } catch (err) {
      console.error('Logout error:', err)
      // Fallback redirect
      window.location.href = '/auth/login?logout=true'
    }
  }
  // =======================================================

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Verifying access...</p>
      </div>
    )
  }

  const navItems = [
    { href: '/doctor/dashboard', label: 'Dashboard', icon: TrendingUp },
    { href: '/doctor/patients', label: 'My Patients', icon: Users },
    { href: '/doctor/appointments', label: 'Appointments', icon: Calendar },
  ]

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Heart className="w-6 h-6 text-primary" />
          <span className="font-bold text-primary">Kobitmed</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          className="p-2"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:block md:w-64 bg-sidebar border-r border-border`}>
        <div className="hidden md:flex items-center gap-2 p-6 border-b border-border">
          <Heart className="w-6 h-6 text-primary" />
          <h1 className="font-bold text-xl">Kobitmed</h1>
        </div>

        <div className="p-6 border-b border-border md:block hidden">
          <p className="text-sm text-muted-foreground">Welcome back,</p>
          <p className="font-semibold text-lg">{doctorName}</p>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}>
                <button
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-accent'
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

        {/* Logout Button */}
        <div className="absolute bottom-0 left-0 right-0 md:static p-4 border-t border-border">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-destructive/10 text-destructive hover:text-destructive transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-4 md:p-8">
        {children}
      </div>
    </div>
  )
}