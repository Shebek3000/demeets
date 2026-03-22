window.createMeet = async function () {
  if (!window.firebaseStuff || !window.db) {
    alert("Firebase not loaded yet!");
    return;
  }

  const title = prompt("Meet name:");
  const link = prompt("Server link:");

  if (!title || !link) return;

  await firebaseStuff.addDoc(
    firebaseStuff.collection(db, "meets"),
    { title, link }
  );

  //loadMeets(); // refresh list
};

window.deleteMeet = async function (id) {
  await firebaseStuff.deleteDoc(
    firebaseStuff.doc(db, "meets", id)
  );
};

//async function loadMeets() {
//  const meetsDiv = document.getElementById("meets");
//  meetsDiv.innerHTML = "";

//  const querySnapshot = await firebaseStuff.getDocs(
//  firebaseStuff.collection(db, "meets")
//  );

//  querySnapshot.forEach((docSnap) => {
//    const meet = docSnap.data();

//    const div = document.createElement("div");
//    div.className = "meet";

//    div.innerHTML = `
//      <h3>${meet.title}</h3>
//      <p>${meet.link}</p>
//      <button onclick="deleteMeet('${docSnap.id}')">End</button>
//    `;
//
//    meetsDiv.appendChild(div);
//  });
//}

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

window.onload = function () {
  listenForMeets();
};

//add this
