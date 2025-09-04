'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from '@/components/ui/navigation-menu'
import { useAuth } from '@/lib/auth-context'
import { Home, FileQuestion, BarChart3 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ThemeSwitcher } from './theme-switcher'

export function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
              <BarChart3 className="h-6 w-6" />
              <span>AI Coding Tools Survey</span>
            </Link>
            
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/" className={cn(
                      "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                      pathname === '/' && "bg-accent"
                    )}>
                      <Home className="mr-2 h-4 w-4" />
                      Home
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                
                {isAuthenticated && (
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link href="/survey" className={cn(
                        "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none",
                        pathname === '/survey' && "bg-accent"
                      )}>
                        <FileQuestion className="mr-2 h-4 w-4" />
                        Survey
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                )}
                
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/results" className={cn(
                      "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none",
                      pathname === '/results' && "bg-accent"
                    )}>
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Results
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          
          <div className="flex items-center gap-2">
            <ThemeSwitcher />
            {!isAuthenticated && (
              <Button 
                onClick={() => router.push('/auth')}
                variant="default"
                size="sm"
              >
                Enter Survey
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}