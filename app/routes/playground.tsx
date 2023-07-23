import { Link } from "@remix-run/react";
import { useMemo } from "react";
import LevaConfig from "~/LevaConfig";
import { nutsBoltsDemo } from "~/3d/universal/nuts-bolts";
import ModelPreview from "~/components/ModelPreview";
import { saveSTL } from "~/utils/jscad-utils";

export default function Editor() {

  const models = useMemo(() => {
    return nutsBoltsDemo();
  },[]);

  return (
    <div className="h-full">
      <header className="h-12 bg-slate-100">
        <div className="flex flex-row justify-between p-4">
          <Link to={"/"}>STL editor</Link>
          <button
            onClick={() => {
              saveSTL("your-trophy", models);
            }}
          >
            Download STL
          </button>
        </div>
      </header>
      <div className="flex flex-col p-8">
        <div>{models && <ModelPreview models={models} />}</div>
        <div style={{ height: "40vh", overflowY: "scroll" }}>
          <LevaConfig />
        </div>
      </div>
      <footer className="mt-4 flex justify-center">
        <span>20/06/2023 BoardPro Hackathon</span>
      </footer>
    </div>
  );
}
