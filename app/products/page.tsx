import SiteLayout from "@/components/site-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function ProductsPage() {
  return (
    <SiteLayout>
      <section className="py-12 md:py-24 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Our Products</h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Powerful CRM solutions designed to meet the needs of businesses of all sizes.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-3">
            <Card className="flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">CRM Lite</CardTitle>
                    <CardDescription>For small businesses and startups</CardDescription>
                  </div>
                  <Badge variant="outline" className="text-sm">
                    Popular
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="flex items-baseline mb-4">
                  <span className="text-3xl font-bold">$49</span>
                  <span className="text-muted-foreground ml-1">/month</span>
                </div>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>Up to 1,000 contacts</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>Basic contact management</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>Email integration</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>Task management</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>Mobile app access</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>Standard reports</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Get Started</Button>
              </CardFooter>
            </Card>

            <Card className="flex flex-col border-primary relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </div>
              <CardHeader>
                <div>
                  <CardTitle className="text-2xl">CRM Pro</CardTitle>
                  <CardDescription>For growing businesses</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="flex items-baseline mb-4">
                  <span className="text-3xl font-bold">$99</span>
                  <span className="text-muted-foreground ml-1">/month</span>
                </div>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>Unlimited contacts</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>Advanced contact management</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>Email and SMS integration</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>Sales pipeline management</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>Marketing automation</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>Advanced analytics</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>API access</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>Priority support</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Get Started</Button>
              </CardFooter>
            </Card>

            <Card className="flex flex-col">
              <CardHeader>
                <div>
                  <CardTitle className="text-2xl">CRM Enterprise</CardTitle>
                  <CardDescription>For large organizations</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="flex items-baseline mb-4">
                  <span className="text-3xl font-bold">$249</span>
                  <span className="text-muted-foreground ml-1">/month</span>
                </div>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>Everything in CRM Pro</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>Enterprise-grade security</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>Advanced permissions</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>Custom integrations</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>Dedicated account manager</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>24/7 premium support</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>Custom reporting</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>AI-powered insights</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Contact Sales</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-24 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Key Features</h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground">
              Discover what makes CRMaster the preferred choice for businesses worldwide.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Contact Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Store and manage customer details, interaction history, and preferences with ease. Keep all your
                  customer data organized in one place.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Sales Pipeline</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Track and manage your deals through every stage of the sales process. Get a clear view of your sales
                  pipeline and forecast future revenue.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Task Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Never miss a follow-up with our comprehensive task management system. Assign tasks, set reminders, and
                  track progress.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Email Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Connect your email accounts to send and receive emails directly from CRMaster. Keep all your
                  communications in one place.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Analytics & Reporting</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Make data-driven decisions with our powerful analytics and reporting tools. Create custom reports and
                  dashboards to track your KPIs.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>AI-Powered Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Leverage the power of AI to gain actionable insights from your customer data. Predict customer
                  behavior and identify opportunities.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Frequently Asked Questions</h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground">
              Find answers to common questions about our products and services.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
            <div>
              <h3 className="text-xl font-bold mb-2">How long is the free trial?</h3>
              <p className="text-muted-foreground">
                We offer a 14-day free trial for all our plans. No credit card required. You can upgrade to a paid plan
                at any time during or after your trial.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Can I change plans later?</h3>
              <p className="text-muted-foreground">
                Yes, you can upgrade or downgrade your plan at any time. If you upgrade, the new charges will be
                prorated for the remainder of your billing cycle.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Is there a setup fee?</h3>
              <p className="text-muted-foreground">
                No, there are no setup fees for any of our plans. You only pay the monthly or annual subscription fee.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">What payment methods do you accept?</h3>
              <p className="text-muted-foreground">
                We accept all major credit cards, PayPal, and bank transfers for annual plans. For Enterprise plans, we
                also offer invoicing.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Can I import my existing data?</h3>
              <p className="text-muted-foreground">
                Yes, CRMaster makes it easy to import your existing data from CSV files, Excel, or directly from other
                CRM systems like Salesforce, HubSpot, or Zoho.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Is my data secure?</h3>
              <p className="text-muted-foreground">
                Absolutely. We use industry-standard encryption and security practices to protect your data. We are GDPR
                compliant and offer features to help you maintain compliance.
              </p>
            </div>
          </div>
          <div className="flex justify-center mt-12">
            <Link href="/contact">
              <Button>
                Still have questions? Contact us <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
