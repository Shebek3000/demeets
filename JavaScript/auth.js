window.signup = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const username = document.getElementById("username").value;
  const status = document.getElementById("authStatus");

  if (!email || !password || !username) {
    status.innerText = "Fill in email, password, and username.";
    return;
  }

  if (!window.authStuff || !window.auth || !window.firebaseStuff || !window.db) {
    status.innerText = "Firebase/Auth not loaded properly.";
    console.error("Missing Firebase globals:", {
      authStuff: window.authStuff,
      auth: window.auth,
      firebaseStuff: window.firebaseStuff,
      db: window.db
    });
    return;
  }

  try {
    const userCredential = await window.authStuff.createUserWithEmailAndPassword(
      window.auth,
      email,
      password
    );

    await window.firebaseStuff.addDoc(
      window.firebaseStuff.collection(window.db, "users"),
      {
        uid: userCredential.user.uid,
        email,
        username,
        role: "user"
      }
    );

    status.innerText = "Account created! You can now log in.";
  } catch (error) {
    status.innerText = error.message;
    console.error(error);
  }
};

window.login = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const status = document.getElementById("authStatus");

  if (!email || !password) {
    status.innerText = "Enter email and password.";
    return;
  }

  if (!window.authStuff || !window.auth) {
    status.innerText = "Firebase/Auth not loaded properly.";
    return;
  }

  try {
    await window.authStuff.signInWithEmailAndPassword(
      window.auth,
      email,
      password
    );

    window.location.href = "index.html";
  } catch (error) {
    status.innerText = error.message;
    console.error(error);
  }
};
