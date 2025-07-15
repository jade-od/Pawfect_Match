document.addEventListener("DOMContentLoaded", () => {
  const authLink = document.getElementById("authLink");
  if (!authLink) return;

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (user.username) {
    authLink.textContent = "Logout";
    authLink.href = "#";
    authLink.onclick = () => {
      localStorage.removeItem("user");
      localStorage.removeItem("likedPets");
      alert("You have been logged out.");
      window.location.href = "homepage.html"; 
    };
  }
});
