"use client"

import { useState } from "react"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Plus,
  Search,
  MoreHorizontal,
  Mail,
  Phone,
  Filter,
  Download,
  Upload,
  Tags,
  UserPlus,
  ChevronDown,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import ContactForm from "@/components/contacts/contact-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

// Sample data
const initialContacts = [
  {
    id: "1",
    name: "Alex Johnson",
    email: "alex@example.com",
    phone: "+1 (555) 123-4567",
    company: "TechCorp",
    status: "Customer",
    lastContact: "2 days ago",
    avatar: "/placeholder.svg?height=40&width=40",
    tags: ["VIP", "Tech"],
    score: 85,
    activity: "High",
    location: "New York, USA",
    source: "Website",
    assignedTo: "Jamie Brown",
    notes: "Key decision maker for enterprise deals",
    lifetime: "$24,500",
  },
  {
    id: "2",
    name: "Sam Williams",
    email: "sam@example.com",
    phone: "+1 (555) 765-4321",
    company: "Marketing Pro",
    status: "Lead",
    lastContact: "Today",
    avatar: "/placeholder.svg?height=40&width=40",
    tags: ["Marketing", "New"],
    score: 65,
    activity: "Medium",
    location: "Chicago, USA",
    source: "Referral",
    assignedTo: "Taylor Smith",
    notes: "Interested in marketing automation features",
    lifetime: "$0",
  },
  {
    id: "3",
    name: "Taylor Smith",
    email: "taylor@example.com",
    phone: "+1 (555) 987-6543",
    company: "Design Studio",
    status: "Prospect",
    lastContact: "1 week ago",
    avatar: "/placeholder.svg?height=40&width=40",
    tags: ["Design", "SMB"],
    score: 45,
    activity: "Low",
    location: "Los Angeles, USA",
    source: "LinkedIn",
    assignedTo: "Alex Johnson",
    notes: "Looking for design collaboration tools",
    lifetime: "$0",
  },
  {
    id: "4",
    name: "Jamie Brown",
    email: "jamie@example.com",
    phone: "+1 (555) 456-7890",
    company: "Finance Inc.",
    status: "Customer",
    lastContact: "3 days ago",
    avatar: "/placeholder.svg?height=40&width=40",
    tags: ["Finance", "Enterprise"],
    score: 92,
    activity: "High",
    location: "Boston, USA",
    source: "Conference",
    assignedTo: "Jordan Miller",
    notes: "Renewed enterprise contract for 2 years",
    lifetime: "$78,900",
  },
  {
    id: "5",
    name: "Jordan Miller",
    email: "jordan@example.com",
    phone: "+1 (555) 789-0123",
    company: "Healthcare Plus",
    status: "Lead",
    lastContact: "Yesterday",
    avatar: "/placeholder.svg?height=40&width=40",
    tags: ["Healthcare", "Enterprise"],
    score: 78,
    activity: "High",
    location: "Seattle, USA",
    source: "Webinar",
    assignedTo: "Sam Williams",
    notes: "Evaluating solutions for patient management",
    lifetime: "$0",
  },
  {
    id: "6",
    name: "Morgan Lee",
    email: "morgan@example.com",
    phone: "+1 (555) 234-5678",
    company: "Retail Giant",
    status: "Customer",
    lastContact: "5 days ago",
    avatar: "/placeholder.svg?height=40&width=40",
    tags: ["Retail", "VIP"],
    score: 88,
    activity: "Medium",
    location: "Miami, USA",
    source: "Email Campaign",
    assignedTo: "Alex Johnson",
    notes: "Expanding to multiple locations next quarter",
    lifetime: "$45,750",
  },
  {
    id: "7",
    name: "Casey Wilson",
    email: "casey@example.com",
    phone: "+1 (555) 345-6789",
    company: "Education First",
    status: "Prospect",
    lastContact: "2 weeks ago",
    avatar: "/placeholder.svg?height=40&width=40",
    tags: ["Education", "Non-profit"],
    score: 52,
    activity: "Low",
    location: "Denver, USA",
    source: "Trade Show",
    assignedTo: "Jamie Brown",
    notes: "Looking for student management solutions",
    lifetime: "$0",
  },
  {
    id: "8",
    name: "Riley Thompson",
    email: "riley@example.com",
    phone: "+1 (555) 456-7890",
    company: "Tech Innovators",
    status: "Lead",
    lastContact: "4 days ago",
    avatar: "/placeholder.svg?height=40&width=40",
    tags: ["Tech", "Startup"],
    score: 71,
    activity: "Medium",
    location: "Austin, USA",
    source: "Blog Signup",
    assignedTo: "Taylor Smith",
    notes: "Startup looking for scalable CRM solution",
    lifetime: "$0",
  },
  {
    id: "9",
    name: "Avery Martinez",
    email: "avery@example.com",
    phone: "+1 (555) 567-8901",
    company: "Legal Solutions",
    status: "Customer",
    lastContact: "Yesterday",
    avatar: "/placeholder.svg?height=40&width=40",
    tags: ["Legal", "Professional"],
    score: 90,
    activity: "High",
    location: "Washington DC, USA",
    source: "Partner Referral",
    assignedTo: "Jordan Miller",
    notes: "Law firm with multiple branches using our platform",
    lifetime: "$62,300",
  },
  {
    id: "10",
    name: "Quinn Anderson",
    email: "quinn@example.com",
    phone: "+1 (555) 678-9012",
    company: "Manufacturing Co",
    status: "Prospect",
    lastContact: "1 week ago",
    avatar: "/placeholder.svg?height=40&width=40",
    tags: ["Manufacturing", "Enterprise"],
    score: 58,
    activity: "Medium",
    location: "Detroit, USA",
    source: "Google Ads",
    assignedTo: "Sam Williams",
    notes: "Interested in inventory management integration",
    lifetime: "$0",
  },
]

export default function ContactsPage() {
  const [contacts, setContacts] = useState(initialContacts)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddContactOpen, setIsAddContactOpen] = useState(false)
  const [selectedContacts, setSelectedContacts] = useState([])
  const [statusFilter, setStatusFilter] = useState("all")
  const [tagFilter, setTagFilter] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState("asc")
  const { toast } = useToast()

  // Filter contacts based on search term, status, and tags
  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || contact.status === statusFilter

    const matchesTag = tagFilter === "all" || (contact.tags && contact.tags.includes(tagFilter))

    return matchesSearch && matchesStatus && matchesTag
  })

  // Sort contacts
  const sortedContacts = [...filteredContacts].sort((a, b) => {
    let comparison = 0

    if (sortBy === "name") {
      comparison = a.name.localeCompare(b.name)
    } else if (sortBy === "company") {
      comparison = a.company.localeCompare(b.company)
    } else if (sortBy === "status") {
      comparison = a.status.localeCompare(b.status)
    } else if (sortBy === "score") {
      comparison = a.score - b.score
    } else if (sortBy === "lastContact") {
      // This is a simplification - in a real app, you'd parse dates properly
      comparison = a.lastContact.localeCompare(b.lastContact)
    }

    return sortOrder === "asc" ? comparison : -comparison
  })

  const handleAddContact = (newContact) => {
    const contactWithId = {
      id: (contacts.length + 1).toString(),
      ...newContact,
      lastContact: "Just now",
      avatar: "/placeholder.svg?height=40&width=40",
      score: Math.floor(Math.random() * 50) + 50, // Random score between 50-100
      activity: "Medium",
      tags: newContact.tags || [],
      lifetime: "$0",
    }
    setContacts([contactWithId, ...contacts])
    setIsAddContactOpen(false)

    toast({
      title: "Contact added",
      description: `${newContact.name} has been added to your contacts.`,
    })
  }

  const handleSelectContact = (contactId) => {
    setSelectedContacts((prev) => {
      if (prev.includes(contactId)) {
        return prev.filter((id) => id !== contactId)
      } else {
        return [...prev, contactId]
      }
    })
  }

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedContacts(sortedContacts.map((contact) => contact.id))
    } else {
      setSelectedContacts([])
    }
  }

  const handleBulkAction = (action) => {
    if (selectedContacts.length === 0) {
      toast({
        title: "No contacts selected",
        description: "Please select at least one contact to perform this action.",
        variant: "destructive",
      })
      return
    }

    let message = ""
    switch (action) {
      case "delete":
        setContacts(contacts.filter((contact) => !selectedContacts.includes(contact.id)))
        message = `${selectedContacts.length} contact(s) deleted`
        break
      case "export":
        message = `${selectedContacts.length} contact(s) exported`
        break
      case "tag":
        message = `${selectedContacts.length} contact(s) tagged`
        break
      case "assign":
        message = `${selectedContacts.length} contact(s) assigned`
        break
    }

    toast({
      title: "Action completed",
      description: message,
    })

    setSelectedContacts([])
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Customer":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20"
      case "Lead":
        return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
      case "Prospect":
        return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20"
    }
  }

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-500"
    if (score >= 60) return "text-yellow-500"
    return "text-red-500"
  }

  const getActivityColor = (activity) => {
    switch (activity) {
      case "High":
        return "bg-green-500/10 text-green-500"
      case "Medium":
        return "bg-yellow-500/10 text-yellow-500"
      case "Low":
        return "bg-red-500/10 text-red-500"
      default:
        return "bg-gray-500/10 text-gray-500"
    }
  }

  // Get all unique tags from contacts
  const allTags = [...new Set(contacts.flatMap((contact) => contact.tags || []))]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Contacts</h2>
          <p className="text-muted-foreground">Manage your customers, leads, and prospects</p>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="all">All Contacts</TabsTrigger>
              <TabsTrigger value="customers">Customers</TabsTrigger>
              <TabsTrigger value="leads">Leads</TabsTrigger>
              <TabsTrigger value="prospects">Prospects</TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <Dialog open={isAddContactOpen} onOpenChange={setIsAddContactOpen}>
                <DialogTrigger asChild>
                  <Button className="shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30 hover:translate-y-[-2px] active:translate-y-[1px]">
                    <Plus className="mr-2 h-4 w-4" /> Add Contact
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Add New Contact</DialogTitle>
                  </DialogHeader>
                  <ContactForm onSubmit={handleAddContact} onCancel={() => setIsAddContactOpen(false)} />
                </DialogContent>
              </Dialog>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" /> Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleBulkAction("export")}>Export Selected</DropdownMenuItem>
                  <DropdownMenuItem>Export All Contacts</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Export as CSV</DropdownMenuItem>
                  <DropdownMenuItem>Export as Excel</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" /> Import
              </Button>
            </div>
          </div>

          <Card className="transform transition-all duration-300 hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Contact Management</CardTitle>

                {selectedContacts.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{selectedContacts.length} selected</span>
                    <Button variant="outline" size="sm" onClick={() => handleBulkAction("tag")}>
                      <Tags className="mr-2 h-4 w-4" /> Tag
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleBulkAction("assign")}>
                      <UserPlus className="mr-2 h-4 w-4" /> Assign
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleBulkAction("delete")}>
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search contacts..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="Customer">Customer</SelectItem>
                        <SelectItem value="Lead">Lead</SelectItem>
                        <SelectItem value="Prospect">Prospect</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={tagFilter} onValueChange={setTagFilter}>
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="Tag" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Tags</SelectItem>
                        {allTags.map((tag) => (
                          <SelectItem key={tag} value={tag}>
                            {tag}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="flex gap-2">
                          <Filter className="h-4 w-4" /> More Filters
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[200px]">
                        <DropdownMenuLabel>Filter By</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Location</DropdownMenuItem>
                        <DropdownMenuItem>Lead Score</DropdownMenuItem>
                        <DropdownMenuItem>Last Activity</DropdownMenuItem>
                        <DropdownMenuItem>Source</DropdownMenuItem>
                        <DropdownMenuItem>Assigned To</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="flex gap-2">
                          <ChevronDown className="h-4 w-4" /> Sort: {sortBy}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setSortBy("name")}>
                          Name {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSortBy("company")}>
                          Company {sortBy === "company" && (sortOrder === "asc" ? "↑" : "↓")}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSortBy("status")}>
                          Status {sortBy === "status" && (sortOrder === "asc" ? "↑" : "↓")}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSortBy("score")}>
                          Lead Score {sortBy === "score" && (sortOrder === "asc" ? "↑" : "↓")}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSortBy("lastContact")}>
                          Last Contact {sortBy === "lastContact" && (sortOrder === "asc" ? "↑" : "↓")}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
                          {sortOrder === "asc" ? "Sort Descending" : "Sort Ascending"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">
                          <Checkbox
                            checked={selectedContacts.length === sortedContacts.length && sortedContacts.length > 0}
                            onCheckedChange={handleSelectAll}
                            aria-label="Select all contacts"
                          />
                        </TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead className="hidden md:table-cell">Company</TableHead>
                        <TableHead className="hidden md:table-cell">Status</TableHead>
                        <TableHead className="hidden lg:table-cell">Lead Score</TableHead>
                        <TableHead className="hidden lg:table-cell">Tags</TableHead>
                        <TableHead className="hidden xl:table-cell">Activity</TableHead>
                        <TableHead className="hidden md:table-cell">Last Contact</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedContacts.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center py-8">
                            <div className="flex flex-col items-center justify-center text-muted-foreground">
                              <Search className="h-8 w-8 mb-2" />
                              <p>No contacts found</p>
                              <p className="text-sm">Try adjusting your search or filters</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        sortedContacts.map((contact) => (
                          <TableRow key={contact.id} className="transition-colors hover:bg-muted/30 group">
                            <TableCell>
                              <Checkbox
                                checked={selectedContacts.includes(contact.id)}
                                onCheckedChange={() => handleSelectContact(contact.id)}
                                aria-label={`Select ${contact.name}`}
                              />
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="transition-transform group-hover:scale-105">
                                  <AvatarImage src={contact.avatar} alt={contact.name} />
                                  <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{contact.name}</div>
                                  <div className="text-sm text-muted-foreground">{contact.email}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <div className="font-medium">{contact.company}</div>
                              <div className="text-xs text-muted-foreground">{contact.location}</div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <Badge
                                variant="outline"
                                className={`transition-colors ${getStatusColor(contact.status)}`}
                              >
                                {contact.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="hidden lg:table-cell">
                              <div className="flex items-center gap-2">
                                <div className="w-10 h-2 rounded-full bg-muted overflow-hidden">
                                  <div
                                    className={`h-full ${
                                      contact.score >= 80
                                        ? "bg-green-500"
                                        : contact.score >= 60
                                          ? "bg-yellow-500"
                                          : "bg-red-500"
                                    }`}
                                    style={{ width: `${contact.score}%` }}
                                  ></div>
                                </div>
                                <span className={`text-sm font-medium ${getScoreColor(contact.score)}`}>
                                  {contact.score}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="hidden lg:table-cell">
                              <div className="flex flex-wrap gap-1">
                                {contact.tags &&
                                  contact.tags.map((tag, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                              </div>
                            </TableCell>
                            <TableCell className="hidden xl:table-cell">
                              <Badge
                                variant="outline"
                                className={`transition-colors ${getActivityColor(contact.activity)}`}
                              >
                                {contact.activity}
                              </Badge>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">{contact.lastContact}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="transition-transform hover:text-primary hover:translate-y-[-2px] active:translate-y-[1px]"
                                >
                                  <Mail className="h-4 w-4" />
                                  <span className="sr-only">Email</span>
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="transition-transform hover:text-primary hover:translate-y-[-2px] active:translate-y-[1px]"
                                >
                                  <Phone className="h-4 w-4" />
                                  <span className="sr-only">Call</span>
                                </Button>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="transition-transform hover:text-primary hover:translate-y-[-2px] active:translate-y-[1px]"
                                    >
                                      <MoreHorizontal className="h-4 w-4" />
                                      <span className="sr-only">More options</span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>View Profile</DropdownMenuItem>
                                    <DropdownMenuItem>Edit Contact</DropdownMenuItem>
                                    <DropdownMenuItem>Add Task</DropdownMenuItem>
                                    <DropdownMenuItem>Add Note</DropdownMenuItem>
                                    <DropdownMenuItem>Add to Campaign</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-destructive">Delete Contact</DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>

          <TabsContent value="all">{/* Content for All Contacts tab */}</TabsContent>
          <TabsContent value="customers">{/* Content for Customers tab */}</TabsContent>
          <TabsContent value="leads">{/* Content for Leads tab */}</TabsContent>
          <TabsContent value="prospects">{/* Content for Prospects tab */}</TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
