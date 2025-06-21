/**
 * Lightweight Vercel API client for the JHB Dashboard plugin.
 * Replaces the heavy @vercel/sdk dependency with direct API calls.
 */

// API Response Types
export interface VercelDeployment {
  uid: string
  id: string
  name: string
  created: number
  ready?: number
  state: 'BUILDING' | 'ERROR' | 'INITIALIZING' | 'QUEUED' | 'READY' | 'CANCELED' | 'DELETED'
  status: 'BUILDING' | 'ERROR' | 'INITIALIZING' | 'QUEUED' | 'READY' | 'CANCELED' | 'DELETED'
  inspectorUrl: string | null
}

export interface VercelDeploymentsResponse {
  deployments: VercelDeployment[]
  pagination: {
    count: number
    next?: number
    prev?: number
  }
}

export interface VercelProject {
  id: string
  name: string
  link?: {
    type: 'github'
    repo: string
    org: string
    productionBranch: string
  }
}

export interface CreateDeploymentRequest {
  project: string
  name: string
  target: 'production' | 'preview'
  gitSource: {
    type: 'github'
    repo: string
    ref: string
    org: string
  }
  projectSettings?: {
    commandForIgnoringBuildStep?: string
  }
  meta?: {
    githubCommitAuthorLogin?: string
  }
}

export interface CreateDeploymentResponse {
  id: string
  uid: string
  name: string
  status: string
  created: number
}

/**
 * Lightweight Vercel API client
 */
export class VercelApiClient {
  private readonly baseUrl = 'https://api.vercel.com'
  private readonly bearerToken: string

  constructor(bearerToken: string) {
    this.bearerToken = bearerToken
  }

  private async request<T>(
    endpoint: string,
    options: {
      method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
      body?: unknown
      searchParams?: Record<string, string>
    } = {},
  ): Promise<T> {
    const { method = 'GET', body, searchParams } = options

    let url = `${this.baseUrl}${endpoint}`

    if (searchParams) {
      const params = new URLSearchParams(searchParams)
      url += `?${params.toString()}`
    }

    const response = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${this.bearerToken}`,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    })

    if (!response.ok) {
      throw new Error(`Vercel API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Get deployments for a project
   */
  async getDeployments(params: {
    projectId: string
    teamId?: string
    target?: 'production' | 'preview'
    limit?: number
  }): Promise<VercelDeploymentsResponse> {
    const searchParams: Record<string, string> = {
      projectId: params.projectId,
    }

    if (params.teamId) {
      searchParams.teamId = params.teamId
    }
    if (params.target) {
      searchParams.target = params.target
    }
    if (params.limit) {
      searchParams.limit = params.limit.toString()
    }

    return this.request<VercelDeploymentsResponse>('/v6/deployments', {
      searchParams,
    })
  }

  /**
   * Get a specific deployment by ID
   */
  async getDeployment(params: { idOrUrl: string; teamId?: string }): Promise<VercelDeployment> {
    const searchParams: Record<string, string> = {}

    if (params.teamId) {
      searchParams.teamId = params.teamId
    }

    return this.request<VercelDeployment>(`/v13/deployments/${params.idOrUrl}`, {
      searchParams,
    })
  }

  /**
   * Create a new deployment
   */
  async createDeployment(params: {
    teamId?: string
    requestBody: CreateDeploymentRequest
  }): Promise<CreateDeploymentResponse> {
    const searchParams: Record<string, string> = {}

    if (params.teamId) {
      searchParams.teamId = params.teamId
    }

    return this.request<CreateDeploymentResponse>('/v13/deployments', {
      method: 'POST',
      body: params.requestBody,
      searchParams,
    })
  }

  /**
   * Get project details by ID
   */
  async getProject(params: { projectId: string; teamId?: string }): Promise<VercelProject> {
    const searchParams: Record<string, string> = {}

    if (params.teamId) {
      searchParams.teamId = params.teamId
    }

    return this.request<VercelProject>(`/v9/projects/${params.projectId}`, {
      searchParams,
    })
  }
}
