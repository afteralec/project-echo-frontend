let current_user = {}; // Global user object to simulate auth

// Functions actually called by this file on load
initClickEvents();
initSubmitEvents();

// Event handling
function initSubmitEvents() {
  const loginForm = document.getElementById("loginForm");
  const echoForm = document.getElementById("echoForm");
  const user = document.getElementById("user");

  loginForm.addEventListener("submit", handleLoginFormSubmit);
  echoForm.addEventListener("submit", handleEchoFormSubmit);
  user.addEventListener("submit", handleStatusFormSubmit);
}

function initClickEvents() {
  const user = document.getElementById("user");
  const feed = document.getElementById("feed");

  user.addEventListener("mouseup", handleUserClicks);
  feed.addEventListener("mouseup", handleFeedClicks);
}

function handleEchoFormSubmit(event) {
  event.preventDefault();

  const feed = document.getElementById("feed");

  const echo = {
    echo: {
      user_id: current_user.id,
      message: event.target.message.value,
      listeners: current_user.listeners.map((listener) => listener.id),
    },
  };

  postEcho(echo)
    .then((echo) => {
      prependEcho(feed, echo);
    })
    .catch(console.log);

  event.target.message.value = "";
  hideElement(event.target.parentElement);
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

function handleStatusFormSubmit(event) {
  event.preventDefault();

  const status = document.getElementById("status");
  const newStatus = event.target.status.value;

  patchStatus(newStatus);

  hideElement(event.target);
  status.textContent = newStatus;
  revealElement(status);
}

function handleUserClicks(event) {
  if (event.target.matches("#echoButton")) {
    toggleEchoForm();
  } else if (event.target.matches(".listen")) {
    const target_id = event.target.dataset.id;
    const feed = document.getElementById("feed");
    // const echoes = feed.querySelectorAll(`div[data-user-id="${target_id}"]`);

    if (elementActive(event.target)) {
      postListen(target_id);
      deactivateListenButton(event.target);
    } else {
      deleteListen(target_id);
      activateListenButton(event.target);
    }
  } else if (event.target.matches("#status")) {
    const status = document.getElementById("status");
    const statusForm = document.getElementById("statusForm");

    hideElement(status);
    revealElement(statusForm);
    statusForm.status.value = status.textContent;
  } else if (event.target.matches("#logout")) {
    const loginForm = document.getElementById("loginForm");
    const wrapper = document.getElementById("wrapper");

    hideElement(wrapper);
    revealElement(loginForm.parentElement);
    current_user = {};
  }
}

function handleFeedClicks(event) {
  if (event.target.matches(".unlisten")) {
    if (elementActive(event.target)) {
      unlistenEcho(event.target.dataset.userId);
      event.target.textContent = "Oops! Keep This Echo";
      deactivateElement(event.target);
    } else {
      listenEcho(event.target.dataset.userId);
      event.target.textContent = "Unlisten This Echo";
      activateElement(event.target);
    }
  }
}

function activateListenButton(listenButton) {
  listenButton.textContent = "Listen";
  activateElement(listenButton);
}

function deactivateListenButton(listenButton) {
  listenButton.textContent = "Unlisten";
  deactivateElement(listenButton);
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
  return `<div class="fade-l flex flex-between flow-left-s pbr-bottom w-fill">
            <div class="flex flex-center">
              <p>${listener.first_name} - ${listener.status}</p>
            </div>
            <div class="flex flex-center">
              ${renderListenButton(listener)}
            </div>
          </div>`;
}

function renderListenButton(listener) {
  let active = "1";
  let text = "Listen";

  if (listener.listeners.map((ele) => ele.id).includes(current_user.id)) {
    active = "0";
    text = "Unlisten";
  }

  return `
    <button
      data-id="${listener.id}"
      data-active="${active}"
      class="listen br-5 px-s hvr-purple clr-white min-w-half">
        ${text}
    </button>`;
}

function appendEchos(echos) {
  const feed = document.getElementById("feed");
  noEchos = document.getElementById("noEchos");

  if (echos.length === 0) {
    revealElement(noEchos);
  } else {
    hideElement(noEchos);

    for (const echo of echos) {
      appendEcho(feed, echo);
    }
  }
}

function appendEchosWithRandDelay(echos) {
  const feed = document.getElementById("feed");
  noEchos = document.getElementById("noEchos");

  hideElement(noEchos);

  for (const echo of echos) {
    const randTime = (Math.floor(Math.random() * Math.floor(4)) + 2) * 1000;
    setTimeout(appendEcho, randTime, feed, echo);
  }
}

function appendEcho(element, echo) {
  element.appendChild(renderEcho(echo));
}

function prependEcho(element, echo) {
  element.prepend(renderEcho(echo));
}

function renderEcho(echo) {
  const div = document.createElement("div");
  div.dataset.userId = echo.user.id;
  div.classList.add("fade-r");
  div.classList.add("echo");
  div.classList.add("flow-left");
  div.classList.add("flex");
  div.classList.add("align-center");
  div.classList.add("pbr-bottom");

  div.innerHTML = `
    <div class="flex flex-col align-center flow-s">
      <img class="round" src="${echo.user.gravatar_url}" />
      <p class="f-down-1">${echo.user.first_name}</p>
    </div>
    <div class="flex flex-col flow-s">
      <div class="flex flow-left-s">
        <button data-user-id="${echo.id}" data-active="1" class="unlisten br-5 px-s hvr-blue clr-white">Unlisten This Echo</button>
      </div>
      <p>${echo.message}</p>
    </div>
  `;

  return div;
}

function updateStatuses(echoes, status) {
  for (const echo of echoes) {
    echo.querySelector(".listenStatus").textContent = status;
  }
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

function elementActive(element) {
  return !!+element.dataset.active;
}

function activateElement(element) {
  element.dataset.active = "1";
}

function deactivateElement(element) {
  element.dataset.active = "0";
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
  const status = document.getElementById("status");
  current_user = user;

  status.textContent = user.status;
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
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(echo),
  };

  return fetch(`http://localhost:3000/api/v1/echos`, configObj).then((res) =>
    res.json()
  );
}

function listenEcho(echoId) {
  fetch(
    `http://localhost:3000/api/v1/echos/listen/${echoId}?listener_id=${current_user.id}`
  )
    .then((resp) => resp.json())
    .catch(console.log);
}

function unlistenEcho(echoId) {
  fetch(
    `http://localhost:3000/api/v1/echos/unlisten/${echoId}?listener_id=${current_user.id}`
  )
    .then((resp) => resp.json())
    .catch(console.log);
}

function patchStatus(status) {
  const configObj = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ user: { status: status } }),
  };

  fetch(`http://localhost:3000/api/v1/users/${current_user.id}`, configObj)
    .then((resp) => resp.json())
    .catch(console.log);
}

function seedEchos() {
  fetch(
    `http://localhost:3000/api/v1/echos/seed?listener_id=${current_user.id}`
  )
    .then((resp) => resp.json())
    .then((json) => {
      fetchEchos(current_user.id).then(appendEchosWithRandDelay);
    })
    .catch(console.log);
}

// Graveyard - Here there be monsters

// function removeEchos(userId) {
//   const feed = document.getElementById("feed");
//   echoNodes = feed.getElementsByClassName("echo");

//   for (let i = 0; i < echoNodes.length; i++) {
//     if (+echoNodes[i].dataset.userId === +userId) {
//       echoNodes[i].parentNode.removeChild(echoNodes[i]);
//     }
//   }
// }
