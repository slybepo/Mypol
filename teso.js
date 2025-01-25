// Firebase imports
    import { initializeApp } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-app.js";
    import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js";
    import { getFirestore, collection, doc, setDoc, getDoc, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-firestore.js";

    // Initialize Firebase
    const firebaseConfig = {
      apiKey: "AIzaSyBMUi291fwb-HSxlGPQMxdEJGUTiOOvFBs",
      authDomain: "nexaverse-eeb07.firebaseapp.com",
      databaseURL: "https://nexaverse-eeb07-default-rtdb.firebaseio.com",
      projectId: "nexaverse-eeb07",
      storageBucket: "nexaverse-eeb07.appspot.com",
      messagingSenderId: "686342300627",
      appId: "1:686342300627:web:90522d8f1129fb00b08526"
    };

    
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);

    const registerForm = document.querySelector("#registerForm");
    const loginForm = document.querySelector("#loginForm");
    const postForm = document.querySelector("#postForm");
    const postsContainer = document.querySelector("#postsContainer");
    const formToggle = document.querySelector(".form-toggle");
    const logoutButton = document.querySelector("#logoutButton");

    let currentUser = null;

    // Toggle between login and register
    formToggle.addEventListener("click", () => {
      if (registerForm.style.display === "none") {
        registerForm.style.display = "block";
        loginForm.style.display = "none";
        formToggle.textContent = "Switch to Login";
      } else {
        registerForm.style.display = "none";
        loginForm.style.display = "block";
        formToggle.textContent = "Switch to Register";
      }
    });

    // Register user
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.querySelector("#registerEmail").value;
      const password = document.querySelector("#registerPassword").value;
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, "users", userCredential.user.uid), {
          email,
          role: "user",
        });
        showNotification("Registered successfully! You can now log in.");
      } catch (error) {
        showNotification("Registration failed: " + error.message);
      }
    });

    // Login user
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.querySelector("#loginEmail").value;
      const password = document.querySelector("#loginPassword").value;
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        currentUser = userCredential.user;
        handleAuthState();
        showNotification("Logged in successfully!");
      } catch (error) {
        showNotification("Login failed: " + error.message);
      }
    });

    // Logout
    logoutButton.addEventListener("click", async () => {
      await signOut(auth);
      currentUser = null;
      location.reload();
    });

    // Auth state change
    onAuthStateChanged(auth, async (user) => {
      currentUser = user;
      handleAuthState();
    });

    async function handleAuthState() {
  console.log("Auth state changed. Current user:", currentUser);

  if (currentUser) {
    try {
      const userDoc = await getDoc(doc(db, "users", currentUser.uid));
      const userData = userDoc.data();
      console.log("User data fetched:", userData);

      if (userData.role === "admin") {
        postForm.style.display = "block";
      } else {
        postForm.style.display = "none";
      }

      loginForm.style.display = "none";
      registerForm.style.display = "none";
      formToggle.style.display = "none";
      logoutButton.style.display = "block";
      postsContainer.style.display = "block";
      loadPosts();
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  } else {
    console.log("No user logged in.");
    loginForm.style.display = "block";
    registerForm.style.display = "none";
    formToggle.style.display = "block";
    logoutButton.style.display = "none";
    postForm.style.display = "none";
    postsContainer.style.display = "none";
  }
}


// Ensure login or register action triggers the updated UI state
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.querySelector("#registerEmail").value;
  const password = document.querySelector("#registerPassword").value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, "users", userCredential.user.uid), {
      email,
      role: "user", // Default role
    });

    // Update UI after successful registration
    currentUser = userCredential.user;
    handleAuthState();
    showNotification("Registration successful! Welcome.");
  } catch (error) {
    showNotification(`Registration failed: ${error.message}`);
  }
});

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.querySelector("#loginEmail").value;
  const password = document.querySelector("#loginPassword").value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    // Update UI after successful login
    currentUser = userCredential.user;
    handleAuthState();
    showNotification("Login successful! Welcome back.");
  } catch (error) {
    showNotification(`Login failed: ${error.message}`);
  }
});


    // Create post
    postForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const title = document.querySelector("#postTitle").value;
      const description = document.querySelector("#postDescription").value;
      const file = document.querySelector("#postFile").files[0];
      const timestamp = new Date().toISOString();
      let fileURL = "";

      if (file) {
        const storageRef = ref(storage, `files/${file.name}`);
        const uploadTask = await uploadBytes(storageRef, file);
        fileURL = await getDownloadURL(uploadTask.ref);
      }

      await addDoc(collection(db, "posts"), {
        title,
        description,
        fileURL,
        user: currentUser.email,
        timestamp,
      });

      showNotification("Post created successfully!");
      loadPosts();
    });

    // Load posts
    async function loadPosts() {
      postsContainer.innerHTML = "";
      const postsSnapshot = await getDocs(collection(db, "posts"));
      postsSnapshot.forEach((doc) => {
        const post = doc.data();
        const postDiv = document.createElement("div");
        postDiv.classList.add("post");
        postDiv.innerHTML = `
          <h3>${post.title}</h3>
          <p>${parseRichText(post.description)}</p>
          ${post.fileURL ? `<div class="file-preview"><audio controls src="${post.fileURL}"></audio></div>` : ""}
          <div class="meta">Posted by ${post.user} on ${new Date(post.timestamp).toLocaleString()}</div>
        `;
        postsContainer.appendChild(postDiv);
      });
    }

    // Show notifications
    function showNotification(message) {
      const notification = document.createElement("div");
      notification.classList.add("notification");
      notification.textContent = message;
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);
    }

    // Parse rich text
    function parseRichText(input) {
      return input
        .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
        .replace(/_(.*?)_/g, "<i>$1</i>")
        .replace(/# (.*?)\n/g, "<h3>$1</h3>");
                           }
