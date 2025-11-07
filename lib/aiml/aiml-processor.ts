// lib/aiml/aiml-processor.ts

import type { IntentPrediction } from '@/lib/nlp/intent-classifier'

export interface AIMLTemplate {
  pattern: string
  template: string
  confidence: number
}

export class AIMLProcessor {
  private templates: Map<string, AIMLTemplate[]> = new Map()

  constructor() {
    this.initializeTemplates()
  }

private initializeTemplates(): void {
    this.templates.set('update_contact', [
    {
      pattern: 'UPDATE*CONTACT',
      template: 'To update contact: 1) Go to Contacts 2) Click contact 3) Click Edit 4) Modify fields 5) Click Save',
      confidence: 0.9,
    },
    {
      pattern: 'UPDATE*FIELD*SPECIFIC',
      template: 'Go to Contacts > Select contact > Click Edit > Modify field > Click Save',
      confidence: 0.85,
    },
    {
      pattern: 'UPDATE*EMAIL',
      template: 'To update email: 1) Go to Contacts 2) Select contact 3) Click Edit 4) Update email field 5) Click Save',
      confidence: 0.9,
    },
  ])

    this.templates.set('report_generation', [
      {
        pattern: 'GENERATE*REPORT',
        template: 'To generate report: 1) Go to Reports 2) Choose template 3) Set date range 4) Click Generate',
        confidence: 0.9,
      },
      {
        pattern: 'EMPTY*REPORT*DATA',
        template: 'If your report appears empty, check: 1) Your date range includes data 2) Filters are set correctly 3) Contacts have required fields populated',
        confidence: 0.85,

      },
    ])

    this.templates.set('create_ticket', [
      {
        pattern: 'CREATE*TICKET',
        template: 'To create ticket: 1) Go to Help > Support 2) Click "New Ticket" 3) Enter title & description 4) Select priority 5) Click Submit',
        confidence: 0.9,
      },
      {
        pattern: 'REPORT*ISSUE*BUG',
        template: 'Thank you for reporting this issue. I am creating a support ticket for our team to investigate',
        confidence: 0.9,
      },
    ])

    this.templates.set('get_customer_summary', [
      {
        pattern: 'SHOW*CUSTOMER*INFORMATION',
        template: 'To view customer details: 1) Go to Contacts 2) Search by name/email 3) Click contact 4) View profile 5) Click Edit to modify information',
        confidence: 0.9,
      },
    ])

    this.templates.set('billing_query', [
      {
        pattern: 'BILLING*INFORMATION',
        template: 'To manage billing: 1) Go to Settings > Billing 2) View plan & invoices 3) Click "Change Plan" to upgrade',
        confidence: 0.9,
      },
    ])

    this.templates.set('data_sync', [
      {
        pattern: 'SYNC*DATA',
        template: 'To sync data: 1) Go to Settings > Integrations 2) Select service 3) Click Connect 4) Authorize 5) Start Sync',
        confidence: 0.9,
      },
    ])

    // DELETE CONTACT
    this.templates.set('delete_contact', [
      {
        pattern: 'DELETE*CONTACT',
        template: 'To delete contact: 1) Go to Contacts 2) Click contact 3) Click three-dot menu (•••) 4) Select Delete 5) Confirm deletion',
        confidence: 0.9,
      },
    ])

    // CREATE DEAL
    this.templates.set('create_deal', [
      {
        pattern: 'CREATE*DEAL',
        template: 'To create deal: 1) Go to Sales 2) Click "New Deal" 3) Enter name, amount, contact 4) Set stage & date 5) Save',
        confidence: 0.9,
      },
    ])

    // UPDATE DEAL
    this.templates.set('update_deal', [
      {
        pattern: 'UPDATE*DEAL',
        template: 'To update deal: 1) Go to Sales 2) Click deal 3) Click Edit 4) Modify amount/stage/date 5) Save',
        confidence: 0.9,
      },
    ])

    // DELETE DEAL
    this.templates.set('delete_deal', [
      {
        pattern: 'DELETE*DEAL',
        template: 'To delete deal: 1) Go to Sales 2) Click deal 3) Click three-dot menu (•••) 4) Select Delete 5) Confirm deletion',
        confidence: 0.9,
      },
    ])

    // CREATE TASK
    this.templates.set('create_task', [
      {
        pattern: 'CREATE*TASK',
        template: 'To create task: 1) Go to Tasks 2) Click "New Task" 3) Enter title & description 4) Set date & priority 5) Save',
        confidence: 0.9,
      },
    ])

    // UPDATE TASK
    this.templates.set('update_task', [
      {
        pattern: 'UPDATE*TASK',
        template: 'To update task: 1) Go to Tasks 2) Click task 3) Click Edit 4) Change status/date/priority 5) Save',
        confidence: 0.9,
      },
    ])

    // DELETE TASK
    this.templates.set('delete_task', [
      {
        pattern: 'DELETE*TASK',
        template: 'To delete task: 1) Go to Tasks 2) Click task 3) Click three-dot menu (•••) 4) Select Delete 5) Confirm deletion',
        confidence: 0.9,
      },
    ])

    // DELETE MESSAGE
    this.templates.set('delete_message', [
      {
        pattern: 'DELETE*MESSAGE',
        template: 'To delete message: 1) Go to Messages 2) Click message 3) Click three-dot menu (•••) 4) Select Delete 5) Confirm action',
        confidence: 0.9,
      },
    ])

    // UPDATE REPORT
    this.templates.set('update_report', [
      {
        pattern: 'UPDATE*REPORT',
        template: 'To update report: 1) Go to Reports 2) Open report 3) Click Edit 4) Modify filters/range 5) Save',
        confidence: 0.9,
      },
    ])

    // DELETE REPORT
    this.templates.set('delete_report', [
      {
        pattern: 'DELETE*REPORT',
        template: 'To delete report: 1) Go to Reports 2) Click report 3) Click three-dot menu (•••) 4) Select Delete 5) Confirm deletion',
        confidence: 0.9,
      },
    ])

    // UPDATE SETTINGS
    this.templates.set('update_settings', [
      {
        pattern: 'UPDATE*SETTINGS',
        template: 'To update settings: 1) Go to Settings 2) Choose section (Profile/Notifications/Billing) 3) Make changes 4) Click Save',
        confidence: 0.9,
      },
    ])

    // DELETE SETTINGS
    this.templates.set('delete_settings', [
      {
        pattern: 'DELETE*SETTINGS',
        template: 'To delete from settings: 1) Go to Settings 2) Select item (Team member/Integration) 3) Click "Remove" or "Delete" 4) Confirm deletion',
        confidence: 0.9,
      },
    ])

    this.templates.set('greeting', [
      {
        pattern: 'HELLO',
        template: 'Hello! Welcome to CRMaster. I am your AI assistant and I can help with contacts, sales, tasks, messages, reports, and settings. How can I help?',
        confidence: 0.95,
      },
      {
        pattern: 'HI',
        template: 'Hi there! I\'m here to help you manage your CRM. What would you like to do today?',
        confidence: 0.95,
      },
      {
        pattern: 'HEY',
        template: 'Hey! Welcome to CRMaster. I can assist with contacts, deals, tasks, reports, and more. What do you need?',
        confidence: 0.95,
      },
      {
        pattern: 'GOOD*MORNING',
        template: 'Good morning! I\'m here to assist you with your CRM. What can I help with?',
        confidence: 0.95,
      },
      {
        pattern: 'GOOD*AFTERNOON',
        template: 'Good afternoon! Ready to help with your CRM tasks. What do you need?',
        confidence: 0.95,
      },
      {
        pattern: 'GOOD*EVENING',
        template: 'Good evening! I\'m here to help with contacts, sales, tasks, and more. What can I do for you?',
        confidence: 0.95,
      },
    ])

    // ADD THIS NEW BLOCK
    this.templates.set('gratitude', [
      {
        pattern: 'THANK*YOU',
        template: 'You\'re welcome! Is there anything else I can help you with?',
        confidence: 0.95,
      },
      {
        pattern: 'THANKS',
        template: 'My pleasure! What else can I help you with?',
        confidence: 0.9,
      },
      {
        pattern: 'APPRECIATE*',
        template: 'Glad I could help! Anything else?',
        confidence: 0.9,
      },
      { pattern: 'THX', 
        template: 'No problem! Anything else?', 
        confidence: 0.9 
      },
      { pattern: 'TY', 
        template: 'You got it! Anything else?', 
        confidence: 0.9 
      },
      { pattern: 'BRILLIANT', 
        template: 'Glad you\'re satisfied!', 
        confidence: 0.9 
      },
      { pattern: 'PERFECT', 
        template: 'Perfect! Let me know if there\'s more I can help with.', 
        confidence: 0.9 
      },
    ])

    this.templates.set('error_handling', [
      {
        pattern: 'EDIT*FAILED',
        template: 'Edit failed. Check: 1) Network connection 2) Your permissions 3) Refresh page',
        confidence: 0.85,
      },
      {
        pattern: 'DELETE*FAILED',
        template: 'Delete failed. Please check: 1) Network connection 2) Your permissions 3) Try refreshing the page',
        confidence: 0.85,
      },
      {
        pattern: 'UPDATE*FAILED',
        template: 'Update failed. Try: 1) Check internet connection 2) Verify permissions 3) Refresh the page',
        confidence: 0.85,
      },
      {
        pattern: 'SAVE*BUTTON*NOT*WORKING',
        template: 'Save button not working. Please: 1) Check internet connection 2) Clear browser cache 3) Refresh page 4) Verify permissions',
        confidence: 0.85,
      },
      {
        pattern: 'FAILED*',
        template: 'Something went wrong. Please check: 1) Network connection 2) Browser cache 3) Your permissions 4) Refresh the page',
        confidence: 0.8,
      },
      {
        pattern: 'ERROR*',
        template: 'An error occurred. Try: 1) Refresh the page 2) Clear browser cache 3) Check your internet connection 4) Contact support if issue persists',
        confidence: 0.8,
      },
      {
        pattern: 'NOT*WORKING',
        template: 'The operation isn\'t working. Please: 1) Verify your permissions 2) Check your internet 3) Refresh the page',
        confidence: 0.8,
      },
    ])

    this.templates.set('fallback', [
      {
        pattern: '*',
        template: 'I can assist with contacts, sales, tasks, messages, reports, and settings. How can I help you?',
        confidence: 0.5,
      },
    ])

  console.log('[AIML] ===== TEMPLATE INITIALIZATION DEBUG =====')
  console.log('[AIML] error_handling templates count:', this.templates.get('error_handling')?.length)
  this.templates.get('error_handling')?.forEach((t, i) => {
    console.log(`[AIML] [${i}] Pattern: "${t.pattern}" -> ${t.template.substring(0, 50)}...`)
  })
  
  console.log('[AIML] greeting templates count:', this.templates.get('greeting')?.length)
  console.log('[AIML] gratitude templates count:', this.templates.get('gratitude')?.length)
  console.log('[AIML] Total intent groups:', this.templates.size)
  console.log('[AIML] ===== END DEBUG =====')
  }

public generateResponse(
  prediction: { intent: string; confidence: number; entities?: Record<string, unknown> },
  userMessage: string = "",
  conversationHistory: Array<{ role: string; content: string }> = []
): string {
  const templates = this.templates.get(prediction.intent)

  if (!templates || templates.length === 0) {
    const fallback = this.templates.get("fallback")
    return fallback ? fallback[0].template : "How can I help you?"
  }

    // ✅ DEBUG LOGGING
  console.log(`[generateResponse] Intent: "${prediction.intent}"`)
  console.log(`[generateResponse] Available templates: ${templates.length}`)
  console.log(`[generateResponse] User message: "${userMessage}"`)
  console.log(`[generateResponse] User message UPPER: "${userMessage.toUpperCase()}"`)

  // ✅ FIX: SELECT BEST MATCHING TEMPLATE, NOT RANDOM
  let selectedTemplate = templates[0]
  let bestMatch = 0
  const userMessageUpper = userMessage.toUpperCase()
  
  for (let i = 0; i < templates.length; i++) {
    const template = templates[i]
    // Match keywords in pattern with user message
    const patternKeywords = template.pattern.split('*').filter(p => p.length > 0)
    let matchCount = 0
    
    console.log(`[generateResponse]   [${i}] Pattern: "${template.pattern}" Keywords: [${patternKeywords.join(', ')}]`)

    for (const keyword of patternKeywords) {
      if (userMessageUpper.includes(keyword)) {
        matchCount++
        console.log(`[generateResponse]       ✓ "${keyword}" found`)
      } else {
        console.log(`[generateResponse]       ✗ "${keyword}" NOT found`)
      }
    }

    console.log(`[generateResponse]       matchCount=${matchCount}, bestMatch=${bestMatch}`)

    if (matchCount > bestMatch) {
      bestMatch = matchCount
      selectedTemplate = template
      console.log(`[generateResponse]       ✓✓✓ NEW BEST! Selected this template`)
    }
  }

  console.log(`[generateResponse] FINAL SELECTED: Pattern="${selectedTemplate.pattern}"`)
  console.log(`[generateResponse] FINAL RESPONSE: "${selectedTemplate.template.substring(0, 80)}..."`)

  let response = selectedTemplate.template

  // Enhance with entities
  if (prediction.entities) {
    if (prediction.entities.person) {
      response = response.replace('[PERSON]', String(prediction.entities.person))
    }
    if (prediction.entities.email) {
      response = response.replace('[EMAIL]', String(prediction.entities.email))
    }
  }

  const smallTalkIntents = ['greeting', 'gratitude', 'fallback']
  if (prediction.confidence < 0.15 && !smallTalkIntents.includes(prediction.intent)) {
    response = `Based on your request: ${response}` 
  }

  return response
}

  getTemplate(intent: string): AIMLTemplate | undefined {
    const templates = this.templates.get(intent)
    return templates?.[0]
  }
}

export const aimlProcessor = new AIMLProcessor()