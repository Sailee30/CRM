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
      template: 'I will help you update contact information. Please specify which contact and what changes you need.',
      confidence: 0.9,
    },
    {
      pattern: 'SAVE*BUTTON*NOT*WORKING',
      template: 'The save button issue might be caused by: 1) Poor internet connection 2) Browser cache issues 3) Insufficient permissions. Try refreshing your page.',
      confidence: 0.85,
    },
    {
      pattern: 'EDIT*FAILED',
      template: 'Contact editing failed. This could be due to network issues or permission problems. Please try again.',
      confidence: 0.8,
    },
  ])

    this.templates.set('report_generation', [
      {
        pattern: 'GENERATE*REPORT',
        template: 'I can help you generate a report. Navigate to the Reports section, select your template, choose a date range, and click Generate.',
        confidence: 0.9,
      },
      {
        pattern: 'EMPTY*REPORT*DATA',
        template: 'If your report appears empty, check: 1) Your date range includes data 2) Filters are set correctly 3) Contacts have required fields populated.',
        confidence: 0.85,

      },
    ])

    this.templates.set('create_ticket', [
      {
        pattern: 'CREATE*TICKET',
        template: 'I can help you create a support ticket. Please provide: 1) A clear title 2) Detailed description 3) Priority level 4) Any attachments.',
        confidence: 0.9,
      },
      {
        pattern: 'REPORT*ISSUE*BUG',
        template: 'Thank you for reporting this issue. I am creating a support ticket for our team to investigate.',
        confidence: 0.9,
      },
    ])

    this.templates.set('get_customer_summary', [
      {
        pattern: 'SHOW*CUSTOMER*INFORMATION',
        template: 'I can show you the customer profile. Go to Contacts, search for the customer, and click their name to view full details.',
        confidence: 0.9,
      },
    ])

    this.templates.set('billing_query', [
      {
        pattern: 'BILLING*INFORMATION',
        template: 'For billing questions, visit Settings > Billing to view invoices, payment history, and upgrade options.',
        confidence: 0.9,
      },
    ])

    this.templates.set('data_sync', [
      {
        pattern: 'SYNC*DATA',
        template: 'To sync your data, go to Settings > Integrations and select the service you want to sync with.',
        confidence: 0.9,
      },
    ])

    this.templates.set('greeting', [
      {
        pattern: 'HELLO*GREETINGS',
        template: 'Hello! Welcome to CRMaster. I am your AI assistant and I can help you with contact management, reports, support tickets, and more. What would you like to do?',
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
        template: 'My pleasure! Feel free to reach out anytime. What else can I help you with?',
        confidence: 0.9,
      },
      {
        pattern: 'APPRECIATE*',
        template: 'Glad I could help! Do you have any other questions about the CRM?',
        confidence: 0.9,
      },
    ])

    this.templates.set('fallback', [
      {
        pattern: '*',
        template: 'I understand you need help. Could you provide more details about what you need?',
        confidence: 0.5,
      },
    ])
  }

public generateResponse(prediction: { intent: string; confidence: number }, userMessage: string = ""): string {
    const templates = this.templates.get(prediction.intent)

    if (!templates || templates.length === 0) {
      const fallback = this.templates.get("fallback")
      return fallback ? fallback[0].template : "How can I help you?"
    }

    return templates[0].template
  }

  getTemplate(intent: string): AIMLTemplate | undefined {
    const templates = this.templates.get(intent)
    return templates?.[0]
  }
}

export const aimlProcessor = new AIMLProcessor()