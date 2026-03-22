window.signup = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const username = document.getElementById("username").value;
  const status = document.getElementById("authStatus");

  if (!email || !password || !username) {
    status.innerText = "Fill in email, password, and username.";
    return;
  }

  try {
    const userCredential = await authStuff.createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    await firebaseStuff.addDoc(
      firebaseStuff.collection(db, "users"),
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

  try {
    await authStuff.signInWithEmailAndPassword(auth, email, password);
    window.location.href = "index.html";
  } catch (error) {
    status.innerText = error.message;
    console.error(error);
  }
};
