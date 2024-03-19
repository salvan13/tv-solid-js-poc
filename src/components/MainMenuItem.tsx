export type MainMenuItemProps = {
  id: string,
  label: string;
};

export  function MainMenuItem(props: MainMenuItemProps) {
  return <a href={`#/${props.id}`}>{props.label}</a>;
}
