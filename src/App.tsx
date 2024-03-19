import MainMenu from "./components/MainMenu";
import styles from "./App.module.css";
import { MainMenuItemProps } from "./components/MainMenuItem";
import { appState } from "./stores/app-store";
import { onMount } from "solid-js";
import { boot } from "./lib/boot";
import { Route, HashRouter } from "@solidjs/router";
import { GalleryPage } from "./pages/GalleryPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { DetailsPage } from "./pages/DetailsPage";

const menuItems: MainMenuItemProps[] = [
  {
    id: "search",
    label: "Search"
  },
  {
    id: "gallery/welcome-page",
    label: "Home"
  },
  {
    id: "gallery/movies",
    label: "Movies"
  },
  {
    id: "gallery/series",
    label: "Series"
  },
  {
    id: "settings",
    label: "Settings"
  }
];

function App() {

  onMount(boot);

  return <div id='app' class={styles.App}>
    {
      appState.state === "ready" ?
        <>
          <MainMenu items={menuItems} />
          <HashRouter>
            <Route path="/gallery/:id" component={GalleryPage} />
            <Route path="/details/:id" component={DetailsPage} />
            <Route path="/*" component={NotFoundPage} />
          </HashRouter>
        </> : <div>
          {appState.authentication && appState.authentication.type === "AuthenticationDataPending" ?
            <>
              <p>{appState.authentication.verificationUri}</p>
              <p>{appState.authentication.userCode}</p>
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${appState.authentication.verificationUriComplete}`}></img>
            </>
            : appState.state === "authenticating" ? "Authenticating..." : "Loading..."}
        </div>
    }
  </div>;
}

export default App;
