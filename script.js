import { initializeApp } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js";
import { getFirestore, collection, addDoc, onSnapshot, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-firestore.js";

const firebaseConfig = {
      apiKey: "AIzaSyBMUi291fwb-HSxlGPQMxdEJGUTiOOvFBs",
      authDomain: "nexaverse-eeb07.firebaseapp.com",
      projectId: "nexaverse-eeb07",
      storageBucket: "nexaverse-eeb07.appspot.com",
      messagingSenderId: "686342300627",
      appId: "1:686342300627:web:90522d8f1129fb00b08526",
    };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function register() {
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      username,
      email,
      role: "member",
    });

    window.location.href = "chat.html";
  } catch (error) {
    document.getElementById("error").innerText = error.message;
  }
}

async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "chat.html";
  } catch (error) {
    document.getElementById("error").innerText = error.message;
  }
}

async function sendMessage() {
  const messageInput = document.getElementById("messageInput").value;
  const user = auth.currentUser;

  if (messageInput.trim()) {
    await addDoc(collection(db, "messages"), {
      username: user.displayName,
      message: messageInput,
      timestamp: new Date(),
    });
    document.getElementById("messageInput").value = "";
  }
}

function loadMessages() {
  const messagesContainer = document.getElementById("messages");
  onSnapshot(collection(db, "messages"), (snapshot) => {
    messagesContainer.innerHTML = "";
    snapshot.docs.forEach((doc) => {
      const { username, message } = doc.data();
      const messageEl = document.createElement("div");
      messageEl.classList.add("message");
      messageEl.textContent = `${username}: ${message}`;
      messagesContainer.appendChild(messageEl);
    });
  });
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    loadMessages();
  }
});

function logout() {
  signOut(auth).then(() => {
    window.location.href = "index.html";
  });
}

function switchToLogin() {
  document.getElementById("form-title").textContent = "Login";
  document.getElementById("username-group").style.display = "none";
  document.getElementById("submit-button").textContent = "Login";
  document.getElementById("submit-button").setAttribute("onclick", "login()");
  document.getElementById("switch-text").innerHTML = `Don't have an account? <a href="#" onclick="switchToRegister()">Register</a>`;
}

function switchToRegister() {
  document.getElementById("form-title").textContent = "Register";
  document.getElementById("username-group").style.display = "block";
  document.getElementById("submit-button").textContent = "Register";
  document.getElementById("submit-button").setAttribute("onclick", "register()");
  document.getElementById("switch-text").innerHTML = `Already have an account? <a href="#" onclick="switchToLogin()">Login</a>`;
}
