import SiteLayout from "@/components/site-layout"
import Link from "next/link"
import { ArrowRight, CheckCircle, BarChart3, Users, MessageSquare, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <SiteLayout>
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Revolutionize Your Customer Relationships
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                The all-in-one CRM solution powered by AI to help you manage customers, automate workflows, and grow
                your business exponentially.
              </p>
            </div>
            <div className="space-x-4">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30 hover:translate-y-[-2px] active:translate-y-[1px]"
                >
                  Start Your Free Trial <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full py-12 md:py-24 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                Features
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Everything You Need to Succeed</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Our platform combines powerful CRM capabilities with cutting-edge AI to give you the competitive edge.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mt-8">
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md hover:translate-y-[-2px]">
              <div className="rounded-full bg-primary/10 p-3">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Contact Management</h3>
              <p className="text-center text-muted-foreground">
                Store and manage customer details, interaction history, and preferences with ease.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md hover:translate-y-[-2px]">
              <div className="rounded-full bg-primary/10 p-3">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">AI-Powered Insights</h3>
              <p className="text-center text-muted-foreground">
                Leverage NLP and machine learning to gain actionable insights from customer data.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md hover:translate-y-[-2px]">
              <div className="rounded-full bg-primary/10 p-3">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Omnichannel Support</h3>
              <p className="text-center text-muted-foreground">
                Connect with customers across email, SMS, social media, and more from one platform.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md hover:translate-y-[-2px]">
              <div className="rounded-full bg-primary/10 p-3">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Advanced Analytics</h3>
              <p className="text-center text-muted-foreground">
                Make data-driven decisions with customizable dashboards and real-time reporting.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                Testimonials
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Trusted by Businesses Worldwide</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                See what our customers have to say about how our CRM has transformed their business.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
            <div className="flex flex-col justify-between space-y-4 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md">
              <div className="space-y-2">
                <div className="flex text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-5 w-5"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
                <p className="text-muted-foreground">
                  "CRMaster has completely transformed how we manage our customer relationships. The AI insights have
                  helped us increase our conversion rate by 35%."
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-primary/10 p-1 text-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-10 w-10"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium">Sarah Johnson</p>
                  <p className="text-sm text-muted-foreground">CEO, TechInnovate</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-between space-y-4 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md">
              <div className="space-y-2">
                <div className="flex text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-5 w-5"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
                <p className="text-muted-foreground">
                  "The omnichannel capabilities have allowed us to provide seamless customer service across all
                  platforms. Our customer satisfaction scores have never been higher."
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-primary/10 p-1 text-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-10 w-10"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium">Michael Chen</p>
                  <p className="text-sm text-muted-foreground">COO, Global Retail</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-between space-y-4 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md">
              <div className="space-y-2">
                <div className="flex text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-5 w-5"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
                <p className="text-muted-foreground">
                  "The predictive analytics have been a game-changer for our sales team. We can now anticipate customer
                  needs and close deals faster than ever before."
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-primary/10 p-1 text-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-10 w-10"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium">Emily Rodriguez</p>
                  <p className="text-sm text-muted-foreground">Sales Director, SaaS Solutions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="w-full py-12 md:py-24 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Ready to Transform Your Business?</h2>
              <p className="mx-auto max-w-[700px] md:text-xl">
                Join thousands of businesses that have already revolutionized their customer relationships with our
                platform.
              </p>
            </div>
            <div className="space-x-4">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  variant="secondary"
                  className="shadow-lg shadow-black/20 transition-all hover:shadow-xl hover:shadow-black/30 hover:translate-y-[-2px] active:translate-y-[1px]"
                >
                  Start Your Free Trial <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="flex items-center justify-center space-x-4 mt-4">
              <div className="flex items-center space-x-1">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">14-day free trial</span>
              </div>
              <div className="flex items-center space-x-1">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">No credit card required</span>
              </div>
              <div className="flex items-center space-x-1">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
