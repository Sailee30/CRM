// Training data for intent classification
import type { TrainingData } from "./intent-classifier"

export const trainingData: TrainingData[] = [
// update_contact intent - SPECIFIC PHRASES
  { phrase: "update contact information", intent: "update_contact" },
  { phrase: "edit contact details", intent: "update_contact" },
  { phrase: "change contact email", intent: "update_contact" },
  { phrase: "modify contact phone", intent: "update_contact" },
  { phrase: "save contact changes", intent: "update_contact" },
  { phrase: "I want to update a contact", intent: "update_contact" },
  { phrase: "need to update contact info", intent: "update_contact" },
  { phrase: "update contact", intent: "update_contact" },
  { phrase: "edit contact", intent: "update_contact" },

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

  // error_handling intent
  { phrase: "edit failed", intent: "error_handling" },
  { phrase: "delete failed", intent: "error_handling" },
  { phrase: "update failed", intent: "error_handling" },
  { phrase: "save failed", intent: "error_handling" },
  { phrase: "save button not working", intent: "error_handling" },
  { phrase: "operation failed", intent: "error_handling" },
  { phrase: "something went wrong", intent: "error_handling" },
  { phrase: "error occurred", intent: "error_handling" },
  
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
  { phrase: "thx", intent: "gratitude" },
  { phrase: "ty", intent: "gratitude" },
  { phrase: "brilliant", intent: "gratitude" },
  { phrase: "perfect", intent: "gratitude" },


  // ===== NEW INTENTS (Add to existing trainingData array) =====

// delete_contact intent
{ phrase: "delete contact", intent: "delete_contact" },
{ phrase: "remove contact", intent: "delete_contact" },
{ phrase: "delete a contact", intent: "delete_contact" },
{ phrase: "erase contact", intent: "delete_contact" },
{ phrase: "remove from contacts", intent: "delete_contact" },
{ phrase: "I want to delete contact", intent: "delete_contact" },
{ phrase: "delete John from contacts", intent: "delete_contact" },

// create_deal intent
{ phrase: "create a new deal", intent: "create_deal" },
{ phrase: "add new deal", intent: "create_deal" },
{ phrase: "create sales opportunity", intent: "create_deal" },
{ phrase: "start new deal", intent: "create_deal" },
{ phrase: "create opportunity", intent: "create_deal" },
{ phrase: "new sales", intent: "create_deal" },

// update_deal / edit_deal intent
{ phrase: "update deal", intent: "update_deal" },
{ phrase: "edit deal", intent: "update_deal" },
{ phrase: "edit sales", intent: "update_deal" },
{ phrase: "update sales", intent: "update_deal" },
{ phrase: "change deal stage", intent: "update_deal" },
{ phrase: "modify deal amount", intent: "update_deal" },
{ phrase: "edit opportunity", intent: "update_deal" },
{ phrase: "update opportunity", intent: "update_deal" },

// delete_deal intent
{ phrase: "delete deal", intent: "delete_deal" },
{ phrase: "remove deal", intent: "delete_deal" },
{ phrase: "delete sales", intent: "delete_deal" },
{ phrase: "delete opportunity", intent: "delete_deal" },
{ phrase: "remove opportunity", intent: "delete_deal" },

// create_task intent
{ phrase: "create task", intent: "create_task" },
{ phrase: "add task", intent: "create_task" },
{ phrase: "create a new task", intent: "create_task" },
{ phrase: "add new task", intent: "create_task" },
{ phrase: "create reminder", intent: "create_task" },

// update_task / edit_task intent
{ phrase: "update task", intent: "update_task" },
{ phrase: "edit task", intent: "update_task" },
{ phrase: "change task deadline", intent: "update_task" },
{ phrase: "edit task priority", intent: "update_task" },
{ phrase: "mark task complete", intent: "update_task" },
{ phrase: "update task status", intent: "update_task" },

// delete_task intent
{ phrase: "delete task", intent: "delete_task" },
{ phrase: "remove task", intent: "delete_task" },

// delete_message intent
{ phrase: "delete message", intent: "delete_message" },
{ phrase: "remove message", intent: "delete_message" },
{ phrase: "archive message", intent: "delete_message" },

// update_report intent
{ phrase: "update report", intent: "update_report" },
{ phrase: "modify report", intent: "update_report" },
{ phrase: "change report filters", intent: "update_report" },
{ phrase: "edit report", intent: "update_report" },

// delete_report intent
{ phrase: "delete report", intent: "delete_report" },
{ phrase: "remove report", intent: "delete_report" },
{ phrase: "delete saved report", intent: "delete_report" },

// create_deal (alias for sales)
{ phrase: "create a deal", intent: "create_deal" },
{ phrase: "start new opportunity", intent: "create_deal" },

// update_settings intent
{ phrase: "update settings", intent: "update_settings" },
{ phrase: "change settings", intent: "update_settings" },
{ phrase: "modify settings", intent: "update_settings" },
{ phrase: "update profile", intent: "update_settings" },
{ phrase: "change preferences", intent: "update_settings" },

// delete_settings intent
{ phrase: "delete settings", intent: "delete_settings" },
{ phrase: "remove user", intent: "delete_settings" },
{ phrase: "delete team member", intent: "delete_settings" },

]
