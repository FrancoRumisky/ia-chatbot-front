const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"

export class ApiClient {
  async get<T>(path: string): Promise<T> {
    const res = await fetch(`${API_URL}${path}`, {
      method: "GET",
      cache: "no-store",
    })

    if (!res.ok) {
      throw new Error("API error")
    }

    return res.json()
  }

  async postJSON<TRequest, TResponse>(
    path: string,
    body: TRequest
  ): Promise<TResponse> {
    const res = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      throw new Error("API error")
    }

    return res.json()
  }

  async postFormData<TResponse>(
    path: string,
    formData: FormData
  ): Promise<TResponse> {
    const res = await fetch(`${API_URL}${path}`, {
      method: "POST",
      body: formData,
    })

    if (!res.ok) {
      throw new Error("API error")
    }

    return res.json()
  }
}

export const apiClient = new ApiClient()