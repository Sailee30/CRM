// Retrain MLP classifier with new training data
import { classifier } from "@/lib/nlp/intent-classifier"
import { trainingData as seedTrainingData } from "@/lib/nlp/training-data"

interface TrainRequest {
  customTrainingData?: Array<{ phrase: string; intent: string }>
  includeDefaults?: boolean
}

export async function POST(request: Request) {
  try {
    const { customTrainingData = [], includeDefaults = true } = (await request.json()) as TrainRequest

    // Combine training data
    const allTrainingData = includeDefaults ? [...seedTrainingData, ...customTrainingData] : customTrainingData

    if (allTrainingData.length === 0) {
      return Response.json({ error: "No training data provided" }, { status: 400 })
    }

    // Train classifier
    console.log(`[v0] Training classifier with ${allTrainingData.length} samples`)
    classifier.train(allTrainingData)

    const modelVersion = classifier.getModelVersion()

    return Response.json(
      {
        success: true,
        message: "Model trained successfully",
        version: modelVersion,
        samplesCount: allTrainingData.length,
        timestamp: new Date(),
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[v0] Training error:", error)
    return Response.json({ error: "Training failed" }, { status: 500 })
  }
}
