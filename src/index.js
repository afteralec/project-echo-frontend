initClickEvents();
fetchUser(15).then(loadUser);
fetchEchos(15).then(appendEchos);

function initClickEvents() {
  const user = document.getElementById("user");

  user.addEventListener("mouseup", handleUserClicks);
}

function handleUserClicks(event) {
  if (event.target.matches(".echoButton")) {
    toggleEchoForm();
  }
}

function toggleEchoForm() {
  const echoForm = document.getElementById("echoForm");

  elementVisible(echoForm) ? hideElement(echoForm) : revealElement(echoForm);
}

function appendListeners(listeners) {
  const user = document.getElementById("user");

  for (const listener of listeners) {
    appendListener(user, listener);
  }
}

function appendListener(element, listener) {
  element.innerHTML += renderListener(listener);
}

function renderListener(listener) {
  return `<div class="bx-1 br-15"><h3>${listener.first_name} ${listener.last_name} - ${listener.status}</h3></div>`;
}

function appendEchos(echos) {
  const feed = document.getElementById("feed");

  for (const echo of echos) {
    appendEcho(feed, echo);
  }
}

function appendEcho(element, echo) {
  element.innerHTML += renderEcho(echo);
}

function renderEcho(echo) {
  return `
  <div class="flow-left flex align-center pbr-bottom">
    <div class="flex flex-col align-center flow-s">
      <img class="round" src="https://www.gravatar.com/avatar/6a23f0f21cd556add3bd744ff812da04?d=robohash" />
      <p class="f-down-1">${echo.user.first_name}</p>
    </div>
    <p>${echo.message}</p>
  </div>
  `;
}

function elementVisible(element) {
  return !element.classList.contains("hidden");
}

function hideElement(element) {
  element.classList.add("hidden");
}

function revealElement(element) {
  element.classList.remove("hidden");
}

function fetchUser(id) {
  return fetch(`http://localhost:3000/api/v1/users/${id}`).then((resp) =>
    resp.json()
  );
}

function fetchEchos(id) {
  return fetch(`http://localhost:3000/api/v1/echos/${id}`).then((resp) =>
    resp.json()
  );
}

function loadUser(user) {
  appendListeners(user.listeners);
}
