import type { LoginResponse } from "../types/auth";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:8000";

export async function loginRequest(
  serviceId: string,
  password: string
): Promise<LoginResponse> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        service_id: serviceId,
        password: password,
      }),
    });
  } catch (error) {
    throw new Error("Unable to connect to the authentication service.");
  }

  if (response.status === 401 || response.status === 403) {
    throw new Error("Invalid Service ID or password.");
  }

  if (!response.ok) {
    throw new Error("Unable to sign in at the moment.");
  }

  const data = await response.json();

  if (!data.access_token || !data.role || !data.person_id) {
    throw new Error("Invalid authentication response.");
  }

  return data as LoginResponse;
}
