import React, { useState, useEffect, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "../Centerbox.css";
import "../index.css";
import { initialLeftLayouts, initialRightLayouts } from "./InitialComponents";
import {
  areLayoutsSame,
  adjustLayouts,
  handleManualResize,
  handleTextChange,
  onDragEnd,
  adjustBothLayouts,
} from "./helpers";
import Layout from "./Layout";

function Main() {
  const [leftDisplayLayouts, setLeftDisplayLayouts] =
    useState(initialLeftLayouts);
  const [leftLayouts, setLeftLayouts] = useState(initialLeftLayouts);
  const leftRefs = useRef({
    textAreaRefs: {},
    manuallySetHeights: {},
    userInitiatedChange: {},
  });

  const [rightDisplayLayouts, setRightDisplayLayouts] =
    useState(initialRightLayouts);
  const [rightLayouts, setRightLayouts] = useState(initialRightLayouts);
  const rightRefs = useRef({
    textAreaRefs: {},
    manuallySetHeights: {},
    userInitiatedChange: {},
  });
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
            leftRefs,
            rightRefs
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
