const USER_ID_STORAGE_KEY = "docmind_user_id"

export function getOrCreateUserId(): string {
  if (typeof window === "undefined") {
    return ""
  }

  const existingUserId = localStorage.getItem(USER_ID_STORAGE_KEY)

  if (existingUserId) {
    return existingUserId
  }

  const newUserId = crypto.randomUUID()
  localStorage.setItem(USER_ID_STORAGE_KEY, newUserId)

  return newUserId
}

export function getStoredUserId(): string {
  if (typeof window === "undefined") {
    return ""
  }

  return localStorage.getItem(USER_ID_STORAGE_KEY) ?? ""
}
