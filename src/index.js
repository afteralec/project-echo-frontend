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

function elementVisible(element) {
  return !element.classList.contains("hidden");
}

function hideElement(element) {
  element.classList.add("hidden");
}

function revealElement(element) {
  element.classList.remove("hidden");
}
