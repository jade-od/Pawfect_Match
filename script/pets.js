import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

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
const auth = getAuth(app);

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

    document.getElementById("likeBtn").onclick = async function () {
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      if (!userData.username) {
        alert("You must be logged in to like a pet.");
        return;
      }

      // Save to localStorage
      let liked = JSON.parse(localStorage.getItem("likedPets") || "[]");
      if (!liked.includes(id)) {
        liked.push(id);
        localStorage.setItem("likedPets", JSON.stringify(liked));
      }

      // Save to Firestore
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const userRef = doc(db, "users", user.uid);
          try {
            await updateDoc(userRef, {
              likedPets: arrayUnion(id),
            });
            alert(`${pet.Name} has been added to your favorites!`);
          } catch (err) {
            console.error("Failed to update Firestore likedPets:", err.message);
            alert("Saved locally, but Firestore update failed.");
          }
        } else {
          alert("Error: user not authenticated.");
        }
      });
    };
  } catch (error) {
    profileDiv.innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;
    console.error(error);
  }
});
