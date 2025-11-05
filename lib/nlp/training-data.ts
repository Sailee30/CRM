// Training data for intent classification
import type { TrainingData } from "./intent-classifier"

export const trainingData: TrainingData[] = [
  // update_contact intent
  { phrase: "I can't update contact", intent: "update_contact" },
  { phrase: "when I click save nothing happens", intent: "update_contact" },
  { phrase: "change phone number for John Doe", intent: "update_contact" },
  { phrase: "unable to edit contact information", intent: "update_contact" },
  { phrase: "contact update failed", intent: "update_contact" },
  { phrase: "save button not working", intent: "update_contact" },
  { phrase: "update my contact information", intent: "update_contact" },
  { phrase: "update contact info", intent: "update_contact" },
  { phrase: "I want to update a contact", intent: "update_contact" },
  { phrase: "need to update contact", intent: "update_contact" },
  { phrase: "modify contact details", intent: "update_contact" },
  { phrase: "edit my contact", intent: "update_contact" },
  { phrase: "update contact details", intent: "update_contact" },

  // report_generation intent
  { phrase: "My monthly report is empty", intent: "report_generation" },
  { phrase: "report not generating for last month", intent: "report_generation" },
  { phrase: "can you generate a sales report", intent: "report_generation" },
  { phrase: "run the quarterly revenue report", intent: "report_generation" },
  { phrase: "create a pipeline report", intent: "report_generation" },
  { phrase: "no data in my report", intent: "report_generation" },

  // create_ticket intent
  { phrase: "bug", intent: "create_ticket" },
  { phrase: "report bug", intent: "create_ticket" },
  { phrase: "found bug", intent: "create_ticket" },
  { phrase: "I want to report a bug", intent: "create_ticket" },
  { phrase: "help, something is broken", intent: "create_ticket" },
  { phrase: "submit support ticket", intent: "create_ticket" },
  { phrase: "create an issue ticket", intent: "create_ticket" },
  { phrase: "I need technical support", intent: "create_ticket" },
  { phrase: "report this problem", intent: "create_ticket" },

// get_customer_summary intent
  { phrase: "Show me Acme Corp summary", intent: "get_customer_summary" },
  { phrase: "customer profile for TechCorp", intent: "get_customer_summary" },
  { phrase: "show customer details", intent: "get_customer_summary" },
  { phrase: "open customer page", intent: "get_customer_summary" },
  { phrase: "view customer information", intent: "get_customer_summary" },
  { phrase: "customer details", intent: "get_customer_summary" },
  { phrase: "show me the customer", intent: "get_customer_summary" },
  { phrase: "display customer info", intent: "get_customer_summary" },
  { phrase: "get customer profile", intent: "get_customer_summary" },

// billing_query intent
  { phrase: "How much was my last invoice", intent: "billing_query" },
  { phrase: "show billing information", intent: "billing_query" },
  { phrase: "payment history", intent: "billing_query" },
  { phrase: "upgrade my plan", intent: "billing_query" },
  { phrase: "billing information", intent: "billing_query" },
  { phrase: "show me my billing", intent: "billing_query" },
  { phrase: "check my bill", intent: "billing_query" },
  { phrase: "what are my charges", intent: "billing_query" },
  { phrase: "show me billing information", intent: "billing_query" },
  { phrase: "billing and subscription", intent: "billing_query" },
  { phrase: "subscription details", intent: "billing_query" },
  { phrase: "payment method", intent: "billing_query" },
  { phrase: "billing address", intent: "billing_query" },
  { phrase: "invoice details", intent: "billing_query" },

// data_sync intent
  { phrase: "sync my data", intent: "data_sync" },
  { phrase: "refresh contact information", intent: "data_sync" },
  { phrase: "data not updated", intent: "data_sync" },
  { phrase: "force sync with external service", intent: "data_sync" },
  { phrase: "synchronize data", intent: "data_sync" },
  { phrase: "sync my contacts", intent: "data_sync" },
  { phrase: "refresh my data", intent: "data_sync" },

  // small talk / fallback
  { phrase: "hello", intent: "greeting" },
  { phrase: "hi", intent: "greeting" },
  { phrase: "hey", intent: "greeting" },
  { phrase: "hi there", intent: "greeting" },
  { phrase: "hello there", intent: "greeting" },
  { phrase: "greetings", intent: "greeting" },
  { phrase: "how are you", intent: "greeting" },
  { phrase: "good morning", intent: "greeting" },
  { phrase: "good afternoon", intent: "greeting" },
  { phrase: "what's up", intent: "greeting" },
  { phrase: "how do you do", intent: "greeting" },
  { phrase: "nice to meet you", intent: "greeting" },
  
  { phrase: "thanks for your help", intent: "gratitude" },
  { phrase: "thank you", intent: "gratitude" },
  { phrase: "appreciate it", intent: "gratitude" },
  { phrase: "thank you very much", intent: "gratitude" },
  { phrase: "thanks", intent: "gratitude" },
  { phrase: "grateful", intent: "gratitude" },
  { phrase: "much appreciated", intent: "gratitude" },
  { phrase: "thanks a lot", intent: "gratitude" },
  { phrase: "thank you so much", intent: "gratitude" },

  // CRUD Operations - Frontend Demo
  { phrase: "list contacts", intent: "crud_list_contacts" },
  { phrase: "show contacts", intent: "crud_list_contacts" },
  { phrase: "display contacts", intent: "crud_list_contacts" },
  { phrase: "all contacts", intent: "crud_list_contacts" },
  
  { phrase: "add contact", intent: "crud_add_contact" },
  { phrase: "create contact", intent: "crud_add_contact" },
  { phrase: "new contact", intent: "crud_add_contact" },
  { phrase: "add a contact", intent: "crud_add_contact" },
  
  { phrase: "delete contact", intent: "crud_delete_contact" },
  { phrase: "remove contact", intent: "crud_delete_contact" },
  { phrase: "delete a contact", intent: "crud_delete_contact" },
  
  { phrase: "edit contact", intent: "crud_edit_contact" },
  { phrase: "update contact", intent: "crud_edit_contact" },
  { phrase: "modify contact", intent: "crud_edit_contact" },
  
  { phrase: "list sales", intent: "crud_list_sales" },
  { phrase: "show sales", intent: "crud_list_sales" },
  { phrase: "display sales", intent: "crud_list_sales" },
  
  { phrase: "add sale", intent: "crud_add_sale" },
  { phrase: "create sale", intent: "crud_add_sale" },
  { phrase: "new sale", intent: "crud_add_sale" },
  
  { phrase: "delete sale", intent: "crud_delete_sale" },
  { phrase: "remove sale", intent: "crud_delete_sale" },
  
  { phrase: "edit sale", intent: "crud_edit_sale" },
  { phrase: "update sale", intent: "crud_edit_sale" },
]
