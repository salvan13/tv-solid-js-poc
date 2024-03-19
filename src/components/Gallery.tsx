import { For, onMount } from "solid-js";
import styles from "./Gallery.module.css";
import { GalleryRow } from "./GalleryRow";
import { focusFirst, hasSavedFocus, restoreFocus } from "../lib/spatial-navigation";
import { smoothScroll } from "../lib/scroll";
import { PanelXPage } from "../lib/graph/loadPanelXPage";

export type GalleryProps = {
  id: string,
  data: PanelXPage;
};

export default function Gallery(props: GalleryProps) {
  let galleryEl: HTMLDivElement | undefined;

  onMount(async () => {
    if (hasSavedFocus(`gallery-${props.id}`)) {
      restoreFocus(`gallery-${props.id}`);
    } else {
      galleryEl && focusFirst(galleryEl);
    }
  });

  const onFocusIn = (e: FocusEvent) => {
    const rowEl = (e.target as HTMLElement).closest(".gallery-row") as HTMLElement;
    if (galleryEl && rowEl) {
      smoothScroll(galleryEl, "scrollTop", rowEl.offsetTop);
    }
  };

  return <div tabIndex={-1} ref={galleryEl} classList={{ "gallery": true, [styles.Gallery]: true }} onfocusin={onFocusIn}>
    <div>
      <For each={props.data.page.pagePanels.panels}>
        {(item, index) => <GalleryRow
          posters={item.posters.items.map(p => ({ id: p.id, title: p.details.focus.header, image: p.image.sourceNonEncoded }))}
          title={item.title}
          index={index()}
          galleryId={props.id} />
        }
      </For>
    </div>
  </div>;
}
