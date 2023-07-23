import { Leva } from "leva";

export default function LevaConfig() {
  return (
    <>
      <Leva
        // theme={myTheme} // you can pass a custom theme (see the styling section)
        fill={true} // default = false,  true makes the pane fill the parent dom node it's rendered in
        flat={false} // default = false,  true removes border radius and shadow
        oneLineLabels // default = false, alternative layout for labels, with labels and fields on separate rows
        collapsed={false} // default = false, when true the GUI is collpased
        hidden={false} // default = false, when true the GUI is hidden
        titleBar={false}
      />
    </>
  );
}
