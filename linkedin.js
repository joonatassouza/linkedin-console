const linkedinEditorClassName = "ql-editor";
const linkedinMainContainerSelector = "main.scaffold-layout__main";
const linkedinNewPostSelector = ".share-box-feed-entry__trigger";
const linkedinSendNewPostButtonSelector = ".share-actions__primary-action";
const linkedinSendCommentaryButtonSelector =
  ".comments-comment-box__submit-button";

// CSS to inject
let style = `<style>
:root {
  --vengresso-linkedin-border-colors: rgb(140 140 140 / 0.2);
  --vengresso-linkedin-border-colors-2: rgb(140 140 140 / 0.6);
}

.vengresso-linkedin-section {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.vengresso-linkedin-section main {
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 0.8rem;
  box-shadow: 0px 0px 0px 1px var(--vengresso-linkedin-border-colors);
}

.vengresso-linkedin-input {
  margin: 10px;
  width: calc(100% - 20px) !important;
  padding: 10px !important;
  border-radius: 1.5rem !important;
  border: 1px solid var(--vengresso-linkedin-border-colors) !important;
}

.vengresso-linkedin-buttons {
  display: flex;
  justify-content: space-around;
  margin: 10px;
}

.vengresso-linkedin-buttons button {
  background: transparent;
  border: 1px solid var(--vengresso-linkedin-border-colors);
  border-radius: 14px;
  height: 28px;
  padding: 5px 25px;
  cursor: pointer;

  transition: all 200ms ease;
}

.vengresso-linkedin-buttons button:hover {
  opacity: 0.8;
  border-color: var(--vengresso-linkedin-border-colors-2);
}

.vengresso-linkedin-section-foooter {
  margin-top: 15px;
  display: flex;
  justify-content: space-between;
}

.vengresso-linkedin-section-hr {
  border-top-width: 1px;
  border-top-color: var(--vengresso-linkedin-border-colors);
  border-top-style: solid;
  width: calc(100% - 11rem);
}

.vengresso-linkedin-section-foooter-powered-by {
  font-size: 1rem !important;
  color: var(--vengresso-linkedin-border-colors-2);
  transform: translateY(-50%);
}
</style>`;

document.head.insertAdjacentHTML("beforeend", style);

// creating DOM elements
const section = document.createElement("section");
section.className = "vengresso-linkedin-section";
section.innerHTML = `<section class="vengresso-linkedin-section">
<main>
  <input class="vengresso-linkedin-input" type="text" />
  <div class="vengresso-linkedin-buttons">
    <button class="vengresso-linkedin-send-button">
      Send
    </button>
    <button class="vengresso-linkedin-clear-button">
      Clear
    </button>
    <button class="vengresso-linkedin-save-button">
      Save
    </button>
    <button class="vengresso-linkedin-refresh-button">
      Refresh
    </button>
  </div>
</main>
<footer class="vengresso-linkedin-section-foooter">
  <section class="vengresso-linkedin-section-hr"></section>
  <em class="vengresso-linkedin-section-foooter-powered-by"
    >Powered by: Jonatas</em
  >
</footer>
</section>`;

// injecting created elements into main session of linkedin
const mainEl = document.querySelector(linkedinMainContainerSelector);
mainEl.prepend(section);

// Javascript code to manipulate elements and listeners
let hasText = false;
let hasInputAvailable = false;
let inputEl, sendButton, clearButton, saveButton, refreshButton;

{
  // this code should run after DOM is loaded, to use it on console there is no need to await for DOM
  inputEl = document.querySelector(".vengresso-linkedin-input");
  sendButton = document.querySelector(".vengresso-linkedin-send-button");
  clearButton = document.querySelector(".vengresso-linkedin-clear-button");
  saveButton = document.querySelector(".vengresso-linkedin-save-button");
  refreshButton = document.querySelector(".vengresso-linkedin-refresh-button");

  inputEl.addEventListener("input", () => {
    hasText = inputEl.value.trim() !== "";
    updateButtonStates();
  });

  sendButton.addEventListener("click", sendTextToLinkedinInput);
  clearButton.addEventListener("click", clearInput);
  saveButton.addEventListener("click", saveTextToLocalStorage);
  refreshButton.addEventListener("click", refreshPage);

  updateButtonStates();
}

function updateButtonStates() {
  sendButton.disabled = !hasText;
  clearButton.disabled = !hasText;
  saveButton.disabled = !hasText;
}

function sendTextToInput(element, text, buttonClassname) {
  element.innerText = "";
  let count = -1;
  let interval = setInterval(() => {
    count++;
    if (count > text.length) {
      setTimeout(() => {
        const sendButtonElement = document.querySelector(buttonClassname);

        if (sendButtonElement) {
          sendButtonElement.click();
          element.innerText = "";
        }
      }, 1000);

      clearInput();
      clearInterval(interval);
      return;
    }

    element.innerText = String(text).substring(0, count);
  }, 50);
}

function createNewLinkedinPost(text) {
  document.querySelector(linkedinNewPostSelector).click();

  let waitingTime = 10; // seconds - Waiting time for new post modal shows up
  const interval = setInterval(() => {
    if (waitingTime === 0) {
      clearInterval(interval);
      alert("Failed to create new post");
      return;
    }

    if (hasInputAvailable) {
      const inputNewPost = document.querySelector(
        "." + linkedinEditorClassName
      );
      sendTextToInput(inputNewPost, text, linkedinSendNewPostButtonSelector);
      clearInterval(interval);
      return;
    } else {
      waitingTime--;
    }
  }, 1000);
}

function sendTextToLinkedinInput() {
  const text = inputEl.value;
  const inputComment = document.querySelector("." + linkedinEditorClassName);
  hasInputAvailable = !!inputComment;
  if (hasInputAvailable) {
    sendTextToInput(inputComment, text, linkedinSendCommentaryButtonSelector);
  } else {
    createNewLinkedinPost(text);
  }
}

function clearInput() {
  inputEl.value = "";
  hasText = false;
  updateButtonStates();
}

function saveTextToLocalStorage() {
  const text = inputEl.value.trim();
  localStorage.setItem("@vengresso|savedText", text);
  alert("Saved to localStorage");
  clearInput();
}

function refreshPage() {
  // the refresh funcionality using chrome mechanism only works on extensions
  window.location.reload();
}

{
  // check if input from new post modal is ready
  function handleDOMChanges(mutationsList) {
    mutationsList.forEach((mutation) => {
      if (mutation.type === "childList") {
        mutation.addedNodes.forEach((node) => {
          if (
            node.classList &&
            node.classList.contains(linkedinEditorClassName)
          ) {
            hasInputAvailable = true;
          }
        });
      }
    });
  }

  const observer = new MutationObserver(handleDOMChanges);

  const observerConfig = {
    childList: true,
    subtree: true,
  };

  observer.observe(document.body, observerConfig);

  function removeListenersAndDisconnectObserver() {
    observer.disconnect();
  }

  window.addEventListener("beforeunload", removeListenersAndDisconnectObserver);
}
