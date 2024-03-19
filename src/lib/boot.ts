import { auth } from "./auth";
import { setAppState } from "../stores/app-store";

export const boot = async () => {
  setAppState({ state: "authenticating" });
  try {
    await auth();
  } catch(e) {
    console.error("auth failed", e);
  }

  setAppState({ state: "ready" });
};
