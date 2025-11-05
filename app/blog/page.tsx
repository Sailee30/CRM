import SiteLayout from "@/components/site-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowRight, Search } from "lucide-react"
import Link from "next/link"

// Sample blog posts data
const blogPosts = [
  {
    id: 1,
    title: "10 Ways to Improve Your Customer Relationships",
    excerpt: "Discover proven strategies to strengthen your customer relationships and boost retention rates.",
    date: "May 15, 2023",
    author: {
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    category: "Customer Success",
    image: "/placeholder.svg?height=400&width=600",
    readTime: "5 min read",
  },
  {
    id: 2,
    title: "The Future of CRM: AI and Machine Learning",
    excerpt:
      "Explore how artificial intelligence and machine learning are revolutionizing customer relationship management.",
    date: "April 28, 2023",
    author: {
      name: "Michael Chen",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    category: "Technology",
    image: "/placeholder.svg?height=400&width=600",
    readTime: "8 min read",
  },
  {
    id: 3,
    title: "Building an Effective Sales Pipeline",
    excerpt: "Learn how to create and optimize your sales pipeline to close more deals and increase revenue.",
    date: "April 10, 2023",
    author: {
      name: "Emily Rodriguez",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    category: "Sales",
    image: "/placeholder.svg?height=400&width=600",
    readTime: "6 min read",
  },
  {
    id: 4,
    title: "Data-Driven Decision Making for Sales Teams",
    excerpt: "How to leverage your CRM data to make better decisions and improve sales performance.",
    date: "March 22, 2023",
    author: {
      name: "David Kim",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    category: "Analytics",
    image: "/placeholder.svg?height=400&width=600",
    readTime: "7 min read",
  },
  {
    id: 5,
    title: "Customer Segmentation Strategies That Work",
    excerpt: "Effective ways to segment your customer base for more targeted marketing and personalized experiences.",
    date: "March 15, 2023",
    author: {
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    category: "Marketing",
    image: "/placeholder.svg?height=400&width=600",
    readTime: "5 min read",
  },
  {
    id: 6,
    title: "Integrating Your CRM with Marketing Automation",
    excerpt: "A step-by-step guide to connecting your CRM with marketing automation tools for seamless workflows.",
    date: "February 28, 2023",
    author: {
      name: "Michael Chen",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    category: "Integration",
    image: "/placeholder.svg?height=400&width=600",
    readTime: "9 min read",
  },
]

// Sample categories
const categories = ["All", "Customer Success", "Technology", "Sales", "Marketing", "Analytics", "Integration"]

export default function BlogPage() {
  return (
    <SiteLayout>
      <section className="py-12 md:py-24 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">CRMaster Blog</h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Insights, tips, and best practices for optimizing your customer relationships.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-3/4">
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {blogPosts.map((post) => (
                  <Card key={post.id} className="flex flex-col overflow-hidden">
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={post.image || "/placeholder.svg"}
                        alt={post.title}
                        className="object-cover w-full h-full transition-transform hover:scale-105"
                      />
                    </div>
                    <CardHeader className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">{post.category}</Badge>
                        <span className="text-xs text-muted-foreground">{post.readTime}</span>
                      </div>
                      <CardTitle className="text-xl">{post.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 flex-1">
                      <CardDescription className="mb-4">{post.excerpt}</CardDescription>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={post.author.avatar} alt={post.author.name} />
                          <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="text-sm">{post.author.name}</div>
                      </div>
                      <div className="text-xs text-muted-foreground">{post.date}</div>
                    </CardFooter>
                    <Link href={`/blog/${post.id}`} className="absolute inset-0">
                      <span className="sr-only">View Article</span>
                    </Link>
                  </Card>
                ))}
              </div>
              <div className="flex justify-center mt-8">
                <Button variant="outline">Load More Articles</Button>
              </div>
            </div>
            <div className="md:w-1/4">
              <div className="sticky top-24 space-y-8">
                <div>
                  <h3 className="text-lg font-medium mb-4">Search</h3>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input type="search" placeholder="Search articles..." className="pl-8" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-4">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <Badge
                        key={category}
                        variant={category === "All" ? "default" : "outline"}
                        className="cursor-pointer"
                      >
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-4">Popular Articles</h3>
                  <div className="space-y-4">
                    {blogPosts.slice(0, 3).map((post) => (
                      <div key={`popular-${post.id}`} className="flex gap-3">
                        <div className="relative w-16 h-16 flex-shrink-0 overflow-hidden rounded-md">
                          <img
                            src={post.image || "/placeholder.svg"}
                            alt={post.title}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium line-clamp-2">{post.title}</h4>
                          <p className="text-xs text-muted-foreground mt-1">{post.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-4">Subscribe</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Get the latest articles and insights delivered to your inbox.
                  </p>
                  <div className="space-y-2">
                    <Input type="email" placeholder="Your email address" />
                    <Button className="w-full">
                      Subscribe <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
