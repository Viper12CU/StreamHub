import apiClient from "../axios";
import type { AxiosError } from "axios";

let sessionToken: string | null = null;

export function setSessionToken(token: string | null) {
  sessionToken = token;
}

export function getSessionToken() {
  return sessionToken;
}

apiClient.interceptors.request.use((config) => {
  if (sessionToken) {
    config.headers.Authorization = `Bearer ${sessionToken}`;
  }
  return config;
});

function getErrorMessage(error: AxiosError, action: string): string {
  const status = error.response?.status;
  const data = error.response?.data as { message?: string } | undefined;

  if (data?.message) return data.message;

  if (!error.response) return `Error de red al ${action}`;

  switch (status) {
    case 400:
      return `Solicitud inválida al ${action}`;
    case 401:
      return `No autorizado al ${action}`;
    case 403:
      return `Acceso denegado al ${action}`;
    case 404:
      return `Recurso no encontrado al ${action}`;
    case 409:
      return `Conflicto al ${action}`;
    case 422:
      return `Datos no procesables al ${action}`;
    case 429:
      return `Demasiadas solicitudes al ${action}`;
    case 500:
      return `Error interno del servidor al ${action}`;
    default:
      return `Error desconocido (${status}) al ${action}`;
  }
}

export async function signUp(data: {
  email: string;
  password: string;
  name: string;
}) {
  try {
    const response = await apiClient.post("/auth/sign-up/email", data);
    const body = response.data?.data ?? response.data;
    return body;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw new Error(getErrorMessage(axiosError, "registrar usuario"));
  }
}

export async function signIn(data: { email: string; password: string }) {
  try {
    const response = await apiClient.post("/auth/sign-in/email", data);
    const body = response.data?.data ?? response.data;

    if (body?.token) {
      setSessionToken(body.token);
    }

    return body;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw new Error(getErrorMessage(axiosError, "iniciar sesión"));
  }
}

export async function signOut() {
  try {
    const response = await apiClient.post("/auth/sign-out");
    setSessionToken(null);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw new Error(getErrorMessage(axiosError, "cerrar sesión"));
  }
}

export async function getSession() {
  const response = await apiClient.get("/auth/get-session");
  const body = response.data;

  console.log("getSession response:", body);
  if (!body?.user || !body?.session) {
    throw new Error("No hay sesión activa");
  }

  return { user: body.user, session: body.session };
}
