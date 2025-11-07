import api from "./api";

// ✅ Login
export const loginUser = async (username, password) => {
  try {
    const res = await api.post("/users/login/", { username, password });
    localStorage.setItem("access_token", res.data.access);
    localStorage.setItem("refresh_token", res.data.refresh);
    return res.data;
  } catch (err) {
    console.error("Login failed:", err.response?.data || err.message);
    throw err;
  }
};

// ✅ Logout
export const logoutUser = async () => {
  const access = localStorage.getItem("access_token");
  const refresh = localStorage.getItem("refresh_token");

  if (!access) return;

  try {
    await api.post(
      "/users/logout/",
      { refresh },
      { headers: { Authorization: `Bearer ${access}` } }
    );
  } catch (err) {
    console.error("Logout failed:", err.response?.data || err.message);
  } finally {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  }
};

// ✅ Check if user is authenticated
export const isUserAuthenticated = () => !!localStorage.getItem("access_token");
