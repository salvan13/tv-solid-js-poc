import { useParams } from "@solidjs/router";
import { Show } from "solid-js";

export function DetailsPage() {
  const params = useParams();
  return <Show keyed when={params.id}>
    <p>{params.id}</p>
  </Show>;
}