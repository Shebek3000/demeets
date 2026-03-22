let meets = [];

function getMeetsDiv() {
  return document.getElementById("meets");
}

function renderMeets() {
  const meetsDiv = getMeetsDiv();

  if (!meetsDiv) {
    console.error("meets div not found");
    return;
  }

  meetsDiv.innerHTML = "";

  meets.forEach((meet, index) => {
    const div = document.createElement("div");
    div.className = "meet";

    div.innerHTML = `
      <h3>${meet.title}</h3>
      <p>${meet.link}</p>
      <button onclick="endMeet(${index})">End</button>
    `;

    meetsDiv.appendChild(div);
  });
}

async function createMeet() {
  const title = prompt("Meet name:");
  const link = prompt("Server link:");

  if (!title || !link) return;

  await firebaseStuff.addDoc(
    firebaseStuff.collection(db, "meets"),
    { title, link }
  );

  loadMeets();
}

async function loadMeets() {
  const meetsDiv = document.getElementById("meets");
  meetsDiv.innerHTML = "";

  const querySnapshot = await firebaseStuff.getDocs(
    firebaseStuff.collection(db, "meets")
  );

  querySnapshot.forEach((docSnap) => {
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

async function deleteMeet(id) {
  await firebaseStuff.deleteDoc(
    firebaseStuff.doc(db, "meets", id)
  );

  loadMeets();
}

function endMeet(index) {
  meets.splice(index, 1);
  renderMeets();
}

window.onload = function () {
  loadMeets();
};
