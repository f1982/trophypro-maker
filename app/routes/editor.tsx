import { Geom3 } from "@jscad/modeling/src/geometries/types";
import { Link } from "@remix-run/react";
import { useControls } from "leva";
import { debounce } from "lodash";
import { useMemo, useState } from "react";
import ModelPreview from "~/components/ModelPreview";
import { getTrophy, getTrophyDebounce, TrophyProps } from "~/components/Models";
import { paramConfiguration } from "~/components/Trophy/trophy-parameters";
import LevaConfig from "~/LevaConfig";
import { saveSTL } from "~/utils/jscad-utils";

export default function Editor() {
  const params = useControls(paramConfiguration);

  const [models, setModels] = useState<Geom3[]>(getTrophy(params));

  const trophyModels = useMemo(() => {
    return getTrophy(params);
    // return getTrophyDebounce(params);
    // return debounce<(params: TrophyProps)=>Geom3[]>(getTrophy, 1000);
  }, [params]);

  return (
    <div className="h-full">
      <header className="h-12 bg-slate-100">
        <div className="flex flex-row justify-between p-4">
          <Link to={"/"}>Trophy Maker</Link>
          {/* <button
            onClick={() => {
              saveSTL("your-trophy", trophyModels);
            }}
          >
            Download STL
          </button> */}
        </div>
      </header>
      <div className="flex flex-col p-8">
        <div>
          <ModelPreview models={trophyModels} />
        </div>
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
