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
} from "../Helpers/helpers";
import Layout from "./Layout";

function Main() {
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

  return (
    <div className="maindiv gap-5">
      <DragDropContext
        onDragEnd={(result) =>
          onDragEnd(
            result,
            leftLayouts,
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
        <Layout
          displayLayouts={leftDisplayLayouts}
          refs={commonRefs}
          onTextChange={handleTextChange}
          onManualResize={handleManualResize}
          isLeft={true}
          leftLayouts={leftLayouts}
          rightLayouts={rightLayouts}
          commonRef={commonRefs}
          setLeftDisplayLayouts={setLeftDisplayLayouts}
          setRightDisplayLayouts={setRightDisplayLayouts}
        />
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
      </DragDropContext>
    </div>
  );
}

export default Main;
