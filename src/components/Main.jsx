import React, { useState, useEffect, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "../Centerbox.css";

function Main() {

  const initialLayouts = [
    {
      items: [
        {
          groupTitle: "Experiences", // Add groupTitle field to items
          id: "item-1-1",
          text: "Hello 1",
         
          userChanged: true,
        },
        {
          groupTitle: "Experiences", // Add groupTitle field to items
          id: "item-1-2",
          text: "Hello 2",
         
          userChanged: true,
        },
        {
          groupTitle: "Experiences", // Add groupTitle field to items
          id: "item-1-3",
          text: "Hello 3",
         
          userChanged: true,
        },
        {
          groupTitle: "Experiences", // Add groupTitle field to items
          id: "item-1-4",
          text: "Hello 4",
         
          userChanged: true,
        },
      ],
    },
    {
      items: [
        {
          groupTitle: "Projects", // Add groupTitle field to items
          id: "item-2-1",
          text: "Bye 1",
         
          userChanged: true,
        },
        {
          groupTitle: "Projects", // Add groupTitle field to items
          id: "item-2-2",
          text: "Bye 2",
         
          userChanged: true,
        },
        {
          groupTitle: "Projects", // Add groupTitle field to items
          id: "item-2-3",
          text: "Bye 3",
         
          userChanged: true,
        },
      ],
    },

    // More groups can be added here
  ];

  const [displayLayouts, setDisplayLayouts] = useState(initialLayouts);
  const [layouts, setLayouts] = useState(initialLayouts);
  const textAreaRefs = useRef({});

  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    const newLayouts = Array.from(layouts);

    // Swap the items and group titles of the source and destination groups
    const tempItems = newLayouts[source.index].items;
    const tempTitle = newLayouts[source.index].groupTitle;

    newLayouts[source.index].items = newLayouts[destination.index].items;
    newLayouts[source.index].groupTitle =
      newLayouts[destination.index].groupTitle;

    newLayouts[destination.index].items = tempItems;
    newLayouts[destination.index].groupTitle = tempTitle;

    setLayouts(newLayouts);
    adjustLayouts();
  };

  const adjustLayouts = () => {
    const maxLayoutHeight = 500; // Maximum height for a layout
    const newLayouts = [];
    let currentLayout = null; // Initialize currentLayout as null
    let currentLayoutHeight = 0;
    let remainingHeightInLayout = maxLayoutHeight; // Initialize the remaining height in the layout

    layouts.forEach((group, groupIndex) => {
      group.items.forEach((obj, index) => {
        const objHeight = obj.userChanged
          ? textAreaRefs.current[obj.id].scrollHeight
          : obj.height;

        // Check if adding this item to the current layout would exceed the remaining height
        if (objHeight <= remainingHeightInLayout) {
          // If it fits, add the item to the current layout
          if (!currentLayout) {
            currentLayout = { items: [] };
          }
          currentLayout.items.push({ ...obj, height: objHeight });
          currentLayoutHeight += objHeight;
          remainingHeightInLayout -= objHeight;
        } else {
          // If it doesn't fit, create a new layout
          if (currentLayout) {
            newLayouts.push(currentLayout);
          }
          currentLayout = null; // Reset currentLayout
          currentLayoutHeight = 0;
          remainingHeightInLayout = maxLayoutHeight;

          // Add the item to the new layout
          if (!currentLayout) {
            currentLayout = { items: [] };
          }
          currentLayout.items.push({ ...obj, height: objHeight });
          currentLayoutHeight += objHeight;
          remainingHeightInLayout -= objHeight;

          // Check if there's a next group
          if (layouts[groupIndex + 1]) {
            const nextGroup = layouts[groupIndex + 1];
            if (
              !currentLayout.items.some(
                (item) => item.group === nextGroup.groupTitle
              )
            ) {
              for (const nextObj of nextGroup.items) {
                const nextObjHeight = nextObj.userChanged
                  ? textAreaRefs.current[nextObj.id].scrollHeight
                  : nextObj.height;
                if (nextObjHeight <= remainingHeightInLayout) {
                  // Add the item from the next group to the current layout
                  currentLayout.items.push({
                    ...nextObj,
                    height: nextObjHeight,
                    group: nextGroup.groupTitle,
                  });
                  currentLayoutHeight += nextObjHeight;
                  remainingHeightInLayout -= nextObjHeight;
                } else {
                  // If it doesn't fit, stop adding items from the next group
                  break;
                }
              }
            }
          }
        }

        // If it's the last item of the group and there's more than one group, create a new layout
        if (index === group.items.length - 1 && layouts.length > 1) {
          if (currentLayout) {
            newLayouts.push(currentLayout);
          }
          currentLayout = null;
          currentLayoutHeight = 0;
          remainingHeightInLayout = maxLayoutHeight;
        }
      });
    });

    // Add the last layout to newLayouts if it's not null
    if (currentLayout) {
      newLayouts.push(currentLayout);
    }

    // Update the display layout with the new arrangement
    setDisplayLayouts(newLayouts);
  };

  useEffect(() => {
    const observer = new ResizeObserver(adjustLayouts);
    Object.values(textAreaRefs.current).forEach((textarea) => {
      if (textarea) {
        observer.observe(textarea);
      }
    });

    return () => observer.disconnect();
  }, [layouts]);

  const handleManualResize = (id) => {
    const textarea = textAreaRefs.current[id];
    if (textarea && textarea.prevHeight !== textarea.offsetHeight) {
      textarea.prevHeight = textarea.offsetHeight;
      handleHeightAdjustment(id);
    }
  };

  const handleHeightAdjustment = (id) => {
    const textarea = textAreaRefs.current[id];
    if (textarea) {
      const scrollHeight = textarea.scrollHeight;
      if (textarea.objHeight !== scrollHeight) {
        textarea.style.height = `${scrollHeight}px`;
        textarea.objHeight = scrollHeight;
        adjustLayouts();
      }
    }
  };

  const handleChange = (groupId, itemId, newText) => {
    const newLayouts = layouts.map((group, gIndex) =>
      gIndex === groupId
        ? group.map((item) =>
            item.id === itemId
              ? { ...item, text: newText, userChanged: true }
              : item
          )
        : group
    );
    setLayouts(newLayouts);
  };

  const clickme = () => { // Will be seperate for each section, Where you want to add another block
    const newId = `item-${layouts.flat().length + 1}`;
    const newObject = {
      id: newId,
      text: "Random text " + newId,
     
      userChanged: true,
    };

    setLayouts((prevLayouts) => {
      const lastLayout = prevLayouts[prevLayouts.length - 1];
      return lastLayout
        ? [...prevLayouts.slice(0, -1), [...lastLayout, newObject]]
        : [[newObject]];
    });
  };
  const handleDownloadClick = async () => {
    const response = await fetch("http://192.168.18.57:3001/generate-pdf");
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "page.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };
  const backgroundColors = [
    "lightblue",
    "lightgreen",
    "lightcoral",
    "lightgrey",
  ];
  return (
    <div className="maindiv">
      {/* <button title="Click me" id="clickme" onClick={clickme}>
        Click Me
      </button>
      <button onClick={handleDownloadClick}>Download as PDF</button> */}
      <DragDropContext onDragEnd={onDragEnd}>
        {displayLayouts.map((group, groupIndex) => (
          <Droppable key={groupIndex} droppableId={`droppable-${groupIndex}`}>
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="centered-box"
                style={{
                  backgroundColor:
                    backgroundColors[groupIndex % backgroundColors.length],
                }}
              >
                <Draggable
                  key={groupIndex}
                  draggableId={`draggable-${groupIndex}`}
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
                        onClick={() => console.log(displayLayouts)}
                      >
                        Drag
                      </div>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <div className="group-title-label">
                          <p
                            style={{
                              color: "black",
                              fontWeight: "bold",
                              margin: 0,
                            }}
                          >
                            {group.items[0].groupTitle}
                          </p>
                        </div>
                        {group.items.map((obj, objIndex) => (
                          <div key={obj.id} style={{ marginBottom: "5px" }}>
                            <textarea
                              ref={(el) => (textAreaRefs.current[obj.id] = el)}
                              value={obj.text}
                              style={{
                                fontSize: 20,
                                height: "110px",
                                overflow: "hidden",
                                margin: 5,
                              }}
                              onChange={(e) =>
                                handleChange(
                                  group.groupTitle,
                                  obj.id,
                                  e.target.value
                                )
                              }
                              onBlur={() => handleManualResize(obj.id)}
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
      </DragDropContext>
    </div>
  );
}

export default Main;
