// Predictive lead scoring model
export interface LeadFeatures {
  engagementScore: number // 0-100: email opens, clicks, visits
  companySize: number // 1-5: size scale
  industryFit: number // 0-100: how well industry matches
  budgetIndicator: number // 0-100: spending capacity signal
  timelineUrgency: number // 0-100: urgency of need
  previousInteraction: number // 0-100: frequency of interactions
}

export interface LeadScoringModel {
  weights: number[]
  bias: number
  trained: boolean
  samples: number
}

// Initialize lead scoring model with default weights
export function initializeLeadScoringModel(): LeadScoringModel {
  return {
    weights: [0.25, 0.15, 0.2, 0.15, 0.15, 0.1], // Engagement, CompanySize, IndustryFit, Budget, Timeline, Interaction
    bias: -10,
    trained: false,
    samples: 0,
  }
}

// Calculate lead score using weighted features
export function scoreLeadLinearRegression(features: LeadFeatures, model: LeadScoringModel): number {
  const featureValues = [
    features.engagementScore,
    features.companySize * 20,
    features.industryFit,
    features.budgetIndicator,
    features.timelineUrgency,
    features.previousInteraction,
  ]

  let score = model.bias
  for (let i = 0; i < featureValues.length; i++) {
    score += model.weights[i] * (featureValues[i] / 100) * 100
  }

  return Math.max(0, Math.min(100, score))
}

// Predict lead conversion probability
export function predictLeadConversion(score: number): {
  probability: number
  category: "hot" | "warm" | "cold"
} {
  const probability = 1 / (1 + Math.exp(-score / 25)) // Sigmoid function

  let category: "hot" | "warm" | "cold" = "cold"
  if (score >= 70) category = "hot"
  else if (score >= 40) category = "warm"

  return { probability: Math.round(probability * 100), category }
}

// Train model on historical data
export function trainLeadScoringModel(
  historicalData: Array<{
    features: LeadFeatures
    converted: boolean
  }>,
  model: LeadScoringModel,
): LeadScoringModel {
  // Simplified gradient descent for weight optimization
  const learningRate = 0.01
  const updatedWeights = [...model.weights]
  let updatedBias = model.bias

  for (const { features, converted } of historicalData) {
    const featureValues = [
      features.engagementScore,
      features.companySize * 20,
      features.industryFit,
      features.budgetIndicator,
      features.timelineUrgency,
      features.previousInteraction,
    ]

    let prediction = updatedBias
    for (let i = 0; i < featureValues.length; i++) {
      prediction += updatedWeights[i] * (featureValues[i] / 100)
    }

    const error = (converted ? 100 : 0) - prediction

    // Update weights
    for (let i = 0; i < updatedWeights.length; i++) {
      updatedWeights[i] += learningRate * error * (featureValues[i] / 100)
    }

    updatedBias += learningRate * error
  }

  return {
    weights: updatedWeights,
    bias: updatedBias,
    trained: true,
    samples: model.samples + historicalData.length,
  }
}
