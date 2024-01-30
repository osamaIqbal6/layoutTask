import React, { useState, useEffect, useRef } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import "../Centerbox.css";
import "../index.css";
import { initialLeftLayouts, initialRightLayouts } from "./InitialComponents";
import {
  adjustLayouts,
  handleManualResize,
  handleTextChange,
  onDragEnd,
  generatePDF,
} from "../Helpers/helpers";
import Layout from "./Layout";

function Main() {
  const [mergeLayouts, setMergeLayouts] = useState(false);

  const [leftDisplayLayouts, setLeftDisplayLayouts] =
    useState(initialLeftLayouts);
  const [leftLayouts, setLeftLayouts] = useState(initialLeftLayouts);

  const [rightDisplayLayouts, setRightDisplayLayouts] =
    useState(initialRightLayouts);
  const [rightLayouts, setRightLayouts] = useState(initialRightLayouts);

  const commonRefs = useRef({
    textAreaRefs: {},
    manuallySetHeights: {},
  });
  useEffect(() => {
    adjustLayouts(leftLayouts, commonRefs, setLeftDisplayLayouts);
    adjustLayouts(rightLayouts, commonRefs, setRightDisplayLayouts);
  }, [leftLayouts, rightLayouts]);

  const mergeRightToLeft = () => {
    if (mergeLayouts) {
      return [
        ...leftLayouts,
        ...rightLayouts.map((layout) => ({ ...layout, groupTitle: "Merged" })),
      ];
    }

    return leftLayouts;
  };

  return (
    <div>
      <button onClick={generatePDF}>Click Me</button>
      <button onClick={() => setMergeLayouts(!mergeLayouts)}>
        {mergeLayouts ? "Separate Layouts" : "Merge Layouts"}
      </button>

      <div className="maindiv gap-5 ">
        <DragDropContext
          onDragEnd={(result) =>
            onDragEnd(
              result,
              mergeLayouts ? mergeRightToLeft() : leftLayouts,
              rightLayouts,
              setLeftLayouts,
              setRightLayouts,
              leftDisplayLayouts,
              rightDisplayLayouts,
              setLeftDisplayLayouts,
              setRightDisplayLayouts,
              commonRefs
            )
          }
        >
          <div className={mergeLayouts ? "w-full" : "w-1/2"}>
            <Layout
              displayLayouts={
                mergeLayouts ? mergeRightToLeft() : leftDisplayLayouts
              }
              refs={commonRefs}
              onTextChange={handleTextChange}
              onManualResize={handleManualResize}
              isLeft={true}
              leftLayouts={mergeLayouts ? mergeRightToLeft() : leftLayouts}
              rightLayouts={rightLayouts}
              commonRef={commonRefs}
              setLeftDisplayLayouts={setLeftDisplayLayouts}
              setRightDisplayLayouts={setRightDisplayLayouts}
            />
          </div>
          {!mergeLayouts && (
            <div className="w-1/2">
              <Layout
                displayLayouts={rightDisplayLayouts}
                refs={commonRefs}
                onTextChange={handleTextChange}
                onManualResize={handleManualResize}
                isLeft={false}
                leftLayouts={leftLayouts}
                rightLayouts={rightLayouts}
                commonRef={commonRefs}
                setLeftDisplayLayouts={setLeftDisplayLayouts}
                setRightDisplayLayouts={setRightDisplayLayouts}
              />
            </div>
          )}
        </DragDropContext>
      </div>
    </div>
  );
}

export default Main;
