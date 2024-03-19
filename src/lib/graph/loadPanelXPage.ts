import { graphRequest } from "./graph";

export type PanelXPage = {
  page: {
    __typename: string;
    id: string;
    title: string;
    pagePanels:
    {
      __typename: string;
      id: string;
      panels:
      {
        __typename: string;
        id: string;
        title: string;
        posters:
        {
          __typename: string;
          id: string;
          items: {
            id: string;
            __typename: string;
            details: {
              focus: {
                header: string;
              };
            };
            image: {
              __typename: string;
              contentType: string;
              sourceNonEncoded: string;
              source: string;
            };
          }[];
        };
      }[];
    };
  };
};

const query = `query PanelXPage($id: String!) {
  page(id: $id) {
    __typename
    id
    title
    pagePanels {
      __typename
      id
      panels {
        __typename
        ... on PosterListPanel {
          __typename
          id
          title
          posters {
            id
            items {
              __typename
              id
              details {
                focus {
                  header
                }
              }
              image {
                __typename
                contentType
                sourceNonEncoded
                source
              }
            }
          }
        }
      }
    }
  }
}`;

export const loadPanelXPage = async (pageId: string) => {
  const data = await graphRequest<PanelXPage>(query, { id: pageId });
  data.page.pagePanels.panels = data.page.pagePanels.panels.filter(panel => panel.__typename === "PosterListPanel");
  return data;
};
