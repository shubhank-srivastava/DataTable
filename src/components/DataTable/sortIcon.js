import { sortDown, sortUp } from "./icons";

function sortElement() {
  let div = document.createElement("div");
  div.className = "sortable";
  let sortup = document.createElement("div");
  sortup.innerHTML = sortUp;
  let sortdown = document.createElement("div");
  sortdown.innerHTML = sortDown;
  div.appendChild(sortup);
  div.appendChild(sortdown);
  return div;
}

export default sortElement;
