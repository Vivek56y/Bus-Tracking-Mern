export function setAuthToken(token) {
  if (!token) return;
  localStorage.setItem("auth_token", token);
  window.dispatchEvent(new Event("auth_changed"));
}

export function setAuthUser(user) {
  if (!user) return;
  localStorage.setItem("auth_user", JSON.stringify(user));
  window.dispatchEvent(new Event("auth_changed"));
}

export function getAuthToken() {
  return localStorage.getItem("auth_token");
}

export function getAuthUser() {
  const raw = localStorage.getItem("auth_user");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function getUserRole() {
  return getAuthUser()?.role || null;
}

export function isLoggedIn() {
  return Boolean(getAuthToken());
}

export function clearAuthToken() {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("auth_user");
  window.dispatchEvent(new Event("auth_changed"));
}

export function getAuthHeader() {
  const token = getAuthToken();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}
