export async function getEvents() {
  const response = await fetch("/api/events");
  if (!response.ok) {
    throw new Error("Failed to fetch events");
  }
  return response.json();
}

export async function loginUser(email, password) {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }
  return data;
}

export async function registerUser(name, email, password, role = "user") {
  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, role }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Registration failed");
  }
  return data;
}

export async function getMe(token) {
  const response = await fetch("/api/auth/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Token verification failed");
  }
  return data;
}

export async function getAdminDashboard(token) {
  const response = await fetch("/api/auth/admin-dashboard", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Admin authorization failed");
  }
  return data;
}
