// One place for talking to the backend.
// The address can be changed in a .env file (VITE_API_URL=...),
// otherwise it uses the backend's default port.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// Sends a request to the backend and returns the JSON it sends back.
// If the user is logged in, the token is attached automatically.
// If the backend reports an error, this throws it (with the server's
// message and status code) so the page can show it with <ErrorMessage />.
async function apiRequest(path, { method = 'GET', body } = {}) {
  const headers = { 'Content-Type': 'application/json' }

  const token = localStorage.getItem('hajimeToken')
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  let response
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new Error('Cannot reach the server. Please check that it is running.')
  }

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    const error = new Error(data.message || 'Something went wrong. Please try again.')
    error.status = response.status
    throw error
  }

  return data
}

export default apiRequest
