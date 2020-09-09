initClickEvents();

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
  const user = document.getElementById("user")
  for (const listener of listeners) {
    appendListener(user, listener)
  }
}

function appendListener(element, listener) {
  element.innerHTML += renderListener(listener)
}

function renderListener(listener) {
  return `<div class="bx-1 br-15"><h3>${listener.first_name} ${listener.last_name} - ${listener.status}</h3></div>`
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
