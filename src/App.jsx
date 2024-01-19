import React, { useState, useEffect, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./Centerbox.css";

function App() {
  const getRandomHeight = () => Math.floor(Math.random() * (91 - 80) + 80);

  const initialObjects = [];
  const [layouts, setLayouts] = useState([initialObjects]);
  const textAreaRefs = useRef({});
  const onDragEnd = (result) => {
    const { source, destination } = result;

    // Dropped outside the list or no movement
    if (
      !destination ||
      (source.droppableId === destination.droppableId &&
        source.index === destination.index)
    ) {
      return;
    }

    // Clone the current layouts array
    const newLayouts = layouts.map((layout) => [...layout]);

    // Extract the dragged item
    const [reorderedItem] = newLayouts[0].splice(source.index, 1);

    // Insert the dragged item at its new position
    newLayouts[0].splice(destination.index, 0, reorderedItem);

    // Update state with the new layouts
    setLayouts(newLayouts);
  };

  const adjustLayouts = () => {
    const newLayouts = [];
    let currentLayout = [];
    let currentHeight = 0;

    layouts.flat().forEach((obj) => {
      const objHeight = obj.userChanged
        ? textAreaRefs.current[obj.id].scrollHeight
        : obj.height;
      if (currentHeight + objHeight > 500 && currentLayout.length) {
        newLayouts.push(currentLayout);
        currentLayout = [];
        currentHeight = 0;
      }
      currentHeight += objHeight;
      currentLayout.push({ ...obj, height: objHeight });
    });

    if (currentLayout.length) {
      newLayouts.push(currentLayout);
    }

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

  const handleChange = (id, newText) => {
    setLayouts(
      layouts.map((layout) =>
        layout.map((obj) =>
          obj.id === id ? { ...obj, text: newText, userChanged: true } : obj
        )
      )
    );
    handleHeightAdjustment(id);
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

  return (
    <div className="maindiv">
      <button title="Click me" onClick={clickme}>
        Click Me
      </button>
      <DragDropContext onDragEnd={onDragEnd}>
        {layouts.map((layout, layoutIndex) => {
          const droppableId = `droppable-${layoutIndex}`; // Ensure unique ID for each Droppable

          return (
            <Droppable key={droppableId} droppableId={droppableId}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="centered-box"
                >
                  {layout.map((obj, index) => (
                    <Draggable key={obj.id} draggableId={obj.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="object-container"
                        >
                          <textarea
                            ref={(el) => (textAreaRefs.current[obj.id] = el)}
                            value={obj.text}
                            onChange={(e) =>
                              handleChange(obj.id, e.target.value)
                            }
                            style={{
                              fontSize: 20,
                              height: `100px`,
                              overflow: "hidden",
                            }}
                          ></textarea>
                          <div
                            {...provided.dragHandleProps}
                            className="drag-handle"
                          >
                            Drag Handle
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
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

export default App;
