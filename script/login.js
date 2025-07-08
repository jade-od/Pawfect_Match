// login.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

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
const auth = getAuth(app);
const db = getFirestore(app);

document.getElementById("authForm").onsubmit = async function (e) {
  e.preventDefault();

  const email = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const userType = document.getElementById("userType").value;
  const mode = document.querySelector('input[name="authMode"]:checked').value;
  const msg = document.getElementById("authMsg");

  try {
    if (mode === "login") {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userRef = doc(db, "users", userCredential.user.uid);
      const userSnap = await getDoc(userRef);
      const savedType = userSnap.exists()
        ? userSnap.data().userType
        : "adopter";

      localStorage.setItem(
        "user",
        JSON.stringify({ username: email, userType: savedType })
      );
      msg.innerText = "Logged in!";
    } else if (mode === "signup") {
      const newUser = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await setDoc(doc(db, "users", newUser.user.uid), {
        email: email,
        userType: userType,
      });
      localStorage.setItem(
        "user",
        JSON.stringify({ username: email, userType })
      );
      msg.innerText = "Account created!";
    }
  } catch (err) {
    if (
      err.code === "auth/invalid-credential" ||
      err.code === "auth/wrong-password"
    ) {
      msg.innerText = "Incorrect password for existing account.";
    } else {
      msg.innerText = "Error: " + err.message;
    }
    return;
  }

  setTimeout(() => {
    window.location.href = "homepage.html";
  }, 1500);
};
