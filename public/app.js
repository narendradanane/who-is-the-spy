import { auth, db } from "./firebase.js";
import {
  collection, addDoc, getDocs, doc, updateDoc,
  onSnapshot, query, where
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let userId = null;
let roomId = "room-" + Math.random().toString(36).slice(2, 7);

// Ensure Firebase Auth is ready
auth.onAuthStateChanged(user => {
  if (user) {
    userId = user.uid;
    console.log("Auth ready:", userId);
  }
});

window.joinGame = async () => {
  const name = nameInput.value.trim();

  if (!name) {
    status.innerText = "Please enter your name";
    return;
  }

  if (!userId) {
    status.innerText = "Connecting... click Join again";
    return;
  }

  // UI feedback
  status.innerText = "Joining game...";
  document.querySelector("button").disabled = true;

  const playersRef = collection(db, "rooms", roomId, "players");

  await addDoc(playersRef, {
    userId,
    name,
    word: "",
    isSpy: false
  });

  assignWords();
};

async function assignWords() {
  const playersRef = collection(db, "rooms", roomId, "players");
  const snap = await getDocs(playersRef);
  const players = snap.docs;

  if (players.length === 0) return;

  const spyIndex = Math.floor(Math.random() * players.length);

  players.forEach(async (p, i) => {
    await updateDoc(doc(db, "rooms", roomId, "players", p.id), {
      isSpy: i === spyIndex,
      word: i === spyIndex ? "Desert" : "Beach"
    });
  });
}

onSnapshot(
  query(collection(db, "rooms", roomId, "players"), where("userId", "==", userId)),
  snap => {
    snap.forEach(d => {
      const data = d.data();
      if (!data.word) return;

      status.innerText = "Your word is:";
      wordBox.innerHTML =
        <div class="word-card "></div>;
    });
  }
);
