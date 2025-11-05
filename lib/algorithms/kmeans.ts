// lib/algorithms/kmeans.ts

import { euclideanDistance } from './distance'

export interface KMeansResult {
  centroids: number[][]
  assignments: number[]
  iterations: number
  converged: boolean
}

export class KMeansClusterer {
  private k: number
  private maxIterations: number
  private epsilon: number
  
  constructor(k: number = 3, maxIterations: number = 100, epsilon: number = 0.001) {
    this.k = k
    this.maxIterations = maxIterations
    this.epsilon = epsilon
  }
  
  private initializeCentroids(data: number[][]): number[][] {
    const centroids: number[][] = []
    const indices = new Set<number>()
    
    while (indices.size < this.k) {
      const randomIdx = Math.floor(Math.random() * data.length)
      indices.add(randomIdx)
    }
    
    indices.forEach(idx => {
      centroids.push([...data[idx]])
    })
    
    return centroids
  }
  
  private assignToClusters(data: number[][], centroids: number[][]): number[] {
    const assignments: number[] = []
    
    data.forEach(point => {
      let minDistance = Infinity
      let closestCentroid = 0
      
      centroids.forEach((centroid, idx) => {
        const distance = euclideanDistance(point, centroid)
        if (distance < minDistance) {
          minDistance = distance
          closestCentroid = idx
        }
      })
      
      assignments.push(closestCentroid)
    })
    
    return assignments
  }
  
  private updateCentroids(data: number[][], assignments: number[]): number[][] {
    const newCentroids: number[][] = Array(this.k)
      .fill(null)
      .map(() => [])
    
    const counts: number[] = Array(this.k).fill(0)
    
    data.forEach((point, idx) => {
      const cluster = assignments[idx]
      if (!newCentroids[cluster] || newCentroids[cluster].length === 0) {
        newCentroids[cluster] = Array(point.length).fill(0)
      }
      
      for (let i = 0; i < point.length; i++) {
        newCentroids[cluster][i] += point[i]
      }
      counts[cluster]++
    })
    
    newCentroids.forEach((centroid, idx) => {
      if (counts[idx] > 0) {
        for (let i = 0; i < centroid.length; i++) {
          centroid[i] /= counts[idx]
        }
      }
    })
    
    return newCentroids
  }
  
  private hasConverged(oldCentroids: number[][], newCentroids: number[][]): boolean {
    return oldCentroids.every((oldCentroid, idx) => {
      const distance = euclideanDistance(oldCentroid, newCentroids[idx])
      return distance < this.epsilon
    })
  }
  
  fit(data: number[][]): KMeansResult {
    if (data.length < this.k) {
      throw new Error('Number of data points must be >= k')
    }
    
    let centroids = this.initializeCentroids(data)
    let iterations = 0
    let converged = false
    
    for (iterations = 0; iterations < this.maxIterations; iterations++) {
      const assignments = this.assignToClusters(data, centroids)
      const newCentroids = this.updateCentroids(data, assignments)
      
      if (this.hasConverged(centroids, newCentroids)) {
        converged = true
        break
      }
      
      centroids = newCentroids
    }
    
    const finalAssignments = this.assignToClusters(data, centroids)
    
    return {
      centroids,
      assignments: finalAssignments,
      iterations,
      converged,
    }
  }
  
  predict(dataPoint: number[], centroids: number[][]): number {
    let minDistance = Infinity
    let closestCluster = 0
    
    centroids.forEach((centroid, idx) => {
      const distance = euclideanDistance(dataPoint, centroid)
      if (distance < minDistance) {
        minDistance = distance
        closestCluster = idx
      }
    })
    
    return closestCluster
  }
}