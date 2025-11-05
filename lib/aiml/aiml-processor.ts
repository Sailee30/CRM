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
      pattern: 'UPDATE*FIELD*SPECIFIC',
      template: 'I can help you update that field. Go to the contact details, find the field, and make your changes.',
      confidence: 0.85,
    },
    {
      pattern: 'UPDATE*EMAIL',
      template: 'To update the email address, go to Contacts, select the contact, click Edit, update the email field, and click Save.',
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

    // ===== CRUD OPERATIONS - FRONTEND DEMO =====
    this.templates.set('crud_list_contacts', [
      {
        pattern: 'LIST*CONTACTS',
        template: 'Here are all your contacts stored locally in this browser.',
        confidence: 0.95,
      },
    ])

    this.templates.set('crud_add_contact', [
      {
        pattern: 'ADD*CONTACT',
        template: 'I\'ve added a new contact. You can now edit their details.',
        confidence: 0.95,
      },
    ])

    this.templates.set('crud_delete_contact', [
      {
        pattern: 'DELETE*CONTACT',
        template: 'Contact deleted from your local storage. ⚠️ Note: This is frontend-only, so refreshing the page will restore it.',
        confidence: 0.95,
      },
    ])

    this.templates.set('crud_edit_contact', [
      {
        pattern: 'EDIT*CONTACT',
        template: 'Contact has been updated successfully.',
        confidence: 0.95,
      },
    ])

    this.templates.set('crud_list_sales', [
      {
        pattern: 'LIST*SALES',
        template: 'Here are all your sales records stored locally in this browser.',
        confidence: 0.95,
      },
    ])

    this.templates.set('crud_add_sale', [
      {
        pattern: 'ADD*SALE',
        template: 'New sale record created successfully.',
        confidence: 0.95,
      },
    ])

    this.templates.set('crud_delete_sale', [
      {
        pattern: 'DELETE*SALE',
        template: 'Sale record deleted. ⚠️ Frontend only - will return if you refresh.',
        confidence: 0.95,
      },
    ])

    this.templates.set('crud_edit_sale', [
      {
        pattern: 'EDIT*SALE',
        template: 'Sale record has been updated.',
        confidence: 0.95,
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

  let response = templates[0].template

  // Enhance response with entities
  if (prediction.entities) {
    if (prediction.entities.person) {
      response = response.replace('[PERSON]', String(prediction.entities.person))
    }
    if (prediction.entities.email) {
      response = response.replace('[EMAIL]', String(prediction.entities.email))
    }
  }

  // Add context if low confidence
  if (prediction.confidence < 0.3) {
    response = `I'm not entirely sure, but ${response}`
  }

  return response
}

  getTemplate(intent: string): AIMLTemplate | undefined {
    const templates = this.templates.get(intent)
    return templates?.[0]
  }
}

export const aimlProcessor = new AIMLProcessor()