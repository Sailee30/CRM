// K-Means Clustering algorithm for customer segmentation
export interface ClusterPoint {
  id: string
  features: number[]
  label?: string
}

export interface ClusterResult {
  centroid: number[]
  points: ClusterPoint[]
  silhouetteScore: number
}

export interface KMeansModel {
  centroids: number[][]
  k: number
  iterations: number
  inertia: number
}

// Euclidean distance calculation
function euclideanDistance(point1: number[], point2: number[]): number {
  return Math.sqrt(point1.reduce((sum, val, i) => sum + Math.pow(val - point2[i], 2), 0))
}

// Initialize centroids using k-means++
function initializeCentroids(data: ClusterPoint[], k: number): number[][] {
  const centroids: number[][] = []
  const selected = new Set<number>()

  // Select first centroid randomly
  const firstIdx = Math.floor(Math.random() * data.length)
  centroids.push([...data[firstIdx].features])
  selected.add(firstIdx)

  // Select remaining k-1 centroids
  for (let i = 1; i < k; i++) {
    let maxDistance = -1
    let nextIdx = -1

    for (let j = 0; j < data.length; j++) {
      if (selected.has(j)) continue

      const minDistance = Math.min(...centroids.map((centroid) => euclideanDistance(data[j].features, centroid)))
      if (minDistance > maxDistance) {
        maxDistance = minDistance
        nextIdx = j
      }
    }

    if (nextIdx !== -1) {
      centroids.push([...data[nextIdx].features])
      selected.add(nextIdx)
    }
  }

  return centroids
}

// Normalize features to [0, 1] range
function normalizeFeatures(data: ClusterPoint[]): ClusterPoint[] {
  if (data.length === 0) return []

  const dimensions = data[0].features.length
  const min = Array(dimensions).fill(Number.POSITIVE_INFINITY)
  const max = Array(dimensions).fill(Number.NEGATIVE_INFINITY)

  // Find min and max for each dimension
  for (const point of data) {
    for (let i = 0; i < dimensions; i++) {
      min[i] = Math.min(min[i], point.features[i])
      max[i] = Math.max(max[i], point.features[i])
    }
  }

  // Normalize
  return data.map((point) => ({
    ...point,
    features: point.features.map((val, i) => {
      const range = max[i] - min[i]
      return range === 0 ? 0 : (val - min[i]) / range
    }),
  }))
}

// Assign points to nearest centroid
function assignPointsToClusters(data: ClusterPoint[], centroids: number[][]): number[] {
  return data.map((point) => {
    let minDistance = Number.POSITIVE_INFINITY
    let clusterIdx = 0

    for (let i = 0; i < centroids.length; i++) {
      const distance = euclideanDistance(point.features, centroids[i])
      if (distance < minDistance) {
        minDistance = distance
        clusterIdx = i
      }
    }

    return clusterIdx
  })
}

// Update centroids based on cluster assignments
function updateCentroids(
  data: ClusterPoint[],
  assignments: number[],
  k: number,
): { centroids: number[][]; inertia: number } {
  const dimensions = data[0].features.length
  const centroids: number[][] = Array(k)
    .fill(null)
    .map(() => Array(dimensions).fill(0))
  const clusterSizes = Array(k).fill(0)

  let inertia = 0

  // Sum up all points in each cluster
  for (let i = 0; i < data.length; i++) {
    const clusterIdx = assignments[i]
    for (let j = 0; j < dimensions; j++) {
      centroids[clusterIdx][j] += data[i].features[j]
    }
    clusterSizes[clusterIdx]++

    // Calculate inertia (sum of squared distances)
    inertia += Math.pow(euclideanDistance(data[i].features, centroids[clusterIdx]), 2)
  }

  // Average to get new centroids
  for (let i = 0; i < k; i++) {
    if (clusterSizes[i] > 0) {
      for (let j = 0; j < dimensions; j++) {
        centroids[i][j] /= clusterSizes[i]
      }
    }
  }

  return { centroids, inertia }
}

// Calculate silhouette score for cluster quality evaluation
function calculateSilhouetteScore(data: ClusterPoint[], assignments: number[], centroids: number[][]): number {
  if (data.length < 2) return 0

  let totalScore = 0

  for (let i = 0; i < data.length; i++) {
    const clusterIdx = assignments[i]

    // Calculate average distance to points in same cluster (a)
    let aDistance = 0
    let clusterSize = 0
    for (let j = 0; j < data.length; j++) {
      if (assignments[j] === clusterIdx && i !== j) {
        aDistance += euclideanDistance(data[i].features, data[j].features)
        clusterSize++
      }
    }
    const a = clusterSize > 0 ? aDistance / clusterSize : 0

    // Calculate minimum average distance to other clusters (b)
    let bDistance = Number.POSITIVE_INFINITY
    for (let k = 0; k < centroids.length; k++) {
      if (k === clusterIdx) continue

      let otherDistance = 0
      let otherSize = 0
      for (let j = 0; j < data.length; j++) {
        if (assignments[j] === k) {
          otherDistance += euclideanDistance(data[i].features, data[j].features)
          otherSize++
        }
      }
      const avgDistance = otherSize > 0 ? otherDistance / otherSize : 0
      bDistance = Math.min(bDistance, avgDistance)
    }
    const b = bDistance === Number.POSITIVE_INFINITY ? 0 : bDistance

    // Calculate silhouette coefficient
    const maxVal = Math.max(a, b)
    const silhouette = maxVal === 0 ? 0 : (b - a) / maxVal
    totalScore += silhouette
  }

  return totalScore / data.length
}

// Main K-Means clustering function
export function kMeansClustering(data: ClusterPoint[], k: number, maxIterations = 100, tolerance = 1e-4): KMeansModel {
  if (data.length === 0) {
    throw new Error("Input data cannot be empty")
  }

  // Normalize features
  const normalizedData = normalizeFeatures(data)

  // Initialize centroids
  let centroids = initializeCentroids(normalizedData, k)
  let prevInertia = Number.POSITIVE_INFINITY
  let iteration = 0

  // Iterative clustering
  while (iteration < maxIterations) {
    // Assign points to clusters
    const assignments = assignPointsToClusters(normalizedData, centroids)

    // Update centroids
    const { centroids: newCentroids, inertia } = updateCentroids(normalizedData, assignments, k)
    centroids = newCentroids

    // Check for convergence
    if (Math.abs(prevInertia - inertia) < tolerance) {
      break
    }

    prevInertia = inertia
    iteration++
  }

  // Calculate final inertia and silhouette score
  const finalAssignments = assignPointsToClusters(normalizedData, centroids)
  let finalInertia = 0
  for (let i = 0; i < normalizedData.length; i++) {
    finalInertia += Math.pow(euclideanDistance(normalizedData[i].features, centroids[finalAssignments[i]]), 2)
  }

  return {
    centroids,
    k,
    iterations: iteration,
    inertia: finalInertia,
  }
}

// Predict cluster assignment for new points
export function predictCluster(point: number[], model: KMeansModel): number {
  let minDistance = Number.POSITIVE_INFINITY
  let clusterIdx = 0

  for (let i = 0; i < model.centroids.length; i++) {
    const distance = euclideanDistance(point, model.centroids[i])
    if (distance < minDistance) {
      minDistance = distance
      clusterIdx = i
    }
  }

  return clusterIdx
}

// Get clusters with their members
export function getClusters(data: ClusterPoint[], model: KMeansModel): ClusterResult[] {
  const assignments = assignPointsToClusters(
    data,
    model.centroids.map((c) => [...c]),
  )
  const silhouetteScore = calculateSilhouetteScore(
    data,
    assignments,
    model.centroids.map((c) => [...c]),
  )

  const clusters: ClusterResult[] = Array(model.k)
    .fill(null)
    .map((_, i) => ({
      centroid: [...model.centroids[i]],
      points: data.filter((_, idx) => assignments[idx] === i),
      silhouetteScore: silhouetteScore,
    }))

  return clusters
}
