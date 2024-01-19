import React, { useState, useRef, useEffect } from "react";
import "./Centerbox.css";

function App() {
  const getRandomHeight = () => Math.floor(Math.random() * (91 - 80) + 80);

  // Initialize your objects here
  const initialObjects = [
    { id: 1, heading: "1", text: "Text 1", height: getRandomHeight() },
    { id: 2, heading: "2", text: "Text 2", height: getRandomHeight() },
    // More objects as needed
  ];

  // State to manage multiple layouts
  const [layouts, setLayouts] = useState([initialObjects]);
  const layoutRefs = useRef([]);

  useEffect(() => {
    // Create a ResizeObserver to distribute objects across layouts based on height
    const observer = new ResizeObserver((entries) => {
      let newLayouts = [[]];
      let currentLayoutIndex = 0;
      let currentHeight = 0;

      layouts.flat().forEach((obj) => {
        const objHeight = obj.height;

        if (currentHeight + objHeight <= 500) {
          currentHeight += objHeight;
          newLayouts[currentLayoutIndex].push(obj);
        } else {
          currentLayoutIndex++;
          currentHeight = objHeight;
          newLayouts[currentLayoutIndex] = [obj];
        }
      });

      setLayouts(newLayouts);
    });

    layoutRefs.current.forEach((layoutRef) => {
      if (layoutRef) {
        observer.observe(layoutRef);
      }
    });

    return () => observer.disconnect();
  }, [layouts]);
  useEffect(() => {
    // Create a ResizeObserver to adjust layouts based on rendered heights
    const observer = new ResizeObserver(adjustLayouts);

    layoutRefs.current.forEach((layoutRef) => {
      if (layoutRef) {
        observer.observe(layoutRef);
      }
    });

    return () => observer.disconnect();
  }, [layouts]);
  const clickme = () => {
    const newId = layouts.flat().length + 1;
    const randomText =
      "Random text " + Math.random().toString(36).substring(2, 15);

    const newObject = {
      id: newId,
      heading: newId.toString(),
      text: randomText,
      height: getRandomHeight(),
    };

    setLayouts((prevLayouts) => {
      const lastLayout = prevLayouts[prevLayouts.length - 1];
      if (lastLayout) {
        return [...prevLayouts.slice(0, -1), [...lastLayout, newObject]];
      }
      return [[newObject]]; // In case there are no layouts yet
    });
  };
  const adjustLayouts = () => {
    let newLayouts = [[]];
    let currentLayoutIndex = 0;
    let currentHeight = 0;

    layouts.flat().forEach((obj) => {
      const textarea = textAreaRefs.current[obj.id];
      const objHeight = textarea ? textarea.clientHeight : obj.height;

      if (currentHeight + objHeight <= 550) {
        currentHeight += objHeight;
        newLayouts[currentLayoutIndex].push(obj);
      } else {
        currentLayoutIndex++;
        currentHeight = objHeight;
        newLayouts[currentLayoutIndex] = [obj];
      }
    });

    setLayouts(newLayouts);
  };
  const handleChangeFirstObjects = (id, newText) => {
    // ... existing logic to handle text change
    autoResizeTextarea(id);
    adjustLayouts(); // Trigger layout adjustment on textarea change
  };
  // Render each layout and its objects
  return (
    <div className="maindiv">
      <button
        title="Click me"
        onClick={clickme}
        style={
          {
            /* your styles */
          }
        }
      >
        Click Me
      </button>

      {layouts.map((layout, layoutIndex) => (
        <div
          key={layoutIndex}
          className="centered-box"
          ref={(el) => (layoutRefs.current[layoutIndex] = el)}
        >
          {layout.map((obj) => (
            <div key={obj.id} className="object-container">
              <textarea
                value={obj.text}
                style={{
                  fontSize: 20,
                  height: `${obj.height}px`,
                  overflow: "hidden",
                }}
                readOnly
              ></textarea>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default App;
