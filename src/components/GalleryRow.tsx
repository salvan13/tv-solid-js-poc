import { For } from "solid-js";
import styles from "./GalleryRow.module.css";
import Poster, { PosterType } from "./Poster";
import { smoothScroll } from "../lib/scroll";

export type GalleryType = {
  title: string;
  posters: PosterType[];
};

export type GalleryRowProps = {
  galleryId: string;
} & GalleryType;

export function GalleryRow(props: GalleryRowProps & { index: number; }) {
  let rowEl: HTMLDivElement | undefined;

  const onFocusIn = (e: FocusEvent) => {
    if (rowEl && (e.target as HTMLElement).classList.contains("poster")) {
      smoothScroll(rowEl, "scrollLeft", (e.target as HTMLElement).offsetLeft);
    }
  };

  return <div classList={{ "gallery-row": true, [styles.GalleryRow]: true }}>
    <h2>{props.title}</h2>
    <div ref={rowEl} class={styles.GalleryItems} tabIndex={-1} onfocusin={onFocusIn}
      data-focus-container data-focus-left="#main-menu"
      data-focus-down={`.gallery .gallery-row:nth-child(${props.index + 2})`}
      data-focus-up={`.gallery .gallery-row:nth-child(${props.index})`}>
      <For each={props.posters}>
        {(item, index) => <Poster poster={item} index={index()} galleryId={props.galleryId} />}
      </For>
    </div>
  </div>;
}
