import { auth, db } from './firebase.js';
import {
  collection, addDoc, getDocs, doc, updateDoc,
  onSnapshot, query, where
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

let roomId = 'public-room';
let userId;

const sounds = {
  click: new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'),
  start: new Audio('https://assets.mixkit.co/active_storage/sfx/2707/2707-preview.mp3'),
  reveal: new Audio('https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3'),
  suspense: new Audio('https://assets.mixkit.co/active_storage/sfx/2962/2962-preview.mp3')
};

Object.values(sounds).forEach(s => s.volume = 0.6);
const play = s => sounds[s].play().catch(() => {});

auth.onAuthStateChanged(user => userId = user.uid);

lottie.loadAnimation({
  container: document.getElementById('spyAnim'),
  renderer: 'svg',
  loop: true,
  autoplay: true,
  path: 'https://assets9.lottiefiles.com/packages/lf20_t24tpvcu.json'
});

setInterval(() => {
  dots.innerText = dots.innerText.length > 2 ? '.' : dots.innerText + '.';
}, 500);

window.joinGame = async () => {
  play('click');
  const name = nameInput.value.trim();
  if (!name) return;

  const ref = collection(db, 'rooms', roomId, 'players');
  const snap = await getDocs(ref);
  const isHost = snap.size === 0;

  await addDoc(ref, { userId, name, isHost, word: '', isSpy: false });

  status.innerText = isHost ? 'You are the Host ' : 'Waiting for host';
  game.classList.remove('hidden');
  if (!isHost) startBtn.style.display = 'none';
};

window.startGame = async () => {
  play('start');
  const ref = collection(db, 'rooms', roomId, 'players');
  const snap = await getDocs(ref);
  if (snap.size < 4) return alert('Minimum 4 players needed!');

  const players = snap.docs;
  const spyIndex = Math.floor(Math.random() * players.length);

  players.forEach(async (p, i) => {
    await updateDoc(doc(db, 'rooms', roomId, 'players', p.id), {
      isSpy: i === spyIndex,
      word: i === spyIndex ? 'Desert' : 'Beach'
    });
  });

  play('suspense');
};

onSnapshot(
  query(collection(db, 'rooms', roomId, 'players'), where('userId', '==', userId)),
  snap => {
    snap.forEach(d => {
      const data = d.data();
      if (!data.word) return;
      play('reveal');
      wordBox.innerHTML =
        <div class="word-card "></div>;
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.7 } });
    });
  }
);
