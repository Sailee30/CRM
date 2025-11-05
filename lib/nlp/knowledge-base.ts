// Knowledge base for RAG and FAQ retrieval
export interface KBArticle {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  embedding?: number[] // Vector embedding for similarity search
}

import { createSimpleEmbedding } from '@/lib/ml/vector-search'

function initializeEmbeddings(): void {
  for (const article of knowledgeBase) {
    if (!article.embedding) {
      article.embedding = createSimpleEmbedding(article.title + ' ' + article.content)
    }
  }
}

export const knowledgeBase: KBArticle[] = [
  {
    id: "kb-001",
    title: "How to Update Contact Information",
    content: `
      To update a contact in CRMaster:
      1. Navigate to the Contacts page
      2. Click on the contact you want to edit
      3. Click the Edit button (pencil icon)
      4. Modify the fields you want to update
      5. Click Save to commit changes
      
      If the Save button doesn't work:
      - Check your internet connection
      - Clear browser cache and reload
      - Ensure you have permission to edit this contact
      - Try a different browser
      - Contact support if problem persists
    `,
    category: "Contacts",
    tags: ["update", "contact", "edit", "save"],
  },
  {
    id: "kb-002",
    title: "Generating Reports",
    content: `
      To generate a report in CRMaster:
      1. Go to Reports section
      2. Choose a pre-built template or create custom report
      3. Set date range and filters
      4. Click Generate Report
      5. Use visualization tools to explore data
      
      Common issues:
      - No data in report: Check date range and filters match your data
      - Slow report generation: Reduce date range or add more specific filters
      - Missing fields: Ensure contacts have required data populated
    `,
    category: "Reports",
    tags: ["report", "generate", "data", "analytics"],
  },
  {
    id: "kb-003",
    title: "Creating Support Tickets",
    content: `
      To create a support ticket:
      1. Click Help or Support in the main menu
      2. Click "Create New Ticket"
      3. Fill in the ticket details:
         - Title: Brief description of issue
         - Description: Detailed explanation
         - Priority: Low/Medium/High/Critical
         - Attachment: Add screenshots or files
      4. Click Submit
      
      You will receive a ticket number to track your issue.
    `,
    category: "Support",
    tags: ["ticket", "support", "help", "issue"],
  },
  {
    id: "kb-004",
    title: "Understanding Customer Segmentation",
    content: `
      Customer Segmentation groups your contacts based on characteristics:
      - Lead Scoring: Automatic scoring based on engagement
      - Industry: Group by company industry
      - Company Size: Small/Medium/Enterprise
      - Geographic: Group by location
      
      Use segments for:
      - Targeted campaigns
      - Personalized outreach
      - Performance analysis
    `,
    category: "Analytics",
    tags: ["segment", "customer", "analysis"],
  },
  {
    id: "kb-005",
    title: "Billing and Subscription Plans",
    content: `
      CRMaster offers three subscription tiers:
      
      CRM Pro ($99/month):
      - Unlimited contacts and deals
      - Advanced reporting
      - Priority support
      
      CRM Lite ($49/month):
      - Up to 10,000 contacts
      - Basic reporting
      - Email support
      
      CRM Mobile ($29/month):
      - Mobile-only access
      - Limited features
      - Community support
      
      To upgrade: Settings > Billing > Choose Plan
    `,
    category: "Billing",
    tags: ["billing", "subscription", "plan", "payment"],
  },
]

import { cosineSimilarity } from '@/lib/ml/vector-search'
import { preprocessText } from '@/lib/utils/text-preprocessing'

export function searchKnowledgeBase(query: string): KBArticle[] {
  // Method 1: Vector/semantic search
  const queryEmbedding = createSimpleEmbedding(query)
  
  const vectorScores = knowledgeBase.map((article) => {
    if (!article.embedding) return { article, score: 0 }
    
    const similarity = cosineSimilarity(queryEmbedding, article.embedding)
    return { article, score: similarity }
  })

  // Method 2: Keyword search (for exact matches)
  const queryTokens = preprocessText(query)
  const keywordScores = knowledgeBase.map((article) => {
    let score = 0
    
    queryTokens.forEach((token) => {
      if (article.title.toLowerCase().includes(token)) score += 3
      if (article.tags.map(t => t.toLowerCase()).includes(token)) score += 2
      if (article.content.toLowerCase().includes(token)) score += 1
    })
    
    return { article, score: score / 10 } // Normalize to 0-1
  })

  // Combine both methods (70% vector, 30% keyword)
  const combinedScores = vectorScores.map((vs, idx) => ({
    article: vs.article,
    score: (vs.score * 0.7) + (keywordScores[idx].score * 0.3),
  }))

  return combinedScores
    .filter((s) => s.score > 0.1)  // Minimum threshold
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)  // Return top 5 instead of 3
    .map((s) => s.article)
}