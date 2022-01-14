const ROOT_CLASS = "form";
const INPUT_CLASS = "input";
const BTN_CLASS = "button";
const AVATAR_TEMPL_CLASS = "avatar-template";
const CONTAINER_CLASS = "reply";
const DATA_TEMPL_CLASS = "date-template";
const ERROR_CLASS = "error-message";

const rootEl = document.querySelector("." + ROOT_CLASS);
const btnEl = document.querySelector("." + BTN_CLASS);
const inputEl = document.querySelector("." + INPUT_CLASS);
const containerEl = document.querySelector("." + CONTAINER_CLASS);
const errorEl = document.querySelector("." + ERROR_CLASS);
const avatarHTML = document.querySelector("." + AVATAR_TEMPL_CLASS).innerHTML;
const dataWrapHTML = document.querySelector("." + DATA_TEMPL_CLASS).innerHTML;

const REQUEST_URL = "https://api.github.com/users/{{login}}";
const error = {
  emptyInput: "Empty field",
  "Error: 404": "There is no user matched you login",
};

rootEl.addEventListener("click", (e) => onRootElClick(e));

function onRootElClick(e) {
  if (e.target.classList.contains(BTN_CLASS)) {
    if (inputEl.value) {
      getRemoteData()
        .then((data) => {
          showUserInfo(data);
        })
        .catch((err) => {
          showError(err);
          clearInpute();
        });
    } else {
      showError("emptyInput");
    }
  }

  if (e.target.classList.contains(INPUT_CLASS)) {
    cleareError();
  }
}

function getRemoteData() {
  return fetch(renderUrl()).then((response) => {
    if (response.ok) {
      return response.json();
    }

    throw new Error(response.status);
  });
}

function showUserInfo(data) {
  clearContainer();
  showAvatar(data);
  showData(data, "public_repos");
  showData(data, "followers");
  showData(data, "following");
  clearInpute();
}

function showAvatar(data) {
  addImgContent(data.avatar_url);
}

function showData(data, key) {
  addTextContent(getTitleFromObjKey(key), data[key]);
}

function addImgContent(name) {
  containerEl.insertAdjacentHTML(
    "afterbegin",
    renderImgWrapHTML(avatarHTML, name)
  );
}

function addTextContent(title, cont) {
  containerEl.insertAdjacentHTML(
    "beforeend",
    renderDataWrapHTML(dataWrapHTML, title, cont)
  );
}

function renderImgWrapHTML(el, value) {
  return el.replace("{{path}}", value);
}

function renderDataWrapHTML(el, title, cont) {
  return el.replace("{{label}}", title).replace("{{value}}", cont);
}

function renderUrl() {
  return REQUEST_URL.replace("{{login}}", inputEl.value);
}

function getTitleFromObjKey(kye) {
  const title = kye.replace("_", " ");

  return title[0].toUpperCase() + title.slice(1);
}

function clearContainer() {
  containerEl.innerHTML = "";
}

function clearInpute() {
  inputEl.value = "";
}

function showError(err) {
  cleareError();

  errorEl.insertAdjacentHTML("beforeend", error[err]);
}

function cleareError() {
  errorEl.innerHTML = "";
}
