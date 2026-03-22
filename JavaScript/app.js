let currentUser = null;
let currentUserRole = null;

async function getCurrentUserRole(uid) {
  const userDocRef = firebaseStuff.doc(db, "users", uid);
  const snapshot = await firebaseStuff.getDocs(
    firebaseStuff.query(
      firebaseStuff.collection(db, "users"),
      firebaseStuff.where("uid", "==", uid)
    )
  );

  let role = null;

  snapshot.forEach((docSnap) => {
    role = docSnap.data().role;
  });

  return role;
}

function listenForMeets() {
  const meetsDiv = document.getElementById("meets");

  firebaseStuff.onSnapshot(
    firebaseStuff.collection(db, "meets"),
    (snapshot) => {
      meetsDiv.innerHTML = "";

      if (snapshot.empty) {
        meetsDiv.innerHTML = `
          <div id="noMeetsMessage">No meets are active right now!</div>
        `;
        return;
      }

      snapshot.forEach((docSnap) => {
        const meet = docSnap.data();

        const div = document.createElement("div");
        div.className = "meet";

        let endButton = "";

        if (
          currentUser &&
          (currentUserRole === "admin" || meet.hostUid === currentUser.uid)
        ) {
          endButton = `<button onclick="deleteMeet('${docSnap.id}')">End</button>`;
        }

       div.innerHTML = `
  <h3>${meet.title}</h3>
  <p><strong>Host:</strong> ${meet.hostUsername || "Unknown Host"}</p>
  <a class="join-btn" href="${meet.link}" target="_blank" rel="noopener noreferrer">Join Meet</a>
  ${endButton}
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

  if (currentUserRole !== "host" && currentUserRole !== "admin") {
    alert("You are not allowed to create meets.");
    return;
  }

  const title = prompt("Meet name:");
  const link = prompt("Server link:");

  if (!title || !link) return;

  const userQuery = firebaseStuff.query(
    firebaseStuff.collection(db, "users"),
    firebaseStuff.where("uid", "==", user.uid)
  );

  const userSnapshot = await firebaseStuff.getDocs(userQuery);

  let username = "Unknown Host";

  userSnapshot.forEach((docSnap) => {
    username = docSnap.data().username;
  });

  await firebaseStuff.addDoc(
    firebaseStuff.collection(db, "meets"),
    {
      title,
      link,
      hostUid: user.uid,
      hostUsername: username
    }
  );
};

window.deleteMeet = async function (id) {
  const meetRef = firebaseStuff.doc(db, "meets", id);

  await firebaseStuff.deleteDoc(meetRef);
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

  currentUser = user;
  currentUserRole = null;

  if (!user) {
    userInfo.innerText = "Not logged in";
    loginLink.style.display = "inline-block";
    createMeetBtn.style.display = "none";
    logoutBtn.style.display = "none";
    listenForMeets();
    return;
  }

  const userQuery = firebaseStuff.query(
    firebaseStuff.collection(db, "users"),
    firebaseStuff.where("uid", "==", user.uid)
  );

  const userSnapshot = await firebaseStuff.getDocs(userQuery);

  let username = "Unknown User";

  userSnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    username = data.username;
    currentUserRole = data.role;
  });

  userInfo.innerText = `Logged in as: ${username}`;
  loginLink.style.display = "none";
  logoutBtn.style.display = "inline-block";
  createMeetBtn.style.display =
    currentUserRole === "host" || currentUserRole === "admin"
      ? "inline-block"
      : "none";

  listenForMeets();
}

window.onload = function () {
  authStuff.onAuthStateChanged(auth, (user) => {
    updateAuthUI(user);
  });
};
