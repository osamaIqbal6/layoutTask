import React, { useState, useEffect, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "../Centerbox.css";

function Main() {
  const getRandomHeight = () => Math.floor(Math.random() * (91 - 80) + 80);

  const initialLayouts = [
    {
      items: [
        {
          id: "item-1-1",
          text: "Random text 1-1",
          height: getRandomHeight(),
          userChanged: true,
        },
        {
          id: "item-1-2",
          text: "Random text 1-2",
          height: getRandomHeight(),
          userChanged: true,
        },
        {
          id: "item-1-3",
          text: "Random text 1-3",
          height: getRandomHeight(),
          userChanged: true,
        },
        {
          id: "item-1-4",
          text: "Random text 1-4",
          height: getRandomHeight(),
          userChanged: true,
        },
      ],
    },
    {
      items: [
        {
          id: "item-2-1",
          text: "Random text 2-1",
          height: getRandomHeight(),
          userChanged: true,
        },
        {
          id: "item-2-2",
          text: "Random text 2-2",
          height: getRandomHeight(),
          userChanged: true,
        },
        {
          id: "item-2-3",
          text: "Random text 2-3",
          height: getRandomHeight(),
          userChanged: true,
        },
      ],
    },

    // More groups can be added here
  ];

  const [layouts, setLayouts] = useState(initialLayouts);
  const textAreaRefs = useRef({});

  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    const newLayouts = Array.from(layouts);

    // Swap the items of the source and destination groups
    const temp = newLayouts[source.index].items;
    newLayouts[source.index].items = newLayouts[destination.index].items;
    newLayouts[destination.index].items = temp;

    setLayouts(newLayouts);
  };

  const adjustLayouts = () => {
    const maxLayoutHeight = 500; // Maximum height for a layout
    const newLayouts = [];
    let currentLayout = { items: [] };
    let currentLayoutHeight = 0;

    layouts.forEach((group) => {
      group.items.forEach((obj) => {
        const objHeight = obj.userChanged
          ? textAreaRefs.current[obj.id].scrollHeight
          : obj.height;

        // Check if adding this item to the current layout would exceed the maximum height
        if (currentLayoutHeight + objHeight > maxLayoutHeight) {
          // If it exceeds, create a new layout and reset the current layout
          newLayouts.push(currentLayout);
          currentLayout = { items: [] };
          currentLayoutHeight = 0;
        }

        // Add the item to the current layout's items
        currentLayout.items.push({ ...obj, height: objHeight });
        currentLayoutHeight += objHeight;
      });
    });

    // Add the last layout to newLayouts
    if (currentLayout.items.length) {
      newLayouts.push(currentLayout);
    }

    // Update the layouts with the new arrangement
    setLayouts(newLayouts);
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

  const clickme = () => {
    const newId = `item-${layouts.flat().length + 1}`;
    const newObject = {
      id: newId,
      text: "Random text " + newId,
      height: getRandomHeight(),
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
        {layouts.map((group, groupIndex) => {
          const droppableId = `droppable-${groupIndex}`;
          const backgroundColor =
            backgroundColors[groupIndex % backgroundColors.length];

          return (
            <Droppable
              key={`droppable-${groupIndex}`}
              droppableId={`droppable-${groupIndex}`}
            >
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="centered-box"
                  style={{ backgroundColor }}
                >
                  <Draggable
                    key={`group-${groupIndex}`}
                    draggableId={`group-${groupIndex}`}
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
                          style={{
                            alignSelf: "flex-start",
                            color: "red",
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          Drag Group
                        </div>
                        {group.items &&
                          group.items.map((obj, objIndex) => (
                            <textarea
                              key={obj.id}
                              ref={(el) => (textAreaRefs.current[obj.id] = el)}
                              value={obj.text}
                              onChange={(e) =>
                                handleChange(groupIndex, obj.id, e.target.value)
                              }
                              style={{
                                fontSize: 20,
                                height: `110px`,
                                overflow: "hidden",
                              }}
                            ></textarea>
                          ))}
                      </div>
                    )}
                  </Draggable>
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          );
        })}
      </DragDropContext>
    </div>
  );
}

export default Main;
