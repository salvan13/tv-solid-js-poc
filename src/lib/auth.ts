import { setAppState } from "../stores/app-store";
import { getStandardHeaders } from "./headers";

export type AuthenticationDataOK = {
  type: "AuthenticationDataOK";
  accessToken: string;
  refreshToken: string;
  validTo: string;
  geoblock: boolean;
};

export type AuthenticationDataKO = {
  type: "AuthenticationDataKO";
  errorCode: string;
  errorMessage: string;
  errorReference: string;
};

export type AuthenticationDataResponse = AuthenticationDataOK | AuthenticationDataKO;

export type AuthenticationDataPending = {
  type: "AuthenticationDataPending";
  deviceCode: string;
  userCode: string;
  verificationUri: string;
  verificationUriComplete: string;
  expiresIn: number;
  interval: number;
};

const URL = "https://logingateway.clientapi-pilot.live.tv.telia.net/logingateway/rest/v1";
const headers = getStandardHeaders();
const deviceId = "test1";
const deviceType = "WEB";

const wait = (t: number) => new Promise((res) => setTimeout(res, t));

const refresh = async (): Promise<boolean> => {
  const refreshToken = localStorage.getItem("refresh-token");
  if (refreshToken) {
    try {
      const refresh = await (
        await fetch(`${URL}/login/refresh`, {
          method: "POST",
          headers: {
            ...headers,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            deviceId,
            deviceType,
            refreshToken
          })
        })
      ).json();
      const response = { type: refresh.accessToken ? "AuthenticationDataOK" : "AuthenticationDataKO", ...refresh } as AuthenticationDataResponse;
      if (response.type === "AuthenticationDataOK") {
        localStorage.setItem("refresh-token", response.refreshToken);
        setAppState({ authentication: response });
        return true;
      }
    } catch (e) {
      console.error(e);
    }
  };
  return false;
};

export const auth = async () => {
  if (await refresh()) {
    return;
  }

  const auth = ({
    type: "AuthenticationDataPending",
    ...await (
      await fetch(`${URL}/device/authorization?deviceId=${deviceId}&deviceType=${deviceType}`, {
        headers: {
          ...headers
        }
      })
    ).json()
  }) as AuthenticationDataPending;
  setAppState({ authentication: auth });

  while (true) {
    await wait((auth.interval || 5) * 1000);
    const poll = await (
      await fetch(`${URL}/device/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          ...headers
        },
        "body": "deviceCode=" + encodeURIComponent(auth.deviceCode)
      })
    ).json();
    const response = { type: poll.accessToken ? "AuthenticationDataOK" : "AuthenticationDataKO", ...poll } as AuthenticationDataResponse;
    if (response.type === "AuthenticationDataOK") {
      localStorage.setItem("refresh-token", response.refreshToken);
      setAppState({ authentication: response });
      break;
    }
    if (response.type === "AuthenticationDataKO") {
      if (response.errorCode === "50015") {
        // authorization pending
        continue;
      } else {
        setAppState({ authentication: response });
        break;
      }
    }
  }
};
