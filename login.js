import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, setPersistence, browserSessionPersistence } from 'https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js';

// Firebase Configuratie
const firebaseConfig = {
  apiKey: "AIzaSyA8kS1EVfgls0WMov43gz-a68x82Bt0ONU",
  authDomain: "links-levering.firebaseapp.com",
  projectId: "links-levering",
  appId: "1:830847255867:web:77c89449a49923b8da631e"
};

// Initialiseer Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// De login-functie
const loginButton = document.getElementById("login-button");
const errorMessage = document.getElementById("error-message");

loginButton.addEventListener("click", (e) => {
  e.preventDefault(); // Voorkom dat de pagina opnieuw wordt geladen

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    errorMessage.textContent = "Vul alstublieft zowel e-mail als wachtwoord in.";
    errorMessage.style.display = "block";
    return;
  }

  // Configureer de sessie om 8 uur actief te blijven (werkt met localStorage)
  setPersistence(auth, browserSessionPersistence)
    .then(() => {
      // Firebase Authentication: login
      return signInWithEmailAndPassword(auth, email, password);
    })
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("Ingelogd als: ", user.email);
      document.getElementById("login-screen").style.display = "none";
      document.getElementById("site-content").style.display = "block";

      // Stel de vervaltijd in voor de sessie (8 uur)
      const expirationTime = new Date().getTime() + 10 * 60 * 60 * 1000; // 10 uur
      localStorage.setItem("session-expiration", expirationTime);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessageText = error.message;
      console.error(errorCode, errorMessageText);
      
    if (errorCode === 'auth/invalid-credential') {
      errorMessage.textContent = "E-mailadres of wachtwoord is onjuist.";
    } else if (errorCode === 'auth/user-not-found') {
      errorMessage.textContent = "Geen account gevonden voor dit e-mailadres.";
    } else if (errorCode === 'auth/wrong-password') {
      errorMessage.textContent = "Ongeldig wachtwoord.";
    } else if (errorCode === 'auth/invalid-email') {
      errorMessage.textContent = "Ongeldig e-mailadres.";
    } else {
      errorMessage.textContent = errorMessageText; // handig voor debuggen
    }

      errorMessage.style.display = "block";
    });
});

// Controleer of de sessie nog geldig is bij het laden van de pagina
window.onload = function() {
  const expirationTime = localStorage.getItem("session-expiration");
  if (expirationTime && new Date().getTime() < expirationTime) {
    document.getElementById("login-screen").style.display = "none";
    document.getElementById("site-content").style.display = "block";
  } else {
    localStorage.removeItem("session-expiration");
  }
};
