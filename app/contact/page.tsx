"use client"

import { useState } from "react"
import SiteLayout from "@/components/site-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { Mail, Phone, MapPin, Clock } from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    subject: "",
    message: "",
    marketing: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (checked) => {
    setFormData((prev) => ({ ...prev, marketing: checked }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Show success toast
    toast({
      title: "Message sent!",
      description: "We'll get back to you as soon as possible.",
    })

    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      company: "",
      subject: "",
      message: "",
      marketing: false,
    })

    setIsSubmitting(false)
  }

  return (
    <SiteLayout>
      <section className="py-12 md:py-24 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Contact Us</h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Have questions or need assistance? We're here to help. Reach out to our team.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Get in Touch</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        placeholder="+1 (555) 123-4567"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        name="company"
                        placeholder="Your Company"
                        value={formData.company}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Select value={formData.subject} onValueChange={(value) => handleSelectChange("subject", value)}>
                      <SelectTrigger id="subject">
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="sales">Sales</SelectItem>
                        <SelectItem value="support">Technical Support</SelectItem>
                        <SelectItem value="billing">Billing</SelectItem>
                        <SelectItem value="partnership">Partnership</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="How can we help you?"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="marketing" checked={formData.marketing} onCheckedChange={handleCheckboxChange} />
                    <Label htmlFor="marketing" className="text-sm">
                      I agree to receive marketing communications from CRMaster.
                    </Label>
                  </div>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium">Email</h3>
                      <p className="text-muted-foreground">info@crmmaster.com</p>
                      <p className="text-muted-foreground">support@crmmaster.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium">Phone</h3>
                      <p className="text-muted-foreground">+1 (555) 123-4567</p>
                      <p className="text-muted-foreground">+1 (555) 987-6543</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium">Address</h3>
                      <p className="text-muted-foreground">
                        123 Tech Avenue, Suite 400
                        <br />
                        San Francisco, CA 94107
                        <br />
                        United States
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium">Business Hours</h3>
                      <p className="text-muted-foreground">
                        Monday - Friday: 9:00 AM - 6:00 PM (PST)
                        <br />
                        Saturday - Sunday: Closed
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">How quickly will I receive a response?</h3>
                    <p className="text-muted-foreground">
                      We aim to respond to all inquiries within 24 hours during business days.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium">Do you offer phone support?</h3>
                    <p className="text-muted-foreground">
                      Yes, phone support is available for all paid plans during business hours.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium">Can I schedule a demo?</h3>
                    <p className="text-muted-foreground">
                      You can request a demo through this contact form or by emailing sales@crmmaster.com.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-24 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">Our Locations</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground">
                CRMaster has offices around the world to serve our global customer base.
              </p>
            </div>
          </div>
          <div className="mt-12 aspect-video w-full rounded-xl overflow-hidden border">
            {/* This would be a Google Maps embed in a real implementation */}
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <p className="text-muted-foreground">Interactive map would be displayed here</p>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
