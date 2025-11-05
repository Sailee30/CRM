import SiteLayout from "@/components/site-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"

export default function AboutPage() {
  return (
    <SiteLayout>
      <section className="py-12 md:py-24 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">About CRMaster</h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                We're on a mission to revolutionize how businesses manage their customer relationships.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-12 md:grid-cols-2 md:gap-16">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tight">Our Story</h2>
              <p className="text-muted-foreground">
                Founded in 2018, CRMaster began with a simple idea: customer relationship management should be
                intuitive, powerful, and accessible to businesses of all sizes.
              </p>
              <p className="text-muted-foreground">
                Our founders, experienced in both enterprise software and small business needs, saw a gap in the market
                for a CRM solution that combined enterprise-level features with the simplicity and affordability that
                smaller organizations need.
              </p>
              <p className="text-muted-foreground">
                Today, CRMaster serves thousands of businesses worldwide, from startups to Fortune 500 companies, all
                using our platform to build stronger customer relationships and drive growth.
              </p>
            </div>
            <div className="relative aspect-video overflow-hidden rounded-xl">
              <img
                src="/placeholder.svg?height=720&width=1280"
                alt="CRMaster office"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-24 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Our Values</h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground">
              The principles that guide everything we do at CRMaster.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="bg-background">
              <CardContent className="p-6">
                <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
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
                    className="text-primary"
                  >
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                    <path d="m9 12 2 2 4-4"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Customer First</h3>
                <p className="text-muted-foreground">
                  We believe that our success is directly tied to the success of our customers. Every decision we make
                  is guided by what's best for the people who use our products.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-background">
              <CardContent className="p-6">
                <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
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
                    className="text-primary"
                  >
                    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Innovation</h3>
                <p className="text-muted-foreground">
                  We're constantly pushing the boundaries of what's possible in CRM technology. We embrace new ideas and
                  aren't afraid to challenge the status quo.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-background">
              <CardContent className="p-6">
                <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
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
                    className="text-primary"
                  >
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Transparency</h3>
                <p className="text-muted-foreground">
                  We believe in open communication with our customers, partners, and team members. We share our
                  successes and learn from our failures together.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Our Leadership Team</h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground">
              Meet the people driving CRMaster's vision and growth.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Sarah Johnson" />
                <AvatarFallback>SJ</AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-bold">Sarah Johnson</h3>
              <p className="text-muted-foreground mb-2">CEO & Co-Founder</p>
              <p className="text-sm text-muted-foreground">
                Former VP of Product at Salesforce with 15+ years in enterprise software.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Michael Chen" />
                <AvatarFallback>MC</AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-bold">Michael Chen</h3>
              <p className="text-muted-foreground mb-2">CTO & Co-Founder</p>
              <p className="text-sm text-muted-foreground">
                Previously led engineering teams at Google and Microsoft, specializing in AI and data systems.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Emily Rodriguez" />
                <AvatarFallback>ER</AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-bold">Emily Rodriguez</h3>
              <p className="text-muted-foreground mb-2">Chief Product Officer</p>
              <p className="text-sm text-muted-foreground">
                Product visionary with experience scaling SaaS platforms at Dropbox and Slack.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src="/placeholder.svg?height=96&width=96" alt="David Kim" />
                <AvatarFallback>DK</AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-bold">David Kim</h3>
              <p className="text-muted-foreground mb-2">Chief Revenue Officer</p>
              <p className="text-sm text-muted-foreground">
                Sales leader who previously built and scaled global sales teams at HubSpot and Zendesk.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-24 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">Join Our Team</h2>
              <p className="mx-auto max-w-[700px] md:text-xl">
                We're always looking for talented individuals to help us build the future of CRM.
              </p>
              <div className="flex justify-center pt-4">
                <Link href="/careers">
                  <Button variant="secondary" size="lg">
                    View Open Positions
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
