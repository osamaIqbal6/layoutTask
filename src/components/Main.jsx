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

  const onRightDrag = (result) => {
    //This is the main function thatt is called when Dragging Ends
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    // Check if layouts and displayLayouts are the same
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
      console.log("source", sourceDisplayGroup);
      console.log("destination", destinationDisplayGroup);

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

    // adjustRightLayouts();
  };
  const onDragEnd = (result) => {
    //This is the main function thatt is called when Dragging Ends
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    // Check if layouts and displayLayouts are the same
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
      console.log("source", sourceDisplayGroup);
      console.log("destination", destinationDisplayGroup);

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
  };
  const onMainDrag = (result) => {
    const { source, destination } = result;
  
    // If the item is dropped outside a droppable area
    if (!destination) {
      return;
    }
  
    // Dropped within the same list
    if (source.droppableId === destination.droppableId) {
      const isLeftLayout = source.droppableId.includes('left');
      const layouts = isLeftLayout ? leftinitialLayouts : rightinitialLayouts;
      const sourceGroup = layouts.find(group => group.items.some(item => item.id === result.draggableId));
      
      if (sourceGroup) {
        const newItems = Array.from(sourceGroup.items);
        const [reorderedItem] = newItems.splice(source.index, 1);
        newItems.splice(destination.index, 0, reorderedItem);
  
        const newLayouts = layouts.map(group => {
          if (group === sourceGroup) {
            return { ...group, items: newItems };
          }
          return group;
        });
  
        if (isLeftLayout) {
          setLeftDisplayLayouts(newLayouts);
        } else {
          setRightDisplayLayouts(newLayouts);
        }
      }
    } else {
      // Moving between different lists
      const sourceLayouts = source.droppableId.includes('left') ? leftinitialLayouts : rightinitialLayouts;
      const destLayouts = source.droppableId.includes('left') ? rightinitialLayouts : leftinitialLayouts;
  
      const sourceGroup = sourceLayouts.find(group => group.items.some(item => item.id === result.draggableId));
      const destGroup = destLayouts[destination.droppableId.split('-').pop()]; // Assumes droppableId is in the format 'droppable-x'
  
      if (sourceGroup && destGroup) {
        const sourceItems = Array.from(sourceGroup.items);
        const destItems = Array.from(destGroup.items);
        const [removedItem] = sourceItems.splice(source.index, 1);
        destItems.splice(destination.index, 0, removedItem);
  
        const newSourceLayouts = sourceLayouts.map(group => {
          if (group === sourceGroup) {
            return { ...group, items: sourceItems };
          }
          return group;
        });
  
        const newDestLayouts = destLayouts.map(group => {
          if (group === destGroup) {
            return { ...group, items: destItems };
          }
          return group;
        });
  
        if (source.droppableId.includes('left')) {
          setLeftDisplayLayouts(newSourceLayouts);
          setRightDisplayLayouts(newDestLayouts);
        } else {
          setRightDisplayLayouts(newSourceLayouts);
          setLeftDisplayLayouts(newDestLayouts);
        }
      }
    }
  };
  
  
  useEffect(() => {
    adjustLeftLayouts();
    adjustRightLayouts();
  }, [leftLayouts, rightLayouts]);

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

  const handleLeftManualResize = (id) => {
    const textarea = lefttextAreaRefs.current[id];
    if (textarea) {
      leftmanuallySetHeights.current[id] = textarea.offsetHeight;
      leftuserInitiatedChange.current[id] = true; // Indicate this is a user-initiated change
      adjustLeftLayouts();
    }
  };

  const handleRightManualResize = (id) => {
    const textarea = righttextAreaRefs.current[id];
    if (textarea) {
      rightmanuallySetHeights.current[id] = textarea.offsetHeight;
      rightuserInitiatedChange.current[id] = true; // Indicate this is a user-initiated change
      adjustRightLayouts();
    }
  };

  const handleLeftChange = (groupId, itemId, newText) => {
    // Used to let the user write text in the Textareas
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
    // Used to let the user write text in the Textareas
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

  return (
    <div className="maindiv">
      {/* <button title="Click me" id="clickme" onClick={addNewBlock}>
        Click Me
      </button>
      <button onClick={handleDownloadClick}>Download as PDF</button> */}
      <DragDropContext onDragEnd={onMainDrag}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <DragDropContext onDragEnd={onDragEnd}>
            {leftDisplayLayouts.map((group, groupIndex) => (
              <Droppable
                key={groupIndex}
                droppableId={`droppable-${groupIndex}`}
              >
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="centered-box "
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
                                  ref={(el) =>
                                    (lefttextAreaRefs.current[obj.id] = el)
                                  }
                                  value={obj.text}
                                  style={{
                                    fontSize: 20,
                                    height:
                                      leftmanuallySetHeights.current[obj.id] ||
                                      "110px",
                                    overflow: "hidden",
                                    margin: 5,
                                    color:'black'
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
          </DragDropContext>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <DragDropContext onDragEnd={onRightDrag}>
            {rightDisplayLayouts.map((group, groupIndex) => (
              <Droppable
                key={groupIndex}
                droppableId={`droppable-${groupIndex}`}
              >
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="centered-box "
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
                                  ref={(el) =>
                                    (righttextAreaRefs.current[obj.id] = el)
                                  }
                                  value={obj.text}
                                  style={{
                                    fontSize: 20,
                                    height:
                                      rightmanuallySetHeights.current[obj.id] ||
                                      "110px",
                                    overflow: "hidden",
                                    margin: 5,
                                    color:'black'
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
          </DragDropContext>
        </div>
      </DragDropContext>
    </div>
  );
}

export default Main;
