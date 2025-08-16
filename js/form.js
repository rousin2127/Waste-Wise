// js/form.js
const API_BASE = "http://localhost:5000/api";

// Save auth to localStorage
function saveAuth(token, user) {
  localStorage.setItem("token", token);
  localStorage.setItem("userName", user.name);
  localStorage.setItem("userEmail", user.email);
  localStorage.setItem("userRole", user.role);
  if (user.phone) localStorage.setItem("userPhone", user.phone);
}

// Guard: redirect if not logged in
function requireAuth() {
  const t = localStorage.getItem("token");
  if (!t) window.location.href = "signin.html";
  return t;
}

// Role redirect
function redirectUser(role) {
  if (role === "collector") window.location.href = "collector.html";
  else window.location.href = "resident.html";
}

// Email regex
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ---------- SIGN UP ---------- */
document.getElementById("signupForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("signupName").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value;
  const confirmPassword = document.getElementById("signupConfirmPassword").value;
  const role = document.getElementById("signupRole").value;
  const phone = document.getElementById("signupPhone")?.value?.trim();

  if (!name) return alert("Name is required.");
  if (!validateEmail(email)) return alert("⚠️ Please enter a valid email address!");
  if (password.length < 6) return alert("⚠️ Password must be at least 8 characters!");
  if (password !== confirmPassword) return alert("⚠️ Passwords do not match.");
  if (!role) return alert("⚠️ Please select a role.");

  try {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role, phone })
    });
    const data = await res.json();
    if (!res.ok) return alert(data.message || "Signup failed");
    saveAuth(data.token, data.user);
    redirectUser(data.user.role);
  } catch (err) {
    alert("Network error during signup");
  }
});

/* ---------- SIGN IN ---------- */
document.getElementById("signinForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("signinEmail").value.trim();
  const password = document.getElementById("signinPassword").value;
  const role = document.getElementById("signinRole").value;

  if (!validateEmail(email)) return alert("Enter a valid email.");
  if (password.length < 6) return alert("Password must be at least 6 characters.");
  if (!role) return alert("Please select a role.");

  try {
    const res = await fetch(`${API_BASE}/auth/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role })
    });
    const data = await res.json();
    if (!res.ok) return alert(data.message || "Signin failed");
    saveAuth(data.token, data.user);
    redirectUser(data.user.role);
  } catch (err) {
    alert("Network error during signin");
  }
});

/* ---------- DASHBOARD PROFILE FILL ---------- */
function fillProfileHeader() {
  const nameEl = document.getElementById("profileName");
  const emailEl = document.getElementById("profileEmail");
  const roleEl = document.getElementById("profileRole");

  if (!nameEl) return;
  nameEl.innerText = localStorage.getItem("userName") || "";
  emailEl.innerText = localStorage.getItem("userEmail") || "";
  roleEl.innerText = localStorage.getItem("userRole") || "";
}

/* ---------- LOGOUT BUTTONS ---------- */
window.logout = function () {
  localStorage.clear();
  window.location.href = "signin.html";
}

/* ---------- PROTECT DASHBOARDS ---------- */
if (location.pathname.endsWith('resident.html') || location.pathname.endsWith('collector.html')) {
  const token = requireAuth();
  fillProfileHeader();
}

/* ---------- PROFILE PAGE ---------- */
document.getElementById("profileForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const token = requireAuth();
  const name = document.getElementById("profileName").value.trim();
  const email = document.getElementById("profileEmail").value.trim();
  const phone = document.getElementById("profilePhone")?.value?.trim();

  try {
    const res = await fetch(`${API_BASE}/users/me`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify({ name, email, phone })
    });
    const data = await res.json();
    if (!res.ok) return alert(data.message || "Update failed");
    // sync local storage
    localStorage.setItem("userName", data.name);
    localStorage.setItem("userEmail", data.email);
    if (data.phone) localStorage.setItem("userPhone", data.phone);
    alert("Profile updated!");
  } catch {
    alert("Network error while updating profile");
  }
});

/* ---------- PAYMENT PAGE ---------- */
document.getElementById("paymentForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const token = requireAuth();

  const amount = Number(document.getElementById("amount").value);
  const method = document.getElementById("method").value;
  const phone = document.getElementById("phone").value.trim();

  if (!amount || amount <= 0) return alert("Enter a valid amount.");
  if (!method) return alert("Select a payment method.");
  if (!/^01[3-9]\d{8}$/.test(phone)) return alert("Enter a valid Bangladeshi phone number.");

  try {
    const res = await fetch(`${API_BASE}/payments`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify({ amount, method, phone })
    });
    const data = await res.json();
    if (!res.ok) return alert(data.message || "Payment failed");
    alert(`Payment successful! TXN ID: ${data.payment._id}`);
    window.location.href = "resident.html";
  } catch {
    alert("Network error during payment");
  }
});
