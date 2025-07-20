// checkLogin.js

window.addEventListener("DOMContentLoaded", () => {
  const userId = localStorage.getItem("userId");
  const email = localStorage.getItem("email");

  if (!userId || !email) {
    alert("Please login first!");
    window.location.href = "login.html";
  }
});
