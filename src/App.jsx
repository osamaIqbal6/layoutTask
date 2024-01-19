import React, { useState, useEffect, useRef } from "react";
import "./Centerbox.css";

function App() {
  const getRandomHeight = () => Math.floor(Math.random() * (91 - 80) + 80);

  const initialObjects = [
    { id: 1, text: "Text 1", height: getRandomHeight(), userChanged: true },
    { id: 2, text: "Text 2", height: getRandomHeight(), userChanged: true },
  ];

  const [layouts, setLayouts] = useState([initialObjects]);
  const textAreaRefs = useRef({});

  const adjustLayouts = () => {
    let newLayouts = [[]];
    let currentLayoutIndex = 0;
    let currentHeight = 0;

    layouts.flat().forEach((obj) => {
      const objHeight = obj.userChanged
        ? textAreaRefs.current[obj.id].scrollHeight
        : obj.height;

      if (currentHeight + objHeight <= 450) {
        currentHeight += objHeight;
        newLayouts[currentLayoutIndex].push({ ...obj, height: objHeight });
      } else {
        currentLayoutIndex++;
        currentHeight = objHeight;
        newLayouts[currentLayoutIndex] = [{ ...obj, height: objHeight }];
      }
    });

    setLayouts(newLayouts);
  };

  useEffect(() => {
    const observer = new ResizeObserver(adjustLayouts);
    Object.values(textAreaRefs.current).forEach((textarea) => {
      if (textarea) observer.observe(textarea);
    });

    return () => observer.disconnect();
  }, [layouts]);
  useEffect(() => {
    // Call adjustLayouts whenever layouts state changes
    adjustLayouts();
  }, [layouts]);
  const clickme = () => {
    const newId =
      layouts.flat().reduce((maxId, obj) => Math.max(maxId, obj.id), 0) + 1;
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
  const handleManualResize = (id) => {
    const textarea = textAreaRefs.current[id];
    if (textarea) {
      const currentHeight = textarea.offsetHeight;
      if (textarea.prevHeight !== currentHeight) {
        textarea.prevHeight = currentHeight; // Update the stored height
        handleHeightAdjustment(id);
      }
    }
  };

  const handleHeightAdjustment = (id) => {
    const textarea = textAreaRefs.current[id];
    if (textarea) {
      // Calculate the new height
      textarea.style.height = "auto";
      const scrollHeight = textarea.scrollHeight;
      textarea.style.height = `${scrollHeight}px`;

      // Update layout if height has changed
      if (textarea.objHeight !== scrollHeight) {
        textarea.objHeight = scrollHeight; // Update stored height
        const updatedLayouts = layouts.map((layout) =>
          layout.map((obj) =>
            obj.id === id
              ? { ...obj, height: scrollHeight, userChanged: true }
              : obj
          )
        );
        setLayouts(updatedLayouts);
        adjustLayouts();
      }
    }
  };

  const handleChange = (id, newText) => {
    // Update the text and mark userChanged as true
    const updatedLayouts = layouts.map((layout) =>
      layout.map((obj) =>
        obj.id === id ? { ...obj, text: newText, userChanged: true } : obj
      )
    );
    setLayouts(updatedLayouts);

    // Adjust the height of the textarea
    handleHeightAdjustment(id);
  };

  return (
    <div className="maindiv">
      <button title="Click me" onClick={clickme}>
        Click Me
      </button>
      {layouts.map((layout, layoutIndex) => (
        <div key={layoutIndex} className="centered-box">
          {layout.map((obj) => (
            <div key={obj.id} className="object-container">
              <textarea
                ref={(el) => {
                  textAreaRefs.current[obj.id] = el;
                  if (el) {
                    el.prevHeight = el.offsetHeight; // Initialize prevHeight
                    el.onmousemove = () => handleManualResize(obj.id);
                  }
                }}
                value={obj.text}
                onChange={(e) => handleChange(obj.id, e.target.value)}
                style={{
                  fontSize: 20,
                  // height: `${obj.height}px`,
                  height: `90px`,

                  overflow: "hidden",
                }}
              ></textarea>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default App;
