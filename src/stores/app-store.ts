import { createStore } from "solid-js/store";
import { AuthenticationDataResponse, AuthenticationDataPending } from "../lib/auth";

type AppStore = {
  state: "loading" | "authenticating" | "ready";
  authentication: null | AuthenticationDataResponse | AuthenticationDataPending;
};

export const [appState, setAppState] = createStore<AppStore>({
  state: "loading",
  authentication: null
});
