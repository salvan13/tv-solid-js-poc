import { getStandardHeaders } from "../headers";

const URL = "https://graphql-telia.t6a-stage.net/graphql";
const headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
  ...getStandardHeaders()
};

export const graphRequest = async <T>(query: string, variables: any): Promise<T> => {
  return (
    await (
      await fetch(URL, {
        method: "POST",
        headers: {
          ...headers
        },
        body: JSON.stringify({
          query: query,
          variables
        })
      })
    ).json()
  ).data;
};
