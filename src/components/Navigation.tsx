'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { SURVEY_TITLE } from '@/lib/constants'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
import { useAuth } from '@/lib/auth-context'
import {
  FileQuestion,
  BarChart3,
  Menu,
  X,
  LogOut,
  TrendingUp,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ThemeSwitcher } from './theme-switcher'
import { ShareModal } from './ShareModal'

export function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const { isAuthenticated, logout, loading } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="flex items-center gap-2 font-semibold text-lg"
            >
              <BarChart3 className="h-6 w-6" />
              <span>{SURVEY_TITLE}</span>
            </Link>

            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList>
                {isAuthenticated && (
                  <>
                    <NavigationMenuItem>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/survey"
                          className={cn(
                            'group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none',
                            pathname === '/survey' && 'bg-accent'
                          )}
                        >
                          <FileQuestion className="mr-2 h-4 w-4" />
                          Survey
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/results"
                          className={cn(
                            'group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none',
                            pathname === '/results' && 'bg-accent'
                          )}
                        >
                          <BarChart3 className="mr-2 h-4 w-4" />
                          Results
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/trends"
                          className={cn(
                            'group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none',
                            pathname === '/trends' && 'bg-accent'
                          )}
                        >
                          <TrendingUp className="mr-2 h-4 w-4" />
                          Trends
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  </>
                )}

                {!isAuthenticated && (
                  <>
                    <NavigationMenuItem>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/results"
                          className={cn(
                            'group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none',
                            pathname === '/results' && 'bg-accent'
                          )}
                        >
                          <BarChart3 className="mr-2 h-4 w-4" />
                          Results
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/trends"
                          className={cn(
                            'group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none',
                            pathname === '/trends' && 'bg-accent'
                          )}
                        >
                          <TrendingUp className="mr-2 h-4 w-4" />
                          Trends
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  </>
                )}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && <ShareModal iconOnly />}
            <ThemeSwitcher />
            {!loading && isAuthenticated && (
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="hidden md:inline-flex"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            )}
            {!loading && !isAuthenticated && (
              <Button
                onClick={() => router.push('/auth')}
                variant="default"
                size="sm"
                className="hidden md:inline-flex"
              >
                Enter Survey
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t py-4 px-4 space-y-2">
            {isAuthenticated && (
              <>
                <Link
                  href="/survey"
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                    pathname === '/survey' && 'bg-accent'
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FileQuestion className="h-4 w-4" />
                  Survey
                </Link>

                <Link
                  href="/results"
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                    pathname === '/results' && 'bg-accent'
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <BarChart3 className="h-4 w-4" />
                  Results
                </Link>

                <Link
                  href="/trends"
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                    pathname === '/trends' && 'bg-accent'
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <TrendingUp className="h-4 w-4" />
                  Trends
                </Link>

                {!loading && (
                  <Button
                    onClick={() => {
                      handleLogout()
                      setMobileMenuOpen(false)
                    }}
                    variant="outline"
                    size="sm"
                    className="w-full mt-2 justify-start"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                )}
              </>
            )}

            {!isAuthenticated && (
              <>
                <Link
                  href="/results"
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                    pathname === '/results' && 'bg-accent'
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <BarChart3 className="h-4 w-4" />
                  Results
                </Link>

                <Link
                  href="/trends"
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                    pathname === '/trends' && 'bg-accent'
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <TrendingUp className="h-4 w-4" />
                  Trends
                </Link>

                {!loading && (
                  <Button
                    onClick={() => {
                      router.push('/auth')
                      setMobileMenuOpen(false)
                    }}
                    variant="default"
                    size="sm"
                    className="w-full mt-2"
                  >
                    Enter Survey
                  </Button>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
