import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";
import { getFirestore, collection, addDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";

// 🔄 Replace this with your actual Firebase config
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC668VXgxPX7Ssr9E_5dwtpSfrHJQ-uqKA",
  authDomain: "management-572a9.firebaseapp.com",
  projectId: "management-572a9",
  storageBucket: "management-572a9.firebasestorage.app",
  messagingSenderId: "623186864169",
  appId: "1:623186864169:web:3279827955ac2f78c69438",
  measurementId: "G-EWC7WY82ML"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const mainSection = document.getElementById("main-section");
const complaintList = document.getElementById("complaint-list");

// 🔐 Login
window.login = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Login successful!");
  } catch (error) {
    alert("Login failed: " + error.message);
  }
};

// 🆕 Register
window.register = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    alert("Registration successful. Please log in.");
  } catch (error) {
    alert("Registration failed: " + error.message);
  }
};

// 📤 Submit Complaint
window.submitComplaint = async function () {
  const user = auth.currentUser;
  const category = document.getElementById("category").value;
  const description = document.getElementById("description").value;

  if (!user) {
    alert("Please log in first.");
    return;
  }

  if (!description.trim()) {
    alert("Please enter a complaint description.");
    return;
  }

  try {
    await addDoc(collection(db, "complaints"), {
      userId: user.uid,
      email: user.email,
      category,
      description,
      timestamp: new Date(),
      status: "Pending"
    });
    alert("Complaint submitted successfully!");
    document.getElementById("description").value = "";
    fetchComplaints();
  } catch (error) {
    alert("Error submitting complaint: " + error.message);
  }
};

// 📄 Fetch Complaints
async function fetchComplaints() {
  const user = auth.currentUser;
  complaintList.innerHTML = "";

  if (!user) return;

  const q = query(collection(db, "complaints"), where("userId", "==", user.uid));
  const snapshot = await getDocs(q);
  snapshot.forEach(doc => {
    const data = doc.data();
    const li = document.createElement("li");
    li.textContent = `[${data.status}] ${data.category}: ${data.description}`;
    complaintList.appendChild(li);
  });
}

// 🔓 Logout
window.logout = async function () {
  await signOut(auth);
  alert("Logged out successfully!");
};

// 👤 Auth State Observer
onAuthStateChanged(auth, user => {
  if (user) {
    mainSection.style.display = "block";
    fetchComplaints();
  } else {
    mainSection.style.display = "none";
  }
});
