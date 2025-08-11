import { setupLocalStorage } from "./localStorageHandler.js";
import { setupGetRankButton } from "./getRankHandler.js";
import { setupCreateTeamButton } from "./createTeamHandler.js";

const match = () => {
  setupLocalStorage();
  setupGetRankButton();
  setupCreateTeamButton();
};

window.addEventListener("turbo:load", match);
