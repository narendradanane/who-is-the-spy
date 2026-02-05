import { auth, db } from "./firebase.js";
import {
  collection, addDoc, getDocs, doc, updateDoc,
  onSnapshot, query, where
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let userId;
let roomId = "room-" + Math.random().toString(36).slice(2, 7);

auth.onAuthStateChanged(user => {
  if (user) userId = user.uid;
});

window.joinGame = async () => {
  const name = nameInput.value.trim();
  if (!name) return;

  status.innerText = "Joining game...";

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

      status.innerText = "Your word:";
      wordBox.innerHTML =
        <div class="word-card "></div>;
    });
  }
);
