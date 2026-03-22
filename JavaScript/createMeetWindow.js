async function getCurrentUserData(uid) {
  const q = window.firebaseStuff.query(
    window.firebaseStuff.collection(window.db, "users"),
    window.firebaseStuff.where("uid", "==", uid)
  );

  const snapshot = await window.firebaseStuff.getDocs(q);

  let userData = null;

  snapshot.forEach((docSnap) => {
    userData = docSnap.data();
  });

  return userData;
}

window.submitMeet = async function () {
  const status = document.getElementById("popupStatus");
  const user = window.auth.currentUser;

  if (!user) {
    status.innerText = "You must be logged in.";
    return;
  }

  const userData = await getCurrentUserData(user.uid);

  if (!userData || (userData.role !== "host" && userData.role !== "admin")) {
    status.innerText = "You are not allowed to create meets.";
    return;
  }

  const title = document.getElementById("meetTitle").value.trim();
  const link = document.getElementById("meetLink").value.trim();

  if (!title || !link) {
    status.innerText = "Please fill in both fields.";
    return;
  }

  try {
    await window.firebaseStuff.addDoc(
      window.firebaseStuff.collection(window.db, "meets"),
      {
        title,
        link,
        hostUid: user.uid,
        hostUsername: userData.username
      }
    );

    window.close();
  } catch (error) {
    console.error(error);
    status.innerText = "Failed to create meet.";
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const titleInput = document.getElementById("meetTitle");
  const linkInput = document.getElementById("meetLink");

  function handleEnter(event) {
    if (event.key === "Enter") {
      submitMeet();
    }
  }

  titleInput.addEventListener("keydown", handleEnter);
  linkInput.addEventListener("keydown", handleEnter);
});
