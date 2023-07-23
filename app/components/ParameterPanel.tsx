import { useControls } from "leva";
import LevaConfig from "~/LevaConfig";

export default function ParameterPanel() {
  const { name, aNumber } = useControls({ name: "World", aNumber: 0 });

  return (
    <div>
      <h3>ParameterPanel</h3>
      <div>{name}</div>
      <div>{aNumber}</div>
      <LevaConfig />
    </div>
  );
}
