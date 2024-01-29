import React, { useState, useEffect, useRef } from "react";
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

const LeftLayout = () => {
  const [leftDisplayLayouts, setLeftDisplayLayouts] =
    useState(leftinitialLayouts);
  const [leftLayouts, setLeftLayouts] = useState(leftinitialLayouts);
  const lefttextAreaRefs = useRef({});
  const leftmanuallySetHeights = useRef({});
  const leftuserInitiatedChange = useRef({});

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
  return <div>LeftLayout</div>;
};

export { LeftLayout as default };
