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
                    el.prevHeight = el.offsetHeight;
                    el.onmousemove = () => handleManualResize(obj.id);
                  }
                }}
                value={obj.text}
                onChange={(e) => handleChange(obj.id, e.target.value)}
                style={{
                  fontSize: 20,
                  height: `100px`,
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
