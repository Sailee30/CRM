"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ThemeProvider } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import {
  BarChart3,
  Bell,
  Calendar,
  ChevronLeft,
  ChevronRight,
  UserCircle,
  Home,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  Users,
  Moon,
  Sun,
  Search,
  PlusCircle,
  CreditCard,
  DollarSign,
  HelpCircle,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useMobile } from "@/hooks/use-mobile"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Contacts", href: "/contacts", icon: Users },
  { name: "Sales", href: "/sales", icon: DollarSign },
  { name: "Tasks", href: "/tasks", icon: Calendar },
  { name: "Messages", href: "/messages", icon: MessageSquare },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
]

export default function DashboardLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false)
  const [theme, setTheme] = useState("light")
  const pathname = usePathname()
  const { toast } = useToast()
  const isMobile = useMobile()

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    document.documentElement.classList.toggle("dark")
  }

  useEffect(() => {
    // Set initial theme based on system preference or saved preference
    const savedTheme = localStorage.getItem("theme") || "light"
    setTheme(savedTheme)

    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark")
    }
  }, [])

  const showNotification = () => {
    toast({
      title: "New message",
      description: "You have 3 unread messages in your inbox",
    })
  }

  // Determine if sidebar should be collapsed by default on mobile
  useEffect(() => {
    setCollapsed(isMobile)
  }, [isMobile])

  // Sidebar content shared between desktop and mobile views
  const SidebarContent = () => (
    <div className="flex h-full flex-col gap-2">
      <div className="flex h-14 items-center px-3.5 py-4 border-b">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <div className="rounded-md bg-primary p-1.5 text-primary-foreground">
            <CreditCard className="h-5 w-5" />
          </div>
          {!collapsed && <span className="text-xl">CRM Pro</span>}
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 gap-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary",
                  isActive ? "bg-muted font-medium" : "text-muted-foreground",
                  collapsed && "justify-center px-2",
                )}
              >
                <item.icon className={cn("h-5 w-5", collapsed && "h-6 w-6")} />
                {!collapsed && <span>{item.name}</span>}
                {!collapsed && item.name === "Messages" && (
                  <Badge className="ml-auto py-0.5 px-1.5" variant="outline">
                    5
                  </Badge>
                )}
              </Link>
            )
          })}
        </nav>
      </div>
      <div className="mt-auto border-t p-2">
        <div
          className={cn(
            "flex items-center justify-between gap-2 rounded-lg p-2 hover:bg-muted",
            collapsed && "flex-col",
          )}
        >
          <div className={cn("flex items-center gap-2", collapsed && "flex-col")}>
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="grid gap-0.5">
                <div className="font-medium">John Doe</div>
                <div className="text-xs text-muted-foreground">john@example.com</div>
              </div>
            )}
          </div>
          {!collapsed && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" /> Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <ThemeProvider>
      <div className="flex min-h-screen bg-background">
        {/* Desktop sidebar */}
        <div
          className={cn(
            "hidden border-r bg-background transition-all duration-300 lg:block",
            collapsed ? "w-16" : "w-56",
          )}
        >
          <SidebarContent />
          <Button
            variant="ghost"
            size="icon"
            className="absolute bottom-4 right-0 translate-x-1/2 rounded-full border shadow-md bg-background"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Mobile sidebar */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open Menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <SidebarContent />
          </SheetContent>
        </Sheet>

        {/* Main content */}
        <div className="flex w-full flex-1 flex-col">
          {/* Top nav */}
          <header className="sticky top-0 z-10 border-b bg-background">
            <div className="flex h-16 items-center gap-2 px-4 sm:px-6">
              <div className="flex items-center gap-2 lg:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="mr-2" aria-label="Open Menu">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="p-0">
                    <SidebarContent />
                  </SheetContent>
                </Sheet>
                <Link href="/" className="flex items-center gap-2 font-semibold">
                  <div className="rounded-md bg-primary p-1 text-primary-foreground">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <span className="font-bold">CRM Pro</span>
                </Link>
              </div>

              <div className="relative flex-1 ml-2 mr-2">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search everything..."
                  className="w-full bg-background pl-8 md:max-w-sm"
                />
              </div>

              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full">
                      <PlusCircle className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <UserCircle className="mr-2 h-4 w-4" /> New Contact
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <DollarSign className="mr-2 h-4 w-4" /> New Deal
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Calendar className="mr-2 h-4 w-4" /> New Task
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <MessageSquare className="mr-2 h-4 w-4" /> New Message
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button variant="ghost" size="icon" className="rounded-full" onClick={toggleTheme}>
                  {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                </Button>

                <Button variant="ghost" size="icon" className="rounded-full" onClick={showNotification}>
                  <div className="relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                      3
                    </span>
                  </div>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <UserCircle className="mr-2 h-4 w-4" /> Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" /> Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <HelpCircle className="mr-2 h-4 w-4" /> Help & Support
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <LogOut className="mr-2 h-4 w-4" /> Log Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">{children}</main>
        </div>
      </div>
    </ThemeProvider>
  )
}
