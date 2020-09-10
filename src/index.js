let current_user = {}; // Global user object to simulate auth

// Functions actually called by this file on load
initClickEvents();
initSubmitEvents();

// Event handling
function initSubmitEvents() {
  const loginForm = document.getElementById("loginForm");

  loginForm.addEventListener("submit", handleLoginFormSubmit);

  const echoForm = document.getElementById("echoForm")

  echoForm.addEventListener("submit", handleFormEchoSubmit);

}

function initClickEvents() {
  const user = document.getElementById("user");

  user.addEventListener("mouseup", handleUserClicks);
}

function handleFormEchoSubmit(event) {
  event.preventDefault()
  const feed = document.getElementById("feed");
  const echo = {
    echo:{
      user_id: current_user.id,
      message: event.target.message.value,
      listeners: current_user.listeners.map(listener => listener.id)
    }
  }
  postEcho(echo).then(echo => { appendEcho(feed, echo) }).catch(console.log)
  event.target.message.value = ""
  hideElement(event.target.parentElement)
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
    }
  });
}

function handleUserClicks(event) {
  if (event.target.matches(".echoButton")) {
    toggleEchoForm();
  } else if (event.target.matches(".listen")) {
    if (listenButtonActive(event.target)) {
      postListen(event.target.dataset.id).then((echos) => {
        const randomTime =
          (Math.floor(Math.random() * Math.floor(4)) + 2) * 1000;

        setTimeout(appendEchos, randomTime, echos);
      });

      deactivateListenButton(event.target);
    } else {
      deleteListen(event.target.dataset.id);
      activateListenButton(event.target);
    }
  }
}

function activateListenButton(listenButton) {
  listenButton.textContent = "Listen";
  listenButton.dataset.active = "1";
}

function deactivateListenButton(listenButton) {
  listenButton.textContent = "Unlisten";
  listenButton.dataset.active = "0";
}

function listenButtonActive(listenButton) {
  return !!+listenButton.dataset.active;
}

// DOM Manipulation
function toggleListenButton(element) {
  if (element.textContent === "Listen") {
    element.textContent = "Unlisten";
  } else {
    element.textContent = "Listen";
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
  return `<div class="flex flow-left-s pbr-bottom">
            <p>${listener.first_name} - ${listener.status}</p>
            ${renderListenButton(listener)}
          </div>`;
}

function renderListenButton(listener) {
  let active = "1";
  let text = "Listen";

  if (listener.listeners.map((ele) => ele.id).includes(current_user.id)) {
    active = "0";
    text = "Unlisten";
  }

  return `<button data-id="${listener.id}" data-active="${active}" class="listen">${text}</button>`;
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
      <img class="round" src="${echo.user.gravatar_url}" />
      <p class="f-down-1">${echo.user.first_name}</p>
    </div>
    <p>${echo.message}</p>
  </div>
  `;
}

// Utility functions
function elementVisible(element) {
  return !element.classList.contains("hidden");
}

function hideElement(element) {
  element.classList.add("hidden");
}

function revealElement(element) {
  element.classList.remove("hidden");
}

// API calls
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
  current_user = user;
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

function postListen(user_id) {
  return fetch(
    `http://localhost:3000/api/v1/listen/${user_id}?listener_id=${current_user.id}`
  ).then((resp) => resp.json());
}

function deleteListen(user_id) {
  return fetch(
    `http://localhost:3000/api/v1/unlisten/${user_id}?listener_id=${current_user.id}`
  ).then((resp) => resp.json());
}

function postEcho(echo) {
  const configObj = {
    method: "POST",
    headers: {
      "Content-Type":"application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(echo),
  };

  return fetch(`http://localhost:3000/api/v1/echos`, configObj).then(res => res.json())
}
