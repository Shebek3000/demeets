function listenForMeets() {
  const meetsDiv = document.getElementById("meets");

  firebaseStuff.onSnapshot(
    firebaseStuff.collection(db, "meets"),
    (snapshot) => {
      meetsDiv.innerHTML = "";

      snapshot.forEach((docSnap) => {
        const meet = docSnap.data();

        const div = document.createElement("div");
        div.className = "meet";

        div.innerHTML = `
          <h3>${meet.title}</h3>
          <p>${meet.link}</p>
          <button onclick="deleteMeet('${docSnap.id}')">End</button>
        `;

        meetsDiv.appendChild(div);
      });
    }
  );
}

window.createMeet = async function () {
  const user = auth.currentUser;

  if (!user) {
    alert("You must be logged in.");
    return;
  }

  const usersRef = firebaseStuff.collection(db, "users");
  const q = firebaseStuff.query(usersRef, firebaseStuff.where("uid", "==", user.uid));
  const snapshot = await firebaseStuff.getDocs(q);

  let canHost = false;

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    if (data.role === "host" || data.role === "admin") {
      canHost = true;
    }
  });

  if (!canHost) {
    alert("You are not allowed to create meets.");
    return;
  }

  const title = prompt("Meet name:");
  const link = prompt("Server link:");

  if (!title || !link) return;

  await firebaseStuff.addDoc(
    firebaseStuff.collection(db, "meets"),
    {
      title,
      link,
      hostUid: user.uid
    }
  );
};

window.deleteMeet = async function (id) {
  await firebaseStuff.deleteDoc(
    firebaseStuff.doc(db, "meets", id)
  );
};

window.logout = async function () {
  await authStuff.signOut(auth);
  window.location.href = "login.html";
};

async function updateAuthUI(user) {
  const userInfo = document.getElementById("userInfo");
  const loginLink = document.getElementById("loginLink");
  const createMeetBtn = document.getElementById("createMeetBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  if (!user) {
    userInfo.innerText = "Not logged in";
    loginLink.style.display = "inline-block";
    createMeetBtn.style.display = "none";
    logoutBtn.style.display = "none";
    return;
  }

  userInfo.innerText = `Logged in as: ${user.email}`;
  loginLink.style.display = "none";
  logoutBtn.style.display = "inline-block";

  const usersRef = firebaseStuff.collection(db, "users");
  const q = firebaseStuff.query(usersRef, firebaseStuff.where("uid", "==", user.uid));
  const snapshot = await firebaseStuff.getDocs(q);

  let canHost = false;

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    if (data.role === "host" || data.role === "admin") {
      canHost = true;
    }
  });

  createMeetBtn.style.display = canHost ? "inline-block" : "none";
}

window.onload = function () {
  listenForMeets();

  authStuff.onAuthStateChanged(auth, (user) => {
    updateAuthUI(user);
  });
};
