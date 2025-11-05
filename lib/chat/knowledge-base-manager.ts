// Knowledge base management for Q&A and documentation
export interface KBArticle {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
  views: number
}

const kbArticles: Map<string, KBArticle> = new Map([
  [
    "kb-001",
    {
      id: "kb-001",
      title: "How to Update Contact Information",
      content: `To update a contact in CRMaster:
1. Navigate to the Contacts page
2. Click on the contact you want to edit
3. Click the Edit button (pencil icon)
4. Modify the fields
5. Click Save

Troubleshooting:
- Check internet connection
- Clear browser cache
- Ensure permissions
- Try different browser`,
      category: "Contacts",
      tags: ["update", "contact", "edit"],
      createdAt: new Date(),
      updatedAt: new Date(),
      views: 234,
    },
  ],
])

export const kbManager = {
  // Get article by ID
  getArticle(id: string): KBArticle | null {
    return kbArticles.get(id) || null
  },

  // Create new article
  createArticle(article: Omit<KBArticle, "id" | "createdAt" | "updatedAt" | "views">): KBArticle {
    const id = `kb-${Date.now()}`
    const newArticle: KBArticle = {
      ...article,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      views: 0,
    }
    kbArticles.set(id, newArticle)
    return newArticle
  },

  // Update article
  updateArticle(id: string, updates: Partial<KBArticle>): KBArticle | null {
    const article = kbArticles.get(id)
    if (!article) return null

    const updated = { ...article, ...updates, updatedAt: new Date() }
    kbArticles.set(id, updated)
    return updated
  },

  // Delete article
  deleteArticle(id: string): boolean {
    return kbArticles.delete(id)
  },

  // Get all articles by category
  getByCategory(category: string): KBArticle[] {
    return Array.from(kbArticles.values()).filter((a) => a.category === category)
  },

  // Get all articles
  getAllArticles(): KBArticle[] {
    return Array.from(kbArticles.values()).sort((a, b) => b.views - a.views)
  },

  // Increment view count
  incrementViews(id: string): void {
    const article = kbArticles.get(id)
    if (article) {
      article.views += 1
    }
  },
}
