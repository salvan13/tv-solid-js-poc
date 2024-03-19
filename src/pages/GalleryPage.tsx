import { useParams } from "@solidjs/router";
import Gallery from "../components/Gallery";
import { Show, createResource } from "solid-js";
import { loadPanelXPage } from "../lib/graph/loadPanelXPage";

export function GalleryPage() {
  const params = useParams();
  const [data] = createResource(() => params.id, loadPanelXPage);

  return <Show keyed when={params.id}>
    {data.state === "ready" && <Gallery id={params.id} data={data()} />}
  </Show>;
}