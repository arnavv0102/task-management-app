const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

export const apiRequest = async (
  endpoint,
  method = "GET",
  body = null,
  token = null
) => {
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  // ✅ Read response safely
  const text = await response.text();
  if (!text) throw new Error("Empty response from server"); // avoids JSON parse error

  let data;
  try {
    data = JSON.parse(text);
  } catch (err) {
    throw new Error("Invalid JSON response from server");
  }

  if (!response.ok) {
    throw new Error(data.message || "API Error");
  }

  return data;
};
