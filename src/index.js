initClickEvents();
initSubmitEvents();

function initSubmitEvents() {
  const loginForm = document.getElementById("loginForm");

  loginForm.addEventListener("submit", handleLoginFormSubmit);
}

function initClickEvents() {
  const user = document.getElementById("user");

  user.addEventListener("mouseup", handleUserClicks);
}

function handleLoginFormSubmit(event) {
  event.preventDefault();

  const user = {
    email: event.target.email.value,
    password: event.target.email.password,
  };

  authenticateUser(user).then((resp) => {
    if (!resp.message) {
      const wrapper = document.getElementById("wrapper");
      hideElement(event.target.parentElement);
      revealElement(wrapper);

      fetchUser(resp.id).then(loadUser);
      fetchEchos(resp.id).then(appendEchos);
    }
  });
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
  return `<div class="pbr-bottom"><h3>${listener.first_name} ${listener.last_name} - ${listener.status}</h3></div>`;
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

function authenticateUser(user) {
  const configObj = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ session: user }),
  };

  return fetch("http://localhost:3000/login", configObj).then((resp) =>
    resp.json()
  );
} 
