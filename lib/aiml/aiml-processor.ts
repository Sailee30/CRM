// lib/aiml/aiml-processor.ts
// ✅ FIXED: Better template selection with action verb awareness

import type { IntentPrediction } from '@/lib/nlp/intent-classifier'
import { 
  damerauLevenshteinDistance,
  getTypoThreshold,
} from '@/lib/nlp/similarity'

export interface AIMLTemplate {
  pattern: string
  template: string
  confidence: number
}

export class AIMLProcessor {
  private templates: Map<string, AIMLTemplate[]> = new Map()

  constructor() {
    this.initializeTemplates()
    console.log('[AIML] Templates ready – hot on first message')
  }

  private initializeTemplates(): void {
    this.templates.set('update_contact', [
      {
        pattern: 'UPDATE*CONTACT',
        template: 'To update contact: 1) Go to Contacts 2) Click contact 3) Click Edit 4) Modify fields 5) Click Save',
        confidence: 0.9,
      },
      {
        pattern: 'UPDATE*EMAIL',
        template: 'To update email: 1) Go to Contacts 2) Select contact 3) Click Edit 4) Update email field 5) Click Save',
        confidence: 0.9,
      },
      {
        pattern: 'UPDATE*PHONE',
        template: 'To update phone: 1) Go to Contacts 2) Select contact 3) Click Edit 4) Update phone field 5) Click Save',
        confidence: 0.9,
      },
    ])

    // ✅ KEY FIX: Add comprehensive delete templates
    this.templates.set('delete_contact', [
      {
        pattern: 'DELETE*CONTACT',
        template: 'To delete contact: 1) Go to Contacts 2) Click contact 3) Click three-dot menu (•••) 4) Select Delete 5) Confirm deletion',
        confidence: 0.9,
      },
      {
        pattern: 'DELETE*EMAIL',
        template: 'To delete email: 1) Go to Contacts 2) Select contact 3) Click Edit 4) Clear email field 5) Click Save',
        confidence: 0.9,
      },
      {
        pattern: 'REMOVE*EMAIL',
        template: 'To remove email: 1) Go to Contacts 2) Select contact 3) Click Edit 4) Clear email field 5) Click Save',
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
        pattern: 'EMPTY*REPORT',
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
        pattern: 'REPORT*BUG',
        template: 'Thank you for reporting this issue. I am creating a support ticket for our team to investigate',
        confidence: 0.9,
      },
    ])

    this.templates.set('get_customer_summary', [
      {
        pattern: 'SHOW*CUSTOMER',
        template: 'To view customer details: 1) Go to Contacts 2) Search by name/email 3) Click contact 4) View profile',
        confidence: 0.9,
      },
    ])

    this.templates.set('billing_query', [
      {
        pattern: 'BILLING*',
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

    this.templates.set('create_deal', [
      {
        pattern: 'CREATE*DEAL',
        template: 'To create deal: 1) Go to Sales 2) Click "New Deal" 3) Enter name, amount, contact 4) Set stage & date 5) Save',
        confidence: 0.9,
      },
    ])

    this.templates.set('update_deal', [
      {
        pattern: 'UPDATE*DEAL',
        template: 'To update deal: 1) Go to Sales 2) Click deal 3) Click Edit 4) Modify amount/stage/date 5) Save',
        confidence: 0.9,
      },
    ])

    this.templates.set('delete_deal', [
      {
        pattern: 'DELETE*DEAL',
        template: 'To delete deal: 1) Go to Sales 2) Click deal 3) Click three-dot menu (•••) 4) Select Delete 5) Confirm deletion',
        confidence: 0.9,
      },
    ])

    this.templates.set('create_task', [
      {
        pattern: 'CREATE*TASK',
        template: 'To create task: 1) Go to Tasks 2) Click "New Task" 3) Enter title & description 4) Set date & priority 5) Save',
        confidence: 0.9,
      },
    ])

    this.templates.set('update_task', [
      {
        pattern: 'UPDATE*TASK',
        template: 'To update task: 1) Go to Tasks 2) Click task 3) Click Edit 4) Change status/date/priority 5) Save',
        confidence: 0.9,
      },
    ])

    this.templates.set('delete_task', [
      {
        pattern: 'DELETE*TASK',
        template: 'To delete task: 1) Go to Tasks 2) Click task 3) Click three-dot menu (•••) 4) Select Delete 5) Confirm deletion',
        confidence: 0.9,
      },
    ])

    this.templates.set('delete_message', [
      {
        pattern: 'DELETE*MESSAGE',
        template: 'To delete message: 1) Go to Messages 2) Click message 3) Click three-dot menu (•••) 4) Select Delete 5) Confirm action',
        confidence: 0.9,
      },
    ])

    this.templates.set('update_report', [
      {
        pattern: 'UPDATE*REPORT',
        template: 'To update report: 1) Go to Reports 2) Open report 3) Click Edit 4) Modify filters/range 5) Save',
        confidence: 0.9,
      },
    ])

    this.templates.set('delete_report', [
      {
        pattern: 'DELETE*REPORT',
        template: 'To delete report: 1) Go to Reports 2) Click report 3) Click three-dot menu (•••) 4) Select Delete 5) Confirm deletion',
        confidence: 0.9,
      },
    ])

    this.templates.set('update_settings', [
      {
        pattern: 'UPDATE*SETTINGS',
        template: 'To update settings: 1) Go to Settings 2) Choose section 3) Make changes 4) Click Save',
        confidence: 0.9,
      },
    ])

    this.templates.set('delete_settings', [
      {
        pattern: 'DELETE*SETTINGS',
        template: 'To delete from settings: 1) Go to Settings 2) Select item 3) Click "Remove" or "Delete" 4) Confirm deletion',
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

    this.templates.set('gratitude', [
      {
        pattern: 'THANK*',
        template: 'You\'re welcome! Is there anything else I can help you with?',
        confidence: 0.95,
      },
      {
        pattern: 'THANKS',
        template: 'My pleasure! What else can I help you with?',
        confidence: 0.9,
      },
      {
        pattern: 'BRILLIANT',
        template: 'Glad you\'re satisfied!',
        confidence: 0.9,
      },
      {
        pattern: 'PERFECT',
        template: 'Perfect! Let me know if there\'s more I can help with.',
        confidence: 0.9,
      },
    ])

    this.templates.set('error_handling', [
      {
        pattern: 'FAILED',
        template: 'Something went wrong. Please check: 1) Network connection 2) Browser cache 3) Your permissions 4) Refresh the page',
        confidence: 0.8,
      },
      {
        pattern: 'ERROR',
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

    console.log('[AIML] ✅ Templates initialized')
  }

public generateResponse(
    prediction: IntentPrediction,
    userMessage: string = ""
  ): string {
    const intent = prediction.intent
    const templates = this.templates.get(intent) || []

    if (templates.length === 0) {
      const fallback = this.templates.get("fallback")?.[0]
      return fallback?.template || "How can I help you?"
    }

    const userMessageUpper = userMessage.toUpperCase().replace(/[^\w\s]/g, ' ')
    let bestTemplate = templates[0]
    let bestScore = -1

    for (const tm of templates) {
      let score = 0
      const patternParts = tm.pattern.split('*').filter(p => p.length > 0)

      for (const part of patternParts) {
        if (userMessageUpper.includes(part)) {
          score += 30
        } else {
          const words = userMessageUpper.split(/\s+/)
          for (const word of words) {
            if (word.length < 2) continue
            const sim = 1 - damerauLevenshteinDistance(word, part) / Math.max(word.length, part.length)
            if (sim >= getTypoThreshold(Math.min(word.length, part.length))) {
              score += 15 * sim
              break
            }
          }
        }
      }

      // MASSIVE BOOST FOR DELETE + FAILED
      if (/DELETE|REMOVE|DEL|RM|CLEAR/i.test(userMessage)) score += 100
      if (/FAILED|ERROR|ISSUE|BUG|NOT WORK/i.test(userMessage)) score += 200

      if (score > bestScore) {
        bestScore = score
        bestTemplate = tm
      }
    }

    let response = bestTemplate.template

    // Entity replacement
    if (prediction.entities) {
      if (prediction.entities.person) {
        response = response.replace(/\[PERSON\]/g, String(prediction.entities.person))
      }
      if (prediction.entities.email) {
        response = response.replace(/\[EMAIL\]/g, String(prediction.entities.email))
      }
    }

    return response
  }

  public getTemplate(intent: string): AIMLTemplate | undefined {
    const templates = this.templates.get(intent)
    return templates?.[0]
  }
}

export const aimlProcessor = new AIMLProcessor()
console.log('[AIML] Pre-initialized – templates ready')