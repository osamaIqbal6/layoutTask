import React from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { adjustBothLayouts } from "../Helpers/helpers";
const Layout = ({
  displayLayouts,
  refs,
  onTextChange,
  onManualResize,
  isLeft,
  leftLayouts,
  rightLayouts,
  commonRef,
  setLeftDisplayLayouts,
  setRightDisplayLayouts,
}) => {
  return (
    <div className="flex flex-col">
      {displayLayouts.map((group, groupIndex) => (
        <Droppable
          key={groupIndex}
          droppableId={`${isLeft ? "left" : "right"}-droppable-${groupIndex}`}
        >
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="centered-box flex flex-col justify-start items-center w-300 h-700 pt-30 mb-10"
            >
              <Draggable
                key={groupIndex}
                draggableId={`${
                  isLeft ? "left" : "right"
                }-draggable-${groupIndex}`}
                index={groupIndex}
              >
                {(providedDraggable) => (
                  <div
                    ref={providedDraggable.innerRef}
                    {...providedDraggable.draggableProps}
                  >
                    <div
                      className="drag-handle"
                      {...providedDraggable.dragHandleProps}
                      style={{ color: "red", display: "flex" }}
                    >
                      Drag
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      {group.items.map((obj, objIndex) => (
                        <div
                          key={obj.id}
                          style={{
                            marginBottom: "5px",
                            backgroundColor:
                              obj.groupTitle === "Skills"
                                ? "lightgrey"
                                : "lightyellow",
                          }}
                        >
                          <div className="group-title-label">
                            <p
                              style={{
                                color: "black",
                                fontWeight: "bold",
                                margin: 0,
                              }}
                            >
                              {obj.groupTitle}
                            </p>
                          </div>
                          <textarea
                            id={obj.id}
                            ref={(el) => {
                              refs.current.textAreaRefs[obj.id] = el;
                              if (el && obj.userChanged) {
                                refs.current.manuallySetHeights[obj.id] =
                                  el.offsetHeight;
                              }
                            }}
                            value={obj.text}
                            style={{
                              fontSize: 20,
                              height:
                                refs.current.manuallySetHeights[obj.id] ||
                                "110px",
                              overflow: "hidden",
                              margin: 5,
                              color: "black",
                            }}
                            onChange={(e) =>
                              onTextChange(
                                group.groupTitle,
                                obj.id,
                                e.target.value,
                                setDisplayLayouts
                              )
                            }
                            onBlur={() =>
                              onManualResize(obj.id, refs, () =>
                                adjustBothLayouts(
                                  leftLayouts,
                                  rightLayouts,
                                  commonRef,
                                  setLeftDisplayLayouts,
                                  setRightDisplayLayouts
                                )
                              )
                            }
                          />
                        </div>
                      ))}
                    </div>
                    {provided.placeholder}
                  </div>
                )}
              </Draggable>
            </div>
          )}
        </Droppable>
      ))}
    </div>
  );
};

export default Layout;
