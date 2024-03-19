import { saveFocus } from "../lib/spatial-navigation";
import styles from "./Poster.module.css";

export type PosterProps = {
  index: number,
  galleryId: string,
  poster: PosterType;
};

export type PosterType = {
  id: string,
  title: string,
  image?: string;
};

export default function Poster(props: PosterProps) {
  const onFocus = (e: FocusEvent) => {
    saveFocus(`gallery-${props.galleryId}`, (e.target as HTMLElement));
  };

  return <a classList={{ poster: true, [styles.Poster]: true }}
    data-focus-id={`poster-${props.poster.id}`}
    href={`#/details/${props.poster.id}`}
    onfocus={onFocus}
  >
    <span>{props.poster.title}</span>
    {props.poster.image && <img src={props.poster.image} alt={props.poster.title} />}
  </a>;
}
