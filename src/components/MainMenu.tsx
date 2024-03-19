import { For } from "solid-js";
import styles from "./MainMenu.module.css";
import { MainMenuItem, MainMenuItemProps } from "./MainMenuItem";

export type MainMenuProps = {
  items: MainMenuItemProps[];
};

export default function MainMenu(props: MainMenuProps) {
  return <div id="main-menu" class={styles.MainMenu} data-focus-container data-focus-right=".gallery">
    <For each={props.items}>
      {item => <MainMenuItem id={item.id} label={item.label} />}
    </For>
  </div>;
}
