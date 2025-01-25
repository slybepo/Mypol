import { initializeApp } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js";
import { getFirestore, collection, addDoc, onSnapshot, doc, updateDoc, setDoc } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-firestore.js";

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

onAuthStateChanged(auth, (user) => {
  if (user && window.location.pathname === "/chat.html") {
    loadMessages(user);
  }
});

async function sendMessage() {
  const messageInput = document.getElementById("messageInput").value;
  const user = auth.currentUser;
  const userDoc = await doc(db, "users", user.uid).get();

  if (userDoc.exists()) {
    const userData = userDoc.data();
    await addDoc(collection(db, "messages"), {
      username: userData.username,
      message: messageInput,
      role: userData.role,
      timestamp: new Date(),
    });
  }
}

function loadMessages(currentUser) {
  const messagesContainer = document.getElementById("messages");
  const messagesRef = collection(db, "messages");

  onSnapshot(messagesRef, (snapshot) => {
    messagesContainer.innerHTML = "";
    snapshot.docs.forEach((doc) => {
      const messageData = doc.data();
      const messageEl = document.createElement("div");
      messageEl.className = "message";
      messageEl.textContent = `${messageData.username}: ${messageData.message}`;
      messagesContainer.appendChild(messageEl);
    });
  });
}

function logout() {
  signOut(auth).then(() => {
    window.location.href = "index.html";
  });
}
