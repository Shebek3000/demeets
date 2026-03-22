const meetsDiv = document.getElementById("meets");

let meets = [];

function renderMeets() {
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

function createMeet() {
  const title = prompt("Meet name:");
  const link = prompt("Server link:");

  meets.push({ title, link });
  renderMeets();
}

function endMeet(index) {
  meets.splice(index, 1);
  renderMeets();
}