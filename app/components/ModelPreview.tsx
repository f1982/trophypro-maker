import React, { lazy, Suspense, useEffect, useState } from "react";

// lazy load to reduce the loading time
const Renderer = lazy(() =>
  import("jscad-react").then((lib) => {
    return { default: lib.default.Renderer };
  })
);

interface PreviewProp {
  models: any[];
}
let isHydrating = true;

export default function ModelPreview({ models }: PreviewProp) {
  const [isHydrated, setIsHydrated] = useState(!isHydrating);

  const [winWidth, setWinWidth] = useState(0);

  React.useEffect(() => {
    isHydrating = false;
    setIsHydrated(true);
    console.log('isHydrating', isHydrating);
  }, []);

  const renderLoader = () => <div>loading...</div>;

  // Make sure is in client side
  if (isHydrated) {
    const padding = 50;
    // resize the canvas to fill browser window dynamically
    window.onresize = () => {
      console.log("resize");
      setWinWidth(window.innerWidth - padding);
    };
    if (winWidth === 0) {
      setWinWidth(window.innerWidth - padding);
    }

    return (
      <div>
        <Suspense fallback={renderLoader()}>
          <Renderer solids={models} height={600} width={winWidth} />
        </Suspense>
      </div>
    );
  } else {
    return renderLoader()
  }
}
