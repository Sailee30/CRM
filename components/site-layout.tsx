"use client"

import { type ReactNode, Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import ProductionChatWidget from "@/components/chatbot/production-chat-widget"
import { useAnalytics } from "@/hooks/use-analytics"

interface SiteLayoutProps {
  children: ReactNode
}

const navigation = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Products", href: "/products" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
]

// Create a client component that uses the analytics hook
function AnalyticsProvider({ children }: { children: ReactNode }) {
  const { trackEvent } = useAnalytics()

  // Track when the user interacts with navigation
  const handleNavClick = (name: string) => {
    trackEvent({
      name: "navigation_click",
      properties: { item: name },
    })
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative h-8 w-8 overflow-hidden rounded-full bg-gradient-to-br from-primary to-primary-foreground">
              <div className="absolute inset-0 flex items-center justify-center text-white font-bold">C</div>
            </div>
            <Link href="/" className="text-xl font-bold">
              CRMaster
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                onClick={() => handleNavClick(item.name)}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" className="hidden md:flex" onClick={() => trackEvent({ name: "login_click" })}>
                Log in
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button
                className="shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30 hover:translate-y-[-2px] active:translate-y-[1px]"
                onClick={() => trackEvent({ name: "get_started_click" })}
              >
                Get Started
              </Button>
            </Link>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col gap-4 mt-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-lg font-medium transition-colors hover:text-primary"
                      onClick={() => handleNavClick(item.name)}
                    >
                      {item.name}
                    </Link>
                  ))}
                  <div className="flex flex-col gap-2 mt-4">
                    <Link href="/dashboard">
                      <Button
                        variant="outline"
                        className="w-full bg-transparent"
                        onClick={() => trackEvent({ name: "mobile_login_click" })}
                      >
                        Log in
                      </Button>
                    </Link>
                    <Link href="/dashboard">
                      <Button className="w-full" onClick={() => trackEvent({ name: "mobile_get_started_click" })}>
                        Get Started
                      </Button>
                    </Link>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      {children}
      <footer className="border-t py-8 md:py-12">
        <div className="container grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative h-8 w-8 overflow-hidden rounded-full bg-gradient-to-br from-primary to-primary-foreground">
                <div className="absolute inset-0 flex items-center justify-center text-white font-bold">C</div>
              </div>
              <span className="text-xl font-bold">CRMaster</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Revolutionize your customer relationships with our all-in-one CRM solution.
            </p>
            <div className="flex space-x-4">
              <Link
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent({ name: "social_click", properties: { platform: "twitter" } })}
              >
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                  <span className="sr-only">Twitter</span>
                </Button>
              </Link>
              <Link
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent({ name: "social_click", properties: { platform: "facebook" } })}
              >
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                  <span className="sr-only">Facebook</span>
                </Button>
              </Link>
              <Link
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent({ name: "social_click", properties: { platform: "linkedin" } })}
              >
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                  <span className="sr-only">LinkedIn</span>
                </Button>
              </Link>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => trackEvent({ name: "footer_link_click", properties: { link: "about" } })}
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => trackEvent({ name: "footer_link_click", properties: { link: "careers" } })}
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => trackEvent({ name: "footer_link_click", properties: { link: "blog" } })}
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/press"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => trackEvent({ name: "footer_link_click", properties: { link: "press" } })}
                >
                  Press
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-4">Products</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/products/crm-pro"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => trackEvent({ name: "footer_link_click", properties: { link: "crm-pro" } })}
                >
                  CRM Pro
                </Link>
              </li>
              <li>
                <Link
                  href="/products/crm-lite"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => trackEvent({ name: "footer_link_click", properties: { link: "crm-lite" } })}
                >
                  CRM Lite
                </Link>
              </li>
              <li>
                <Link
                  href="/products/crm-mobile"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => trackEvent({ name: "footer_link_click", properties: { link: "crm-mobile" } })}
                >
                  CRM Mobile
                </Link>
              </li>
              <li>
                <Link
                  href="/products/pricing"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => trackEvent({ name: "footer_link_click", properties: { link: "pricing" } })}
                >
                  Pricing
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/support"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => trackEvent({ name: "footer_link_click", properties: { link: "support" } })}
                >
                  Support
                </Link>
              </li>
              <li>
                <Link
                  href="/documentation"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => trackEvent({ name: "footer_link_click", properties: { link: "documentation" } })}
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => trackEvent({ name: "footer_link_click", properties: { link: "contact" } })}
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => trackEvent({ name: "footer_link_click", properties: { link: "privacy" } })}
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="container mt-8 pt-8 border-t">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} CRMaster. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link
                href="/terms"
                className="text-sm text-muted-foreground hover:text-foreground"
                onClick={() => trackEvent({ name: "footer_link_click", properties: { link: "terms" } })}
              >
                Terms
              </Link>
              <Link
                href="/privacy"
                className="text-sm text-muted-foreground hover:text-foreground"
                onClick={() => trackEvent({ name: "footer_link_click", properties: { link: "privacy" } })}
              >
                Privacy
              </Link>
              <Link
                href="/cookies"
                className="text-sm text-muted-foreground hover:text-foreground"
                onClick={() => trackEvent({ name: "footer_link_click", properties: { link: "cookies" } })}
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}

// Main layout component that wraps the analytics provider in a suspense boundary
export default function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Suspense
        fallback={
          <header className="sticky top-0 z-50 w-full border-b bg-background/95 h-16">
            <div className="container flex h-16 items-center">
              <div className="flex items-center gap-2">
                <div className="relative h-8 w-8 overflow-hidden rounded-full bg-gradient-to-br from-primary to-primary-foreground">
                  <div className="absolute inset-0 flex items-center justify-center text-white font-bold">C</div>
                </div>
                <span className="text-xl font-bold">CRMaster</span>
              </div>
            </div>
          </header>
        }
      >
        <AnalyticsProvider>{children}</AnalyticsProvider>
      </Suspense>
      <ProductionChatWidget isAuthenticated={false} />
    </div>
  )
}
