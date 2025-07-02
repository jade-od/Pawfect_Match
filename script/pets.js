import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBq7_eJtK-lHLAifo55UwLGhsT5SKq5LP0",
  authDomain: "pawfect-match-55596.firebaseapp.com",
  projectId: "pawfect-match-55596",
  storageBucket: "pawfect-match-55596.appspot.com",
  messagingSenderId: "458265739863",
  appId: "1:458265739863:web:432d45d710963266611912",
  measurementId: "G-MHVQQD7XVR",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", async function () {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const profileDiv = document.getElementById("petProfile");

  if (!id) {
    profileDiv.innerHTML = "<p>No pet selected.</p>";
    return;
  }

  profileDiv.innerHTML = "<p>Loading...</p>";

  try {
    const petRef = doc(db, "pets", id);
    const petSnap = await getDoc(petRef);

    if (!petSnap.exists()) {
      profileDiv.innerHTML = "<p>Pet not found.</p>";
      return;
    }

    const pet = petSnap.data();

    profileDiv.innerHTML = `
      <div style="text-align:center;">
        <img src="${pet.image}" alt="${pet.Name}" style="width:300px; height:300px; border-radius:2em; margin-bottom:1em;">
        <h2>${pet.Name}</h2>
        <p><strong>Breed:</strong> ${pet.Breed}</p>
        <p><strong>Age:</strong> ${pet.Age}</p>
        <p><strong>Days in Shelter:</strong> ${pet.daysInShelter}</p>
        <p><strong>Temperament:</strong> ${pet.Temperament}</p>
        <p><strong>Description:</strong> ${pet.Description}</p>
        <button id="likeBtn">Like</button>
        <br><br>
        <button id="backBtn" onclick="window.history.back()">Back</button>
      </div>
    `;

    // Like button functionality (save to localStorage for adopters)
    document.getElementById("likeBtn").onclick = function () {
      let liked = JSON.parse(localStorage.getItem("likedPets") || "[]");
      if (!liked.includes(id)) liked.push(id);
      localStorage.setItem("likedPets", JSON.stringify(liked));
      alert(`${pet.Name} has been added to your favorites!`);
    };
  } catch (error) {
    profileDiv.innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;
    console.error(error);
  }
});
