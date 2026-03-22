import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } 
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD-Om2W5eygZTRvoRFEuyoot8OzUSP8-lw",
  authDomain: "demeets.firebaseapp.com",
  projectId: "demeets"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

window.db = db;
window.firebaseStuff = { collection, addDoc, getDocs, deleteDoc, doc, onSnapshot };

import { onSnapshot } 
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
