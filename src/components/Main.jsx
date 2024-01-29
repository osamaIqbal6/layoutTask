import React, { useState, useEffect, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "../Centerbox.css";
import "../index.css";

function Main() {
  const leftinitialLayouts = [
    //Initial State of ours.
    {
      items: [
        {
          groupTitle: "Experiences",
          id: "item-1-1",
          text: "Experiences 1",
          groupid: 0,
          userChanged: true,
        },
        {
          groupTitle: "Experiences",
          id: "item-1-2",
          text: "Experiences 2",
          groupid: 0,
          userChanged: true,
        },
        {
          groupTitle: "Experiences",
          id: "item-1-3",
          text: "Experiences 3",
          groupid: 0,
          userChanged: true,
        },
        {
          groupTitle: "Experiences",
          id: "item-1-4",
          text: "Experiences 4",
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
          text: "Projects 1",
          groupid: 1,
          userChanged: true,
        },
        {
          groupTitle: "Projects",
          id: "item-2-2",
          text: "Projects 2",
          groupid: 1,
          userChanged: true,
        },
        {
          groupTitle: "Projects",
          id: "item-2-3",
          text: "Projects 3",
          groupid: 1,
          userChanged: true,
        },
      ],
    },
  ];
  const rightinitialLayouts = [
    //Initial State of ours.
    {
      items: [
        {
          groupTitle: "Skills",
          id: "item-3-1",
          text: "Skills 1",
          groupid: 0,
          userChanged: true,
        },
        {
          groupTitle: "Skills",
          id: "item-3-2",
          text: "Skills 2",
          groupid: 0,
          userChanged: true,
        },
        {
          groupTitle: "Skills",
          id: "item-3-3",
          text: "Skills 3",
          groupid: 0,
          userChanged: true,
        },
        {
          groupTitle: "Skills",
          id: "item-3-4",
          text: "Skills 4",
          groupid: 0,
          userChanged: true,
        },
      ],
    },
    {
      items: [
        {
          groupTitle: "Refs",
          id: "item-4-1",
          text: "Refs 1",
          groupid: 1,
          userChanged: true,
        },
        {
          groupTitle: "Refs",
          id: "item-4-2",
          text: "Refs 2",
          groupid: 1,
          userChanged: true,
        },
        {
          groupTitle: "Refs",
          id: "item-4-3",
          text: "Refs 3",
          groupid: 1,
          userChanged: true,
        },
      ],
    },
  ];
  const [leftDisplayLayouts, setLeftDisplayLayouts] =
    useState(leftinitialLayouts);
  const [leftLayouts, setLeftLayouts] = useState(leftinitialLayouts);
  const lefttextAreaRefs = useRef({});
  const leftmanuallySetHeights = useRef({});
  const leftuserInitiatedChange = useRef({});
  const [rightDisplayLayouts, setRightDisplayLayouts] =
    useState(rightinitialLayouts);
  const [rightLayouts, setrightLayouts] = useState(rightinitialLayouts);
  const righttextAreaRefs = useRef({});
  const rightmanuallySetHeights = useRef({});
  const rightuserInitiatedChange = useRef({});

  // Helper function to check if layouts are the same
  const areLayoutsSame = (layouts, displayLayouts) => {
    // Check if the lengths of layouts and displayLayouts are different
    if (layouts.length !== displayLayouts.length) {
      return false;
    }

    // Check if any individual group's items or groupTitle is different
    return layouts.every((layout, i) => {
      return (
        layout.items.length === displayLayouts[i].items.length &&
        layout.groupTitle === displayLayouts[i].groupTitle
      );
    });
  };

  const onMainDrag = (result) => {
    const { source, destination } = result;
    console.log(source);
    console.log(destination);
    // If the item is dropped outside a droppable area
    if (!destination) {
      return;
    }

    // Check if both source and destination droppable IDs start with "left"
    const isLeftLayout =
      source.droppableId.startsWith("left") &&
      destination.droppableId.startsWith("left");

    // Check if both source and destination droppable IDs start with "right"
    const isRightLayout =
      source.droppableId.startsWith("right") &&
      destination.droppableId.startsWith("right");

    if (isLeftLayout) {
      const sameLayouts = areLayoutsSame(leftLayouts, leftDisplayLayouts);

      if (sameLayouts) {
        // if the displayLayout and Main Layout are same

        const newLayouts = Array.from(leftLayouts);
        const tempItems = newLayouts[source.index].items;
        const tempTitle = newLayouts[source.index].groupTitle;

        newLayouts[source.index].items = newLayouts[destination.index].items;
        newLayouts[source.index].groupTitle =
          newLayouts[destination.index].groupTitle;

        newLayouts[destination.index].items = tempItems;
        newLayouts[destination.index].groupTitle = tempTitle;

        setLeftLayouts(newLayouts);
      } else {
        // If layouts and displayLayouts are different then we need to consider different replacing scenarios
        const sourceDisplayGroup = leftDisplayLayouts[source.index];
        const destinationDisplayGroup = leftDisplayLayouts[destination.index];

        if (sourceDisplayGroup && destinationDisplayGroup) {
          // if the two groups are different
          const sourceGroupId = sourceDisplayGroup.items[0].groupid;
          const destinationGroupId = destinationDisplayGroup.items[0].groupid;

          const newLayouts = Array.from(leftLayouts);
          const tempGroup = newLayouts[sourceGroupId];
          newLayouts[sourceGroupId] = newLayouts[destinationGroupId];
          newLayouts[destinationGroupId] = tempGroup;

          setLeftLayouts(newLayouts);
        }
      }

      adjustLeftLayouts();
    } else if (isRightLayout) {
      const sameLayouts = areLayoutsSame(rightLayouts, rightDisplayLayouts);

      if (sameLayouts) {
        // if the displayLayout and Main Layout are same

        const newLayouts = Array.from(rightLayouts);
        const tempItems = newLayouts[source.index].items;
        const tempTitle = newLayouts[source.index].groupTitle;

        newLayouts[source.index].items = newLayouts[destination.index].items;
        newLayouts[source.index].groupTitle =
          newLayouts[destination.index].groupTitle;

        newLayouts[destination.index].items = tempItems;
        newLayouts[destination.index].groupTitle = tempTitle;

        setrightLayouts(newLayouts);
      } else {
        // If layouts and displayLayouts are different then we need to consider different replacing scenarios
        const sourceDisplayGroup = rightDisplayLayouts[source.index];
        const destinationDisplayGroup = rightDisplayLayouts[destination.index];

        if (sourceDisplayGroup && destinationDisplayGroup) {
          // if the two groups are different
          const sourceGroupId = sourceDisplayGroup.items[0].groupid;
          const destinationGroupId = destinationDisplayGroup.items[0].groupid;

          const newLayouts = Array.from(rightLayouts);
          const tempGroup = newLayouts[sourceGroupId];
          newLayouts[sourceGroupId] = newLayouts[destinationGroupId];
          newLayouts[destinationGroupId] = tempGroup;

          setrightLayouts(newLayouts);
        }
      }
      adjustRightLayouts();
    } else {
      const newLeftLayouts = Array.from(leftLayouts);
      const newRightLayouts = Array.from(rightLayouts);
      const tempItems = newLeftLayouts[source.index].items;

      newLeftLayouts[source.index].items =
        newRightLayouts[destination.index].items;

      newRightLayouts[destination.index].items = tempItems;
      console.log(newLeftLayouts);
      console.log(newRightLayouts);
      setLeftLayouts(newLeftLayouts);
      setrightLayouts(newRightLayouts);
    }
  };

  const adjustLeftLayouts = () => {
    // main function that adjusts the layouts on the basis of height and arranges them
    const maxLayoutHeight = 500;
    let newLayouts = [];
    let currentLayout = { items: [], height: 0 };

    // Flatten all items and keep track of their original group index
    let allItems = leftLayouts.flatMap((group, groupIndex) =>
      group.items.map((item) => ({ ...item, originalGroup: groupIndex }))
    );

    // Sort items by their original group to maintain order when moving between layouts
    allItems = allItems.sort((a, b) => a.originalGroup - b.originalGroup);

    allItems.forEach((item) => {
      // Use stored height if available, otherwise fall back to scrollHeight or default height
      let itemHeight = leftmanuallySetHeights.current[item.id];
      if (!itemHeight) {
        itemHeight = item.userChanged
          ? lefttextAreaRefs.current[item.id].scrollHeight
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
    setLeftDisplayLayouts(
      newLayouts.map((layout) => ({ items: layout.items }))
    );
  };

  const adjustRightLayouts = () => {
    // main function that adjusts the layouts on the basis of height and arranges them
    const maxLayoutHeight = 500;
    let newLayouts = [];
    let currentLayout = { items: [], height: 0 };

    // Flatten all items and keep track of their original group index
    let allItems = rightLayouts.flatMap((group, groupIndex) =>
      group.items.map((item) => ({ ...item, originalGroup: groupIndex }))
    );

    // Sort items by their original group to maintain order when moving between layouts
    allItems = allItems.sort((a, b) => a.originalGroup - b.originalGroup);

    allItems.forEach((item) => {
      // Use stored height if available, otherwise fall back to scrollHeight or default height
      let itemHeight = rightmanuallySetHeights.current[item.id];
      if (!itemHeight) {
        itemHeight = item.userChanged
          ? righttextAreaRefs.current[item.id].scrollHeight
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
    setRightDisplayLayouts(
      newLayouts.map((layout) => ({ items: layout.items }))
    );
  };

  useEffect(() => {
    adjustLeftLayouts();
    adjustRightLayouts();
  }, [leftLayouts, rightLayouts]);
  const handleLeftManualResize = (id) => {
    //Handle resize for the left textAreas, It will not be required in our Use Case
    const textarea = lefttextAreaRefs.current[id];
    if (textarea) {
      leftmanuallySetHeights.current[id] = textarea.offsetHeight;
      leftuserInitiatedChange.current[id] = true; // Indicate this is a user-initiated change
      adjustLeftLayouts();
    }
  };

  const handleRightManualResize = (id) => {
    //Handle resize for the right textAreas, It will not be required in our Use Case
    const textarea = righttextAreaRefs.current[id];
    if (textarea) {
      rightmanuallySetHeights.current[id] = textarea.offsetHeight;
      rightuserInitiatedChange.current[id] = true; // Indicate this is a user-initiated change
      adjustRightLayouts();
    }
  };

  const handleLeftChange = (groupId, itemId, newText) => {
    //Allowing the use to write in  the textareas
    const newDisplayLayouts = leftDisplayLayouts.map((group) => ({
      ...group,
      items: group.items.map((item) =>
        item.id === itemId
          ? { ...item, text: newText, userChanged: true }
          : item
      ),
    }));

    // Update the displayLayouts state with the new copy
    setLeftDisplayLayouts(newDisplayLayouts);
  };

  const handleRightChange = (groupId, itemId, newText) => {
    //Allowing the use to write in  the textareas
    const newDisplayLayouts = rightDisplayLayouts.map((group) => ({
      ...group,
      items: group.items.map((item) =>
        item.id === itemId
          ? { ...item, text: newText, userChanged: true }
          : item
      ),
    }));

    // Update the displayLayouts state with the new copy
    setRightDisplayLayouts(newDisplayLayouts);
  };

  const addNewBlock = () => {
    // This method added the new item into the state
    const newId = `item-${layouts.flat().length + 1}`;
    const newObject = {
      id: newId,
      text: "Random text " + newId,

      userChanged: true,
    };

    setLeftLayouts((prevLayouts) => {
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
  const setCommonRef = (el, id) => {
    // Assign the ref to both left and right text areas using the id
    lefttextAreaRefs.current[id] = el;
    righttextAreaRefs.current[id] = el;
  };

  return (
    <div className="maindiv gap-5">
      {/* <button title="Click me" id="clickme" onClick={addNewBlock}>
        Click Me
      </button>
      <button onClick={handleDownloadClick}>Download as PDF</button> */}
      <DragDropContext onDragEnd={onMainDrag}>
        <div className="flex flex-col">
          {leftDisplayLayouts.map((group, groupIndex) => (
            <Droppable
              key={groupIndex}
              droppableId={`left-droppable-${groupIndex}`}
            >
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="centered-box flex flex-col justify-start items-center w-300 h-700 pt-30 mb-10"
                >
                  <Draggable
                    key={groupIndex}
                    draggableId={`left-draggable-${groupIndex}`}
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
                          onClick={() => console.log(leftDisplayLayouts)}
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
                                ref={(el) => setCommonRef(el, obj.id)}
                                value={obj.text}
                                style={{
                                  fontSize: 20,
                                  height:
                                    leftmanuallySetHeights.current[obj.id] ||
                                    "110px",
                                  overflow: "hidden",
                                  margin: 5,
                                  color: "black",
                                }}
                                onChange={(e) =>
                                  handleLeftChange(
                                    group.groupTitle,
                                    obj.id,
                                    e.target.value
                                  )
                                }
                                onBlur={() => handleLeftManualResize(obj.id)}
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
        <div className="flex flex-col">
          {rightDisplayLayouts.map((group, groupIndex) => (
            <Droppable
              key={groupIndex}
              droppableId={`right-droppable-${groupIndex}`}
            >
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="centered-box flex flex-col justify-start items-center w-300 h-700 pt-30 mb-10"
                >
                  <Draggable
                    key={groupIndex}
                    draggableId={`right-draggable-${groupIndex}`}
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
                          onClick={() => console.log(rightDisplayLayouts)}
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
                                  obj.groupTitle == "Skills"
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
                                id={obj.id} // Set the id attribute
                                ref={(el) => setCommonRef(el, obj.id)}
                                value={obj.text}
                                style={{
                                  fontSize: 20,
                                  height:
                                    rightmanuallySetHeights.current[obj.id] ||
                                    "110px",
                                  overflow: "hidden",
                                  margin: 5,
                                  color: "black",
                                }}
                                onChange={(e) =>
                                  handleRightChange(
                                    group.groupTitle,
                                    obj.id,
                                    e.target.value
                                  )
                                }
                                onBlur={() => handleRightManualResize(obj.id)}
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
      </DragDropContext>
    </div>
  );
}

export default Main;
