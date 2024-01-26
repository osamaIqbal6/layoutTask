import React, { useState, useEffect, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "../Centerbox.css";

function Main() {
  const initialLayouts = [
    //Initial State of ours.
    {
      items: [
        {
          groupTitle: "Experiences",
          id: "item-1-1",
          text: "Hello 1",
          groupid: 0,
          userChanged: true,
        },
        {
          groupTitle: "Experiences",
          id: "item-1-2",
          text: "Hello 2",
          groupid: 0,
          userChanged: true,
        },
        {
          groupTitle: "Experiences",
          id: "item-1-3",
          text: "Hello 3",
          groupid: 0,
          userChanged: true,
        },
        {
          groupTitle: "Experiences",
          id: "item-1-4",
          text: "Hello 4",
          groupid: 0,
          userChanged: true,
        },
      ],
    },
    {
      items: [
        {
          groupTitle: "Projects",
          id: "item-2-1",
          text: "Bye 1",
          groupid: 1,
          userChanged: true,
        },
        {
          groupTitle: "Projects",
          id: "item-2-2",
          text: "Bye 2",
          groupid: 1,
          userChanged: true,
        },
        {
          groupTitle: "Projects",
          id: "item-2-3",
          text: "Bye 3",
          groupid: 1,
          userChanged: true,
        },
      ],
    },
  ];

  const [displayLayouts, setDisplayLayouts] = useState(initialLayouts);
  const [layouts, setLayouts] = useState(initialLayouts);
  const textAreaRefs = useRef({});
  const manuallySetHeights = useRef({});
  const userInitiatedChange = useRef({});

  // Helper function to check if layouts are the same
  const areLayoutsSame = (layouts, displayLayouts) => {
    if (layouts.length !== displayLayouts.length) {
      return false;
    }

    for (let i = 0; i < layouts.length; i++) {
      if (
        layouts[i].items.length !== displayLayouts[i].items.length ||
        layouts[i].groupTitle !== displayLayouts[i].groupTitle
      ) {
        return false;
      }
    }

    return true;
  };

  const onDragEnd = (result) => {
    //This is the main function thatt is called when Dragging Ends
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    // Check if layouts and displayLayouts are the same
    const sameLayouts = areLayoutsSame(layouts, displayLayouts);

    if (sameLayouts) {
      // if the displayLayout and Main Layout are same

      const newLayouts = Array.from(layouts);
      const tempItems = newLayouts[source.index].items;
      const tempTitle = newLayouts[source.index].groupTitle;

      newLayouts[source.index].items = newLayouts[destination.index].items;
      newLayouts[source.index].groupTitle =
        newLayouts[destination.index].groupTitle;

      newLayouts[destination.index].items = tempItems;
      newLayouts[destination.index].groupTitle = tempTitle;

      setLayouts(newLayouts);
    } else {
      // If layouts and displayLayouts are different then we need to consider different replacing scenarios
      const sourceDisplayGroup = displayLayouts[source.index];
      const destinationDisplayGroup = displayLayouts[destination.index];
      console.log("source", sourceDisplayGroup);
      console.log("destination", destinationDisplayGroup);

      if (sourceDisplayGroup && destinationDisplayGroup) {
        const sourceGroupId = sourceDisplayGroup.items[0].groupid;
        const destinationGroupId = destinationDisplayGroup.items[0].groupid;

        const newLayouts = Array.from(layouts);
        const tempGroup = newLayouts[sourceGroupId];
        newLayouts[sourceGroupId] = newLayouts[destinationGroupId];
        newLayouts[destinationGroupId] = tempGroup;

        setLayouts(newLayouts);
      }
    }

    adjustLayouts();
  };
  useEffect(() => {
    // Need to adjust the layout everytime the layout Changes after Dragging
    adjustLayouts();
  }, [layouts]);

  const adjustLayouts = () => {
    // main function that adjusts the layouts on the basis of height and arranges them
    const maxLayoutHeight = 500;
    let newLayouts = [];
    let currentLayout = { items: [], height: 0 };

    // Flatten all items and keep track of their original group index
    let allItems = layouts.flatMap((group, groupIndex) =>
      group.items.map((item) => ({ ...item, originalGroup: groupIndex }))
    );

    // Sort items by their original group to maintain order when moving between layouts
    allItems = allItems.sort((a, b) => a.originalGroup - b.originalGroup);

    allItems.forEach((item) => {
      // Use stored height if available, otherwise fall back to scrollHeight or default height
      let itemHeight = manuallySetHeights.current[item.id];
      if (!itemHeight) {
        itemHeight = item.userChanged
          ? textAreaRefs.current[item.id].scrollHeight
          : item.height;
      }

      // If current layout can fit the item
      if (currentLayout.height + itemHeight <= maxLayoutHeight) {
        currentLayout.items.push(item);
        currentLayout.height += itemHeight;
      } else {
        // If the current layout is filled, push it to newLayouts and start a new one
        newLayouts.push(currentLayout);
        currentLayout = { items: [item], height: itemHeight };
      }
    });

    // Add the last layout if it has any items
    if (currentLayout.items.length > 0) {
      newLayouts.push(currentLayout);
    }

    // Update displayLayouts to match the new arrangement of items
    setDisplayLayouts(newLayouts.map((layout) => ({ items: layout.items })));
  };

  const handleManualResize = (id) => {
    const textarea = textAreaRefs.current[id];
    if (textarea) {
      manuallySetHeights.current[id] = textarea.offsetHeight;
      userInitiatedChange.current[id] = true; // Indicate this is a user-initiated change
      adjustLayouts();
    }
  };

  const handleChange = (groupId, itemId, newText) => {
    // Used to let the user write text in the Textareas
    const newDisplayLayouts = displayLayouts.map((group) => ({
      ...group,
      items: group.items.map((item) =>
        item.id === itemId
          ? { ...item, text: newText, userChanged: true }
          : item
      ),
    }));

    // Update the displayLayouts state with the new copy
    setDisplayLayouts(newDisplayLayouts);
  };

  const addNewBlock = () => {
    // This method added the new item into the state
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
    // Used to print the Two component
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

  return (
    <div className="maindiv">
      {/* <button title="Click me" id="clickme" onClick={addNewBlock}>
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
                style={{ backgroundColor: "antiquewhite" }}
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
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        {group.items.map((obj, objIndex) => (
                          <div
                            key={obj.id}
                            style={{
                              marginBottom: "5px",
                              backgroundColor:
                                obj.groupTitle == "Experiences"
                                  ? "lightblue"
                                  : "lightgreen",
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
                              id={obj.id} // Set the id attribute
                              ref={(el) => (textAreaRefs.current[obj.id] = el)}
                              value={obj.text}
                              style={{
                                fontSize: 20,
                                height:
                                  manuallySetHeights.current[obj.id] || "110px",
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
