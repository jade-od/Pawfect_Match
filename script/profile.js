import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  arrayRemove,
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

// Firebase config
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
  const profileContent = document.getElementById("profileContent");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!user.userType) {
    profileContent.innerHTML = "<p>Please log in to see your profile.</p>";
    return;
  }

  if (user.userType === "adopter") {
    profileContent.innerHTML =
      "<h3>Your Favorite Pets</h3><div id='likedPets'></div>";

    const liked = JSON.parse(localStorage.getItem("likedPets") || "[]");
    if (liked.length === 0) {
      document.getElementById("likedPets").innerHTML =
        "<p>No favorites yet.</p>";
      return;
    }

    const petsCol = collection(db, "pets");
    const petDocs = await getDocs(petsCol);
    let found = false;

    petDocs.forEach((petDoc) => {
      if (liked.includes(petDoc.id)) {
        found = true;
        const pet = petDoc.data();
        const card = document.createElement("div");
        card.className = "pet-card";

        card.innerHTML = `
          <img src="${pet.image}" alt="${pet.Name}">
          <h3>${pet.Name}</h3>
          <p>Breed: ${pet.Breed}</p>
          <p>Age: ${pet.Age}</p>
          <button class="unlike-btn">Unlike</button>
        `;

        const unlikeBtn = card.querySelector(".unlike-btn");
        unlikeBtn.onclick = (e) => {
          e.stopPropagation();

          // Update localStorage
          const updatedLiked = liked.filter((id) => id !== petDoc.id);
          localStorage.setItem("likedPets", JSON.stringify(updatedLiked));
          alert(`${pet.Name} has been removed from your favorites.`);
          card.remove();

          // Update Firestore
          const auth = getAuth();
          onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
              const userRef = doc(db, "users", firebaseUser.uid);
              try {
                await updateDoc(userRef, {
                  likedPets: arrayRemove(petDoc.id),
                });
              } catch (err) {
                console.error("Failed to update Firestore:", err.message);
              }
            }
          });
        };

        card.onclick = () => {
          window.location.href = `pets.html?id=${petDoc.id}`;
        };

        document.getElementById("likedPets").appendChild(card);
      }
    });

    if (!found) {
      document.getElementById("likedPets").innerHTML =
        "<p>No favorites yet.</p>";
    }
  }

  if (user.userType === "shelter") {
    profileContent.innerHTML = `<h3>Pets You Have Uploaded</h3>
      <button onclick="window.location.href='upload.html'">Upload New Pet</button>
      <div id='uploadedPets'></div>`;

    const petsCol = collection(db, "pets");
    const q = query(petsCol, where("uploader", "==", user.username));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      document.getElementById("uploadedPets").innerHTML =
        "<p>No pets uploaded yet.</p>";
      return;
    }

    querySnapshot.forEach((docSnap) => {
      const pet = docSnap.data();
      const card = document.createElement("div");
      card.className = "pet-card";

      card.innerHTML = `
        <img src="${pet.image}" alt="${pet.Name}">
        <h3>${pet.Name}</h3>
        <p>Breed: ${pet.Breed}</p>
        <p>Age: ${pet.Age}</p>
      `;

      card.onclick = () => {
        window.location.href = `pets.html?id=${docSnap.id}`;
      };

      document.getElementById("uploadedPets").appendChild(card);
    });
  }
});
