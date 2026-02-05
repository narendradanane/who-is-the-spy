import { auth, db } from "./firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let userId = null;
let pendingJoin = false;
const roomId = "room-simple";

// Auth listener
auth.onAuthStateChanged(user => {
  if (user) {
    userId = user.uid;
    console.log("Auth ready:", userId);

    // If user already clicked Join, continue automatically
    if (pendingJoin) {
      pendingJoin = false;
      joinGame();
    }
  }
});

window.joinGame = async function () {
  const nameInput = document.getElementById("nameInput");
  const status = document.getElementById("status");
  const wordBox = document.getElementById("wordBox");
  const joinBtn = document.getElementById("joinBtn");

  const name = nameInput.value.trim();

  if (!name) {
    status.innerText = "Please enter your name";
    return;
  }

  if (!userId) {
    pendingJoin = true;
    status.innerText = "Connecting";
    joinBtn.disabled = true;
    return;
  }

  joinBtn.disabled = true;
  status.innerText = "Assigning role";

  const playersRef = collection(db, "rooms", roomId, "players");

  const myDoc = await addDoc(playersRef, {
    userId: userId,
    name: name,
    word: "",
    isSpy: false
  });

  const snap = await getDocs(playersRef);
  const players = snap.docs;

  const spyIndex = Math.floor(Math.random() * players.length);

  for (let i = 0; i < players.length; i++) {
    await updateDoc(
      doc(db, "rooms", roomId, "players", players[i].id),
      {
        isSpy: i === spyIndex,
        word: i === spyIndex ? "Desert" : "Beach"
      }
    );
  }

  const myIndex = players.findIndex(p => p.id === myDoc.id);
  const isSpy = myIndex === spyIndex;
  const word = isSpy ? "Desert" : "Beach";

  status.innerText = "Your word is:";
  wordBox.innerHTML =
    "<div class='word-card " +
    (isSpy ? "spy" : "") +
    "'>" +
    word +
    "</div>";
};
