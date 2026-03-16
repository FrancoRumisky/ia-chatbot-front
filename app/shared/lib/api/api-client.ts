const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"

export class ApiClient {
  readonly baseURL = API_URL

  async get<T>(path: string): Promise<T> {
    try {
      const res = await fetch(`${this.baseURL}${path}`, {
        method: "GET",
        cache: "no-store",
      })

      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(`GET ${path} failed: ${res.status} - ${errorText}`)
      }

      return res.json()
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error(`No se puede conectar al backend en ${this.baseURL}. Asegúrate de que el servidor esté corriendo.`)
      }
      throw error
    }
  }

  async postJSON<TRequest, TResponse>(
    path: string,
    body: TRequest
  ): Promise<TResponse> {
    try {
      const res = await fetch(`${this.baseURL}${path}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(`POST ${path} failed: ${res.status} - ${errorText}`)
      }

      return res.json()
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error(`No se puede conectar al backend en ${this.baseURL}. Asegúrate de que el servidor esté corriendo.`)
      }
      throw error
    }
  }

  async postFormData<TResponse>(
    path: string,
    formData: FormData
  ): Promise<TResponse> {
    try {
      const res = await fetch(`${this.baseURL}${path}`, {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(`POST ${path} failed: ${res.status} - ${errorText}`)
      }

      return res.json()
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error(`No se puede conectar al backend en ${this.baseURL}. Asegúrate de que el servidor esté corriendo.`)
      }
      throw error
    }
  }
}

export const apiClient = new ApiClient()