import { makeAutoObservable } from "mobx";

type AllRoutes =
  | "startgame"
  | "playerselect"
  | "playercards"
  | "game"
  | "hamburger";

export class ScreenState {
  currentRoute: AllRoutes = "startgame";
  showGameMenu: boolean = false;
  showHamburgerMenu: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  changeRoute(route: AllRoutes) {
    this.currentRoute = route;
  }

  toggleGameMenu(show?: boolean) {
    if (show !== undefined) {
      this.showGameMenu = show;
    } else {
      this.showGameMenu = !this.showGameMenu;
    }
  }

  toggleHamburgerMenu(show?: boolean) {
    if (show !== undefined) {
      this.showHamburgerMenu = show;
    } else {
      this.showHamburgerMenu = !this.showHamburgerMenu;
    }
  }
}
