export const areLayoutsSame = (layouts, displayLayouts) => {
  if (layouts.length !== displayLayouts.length) {
    return false;
  }
  return layouts.every((layout, i) => {
    return (
      layout.items.length === displayLayouts[i].items.length &&
      layout.groupTitle === displayLayouts[i].groupTitle
    );
  });
};
export const adjustBothLayouts = async (leftLayouts, rightLayouts, commonRefs, setLeftDisplayLayouts, setRightDisplayLayouts) => {
    // Adjust left layouts
    adjustLayouts(leftLayouts, commonRefs, setLeftDisplayLayouts);

    // Adjust right layouts
    adjustLayouts(rightLayouts, commonRefs, setRightDisplayLayouts);
};

export const adjustLayouts = (layouts, refs, setDisplayLayouts) => {
  const maxLayoutHeight = 500;
  let newLayouts = [];
  let currentLayout = { items: [], height: 0 };
  let allItems = layouts.flatMap((group, groupIndex) =>
    group.items.map((item) => ({ ...item, originalGroup: groupIndex }))
  );
  allItems = allItems.sort((a, b) => a.originalGroup - b.originalGroup);

  allItems.forEach((item) => {
    let itemHeight = refs.current.manuallySetHeights[item.id];
    if (!itemHeight) {
      itemHeight = item.userChanged
        ? refs.current.textAreaRefs[item.id].scrollHeight
        : item.height;
    }
    if (currentLayout.height + itemHeight <= maxLayoutHeight) {
      currentLayout.items.push(item);
      currentLayout.height += itemHeight;
    } else {
      newLayouts.push(currentLayout);
      currentLayout = { items: [item], height: itemHeight };
    }
  });
  if (currentLayout.items.length > 0) {
    newLayouts.push(currentLayout);
  }
  setDisplayLayouts(newLayouts.map((layout) => ({ items: layout.items })));
};

export const handleManualResize = (id, refs, adjustLayoutsFunc) => {
  const textarea = refs.current.textAreaRefs[id];
  if (textarea) {
    refs.current.manuallySetHeights[id] = textarea.offsetHeight;
    refs.current.userInitiatedChange[id] = true;
    adjustLayoutsFunc();
  }
};

export const handleTextChange = (itemId, newText, setDisplayLayouts) => {
  setDisplayLayouts((prevDisplayLayouts) =>
    prevDisplayLayouts.map((group) => ({
      ...group,
      items: group.items.map((item) =>
        item.id === itemId
          ? { ...item, text: newText, userChanged: true }
          : item
      ),
    }))
  );
};
export const onDragEnd = (
  result,
  leftLayouts,
  rightLayouts,
  setLeftLayouts,
  setRightLayouts,
  leftDisplayLayouts,
  rightDisplayLayouts,
  setLeftDisplayLayouts,
  setRightDisplayLayouts,
  commonRefs
) => {
  const { source, destination } = result;
  console.log(source);
  console.log(destination);
  // If the item is dropped outside a droppable area
  if (!destination) {
    return;
  }

  // Helper function to check if both source and destination droppable IDs start with a given prefix
  const isSameLayout = (prefix) =>
    source.droppableId.startsWith(prefix) &&
    destination.droppableId.startsWith(prefix);

  const isLeftLayout = isSameLayout("left");
  const isRightLayout = isSameLayout("right");

  if (isLeftLayout || isRightLayout) {
    const layouts = isLeftLayout ? leftLayouts : rightLayouts;
    const displayLayouts = isLeftLayout
      ? leftDisplayLayouts
      : rightDisplayLayouts;

    const sameLayouts = areLayoutsSame(layouts, displayLayouts);

    if (sameLayouts) {
      // If the displayLayout and Main Layout are the same
      const newLayouts = Array.from(layouts);
      const tempItems = newLayouts[source.index].items;
      const tempTitle = newLayouts[source.index].groupTitle;

      newLayouts[source.index].items = newLayouts[destination.index].items;
      newLayouts[source.index].groupTitle =
        newLayouts[destination.index].groupTitle;

      newLayouts[destination.index].items = tempItems;
      newLayouts[destination.index].groupTitle = tempTitle;

      if (isLeftLayout) {
        setLeftLayouts(newLayouts);
      } else {
        setRightLayouts(newLayouts);
      }
      adjustLayouts(leftLayouts, leftRefs, setLeftDisplayLayouts);
    } else {
      // If layouts and displayLayouts are different, handle different scenarios
      const sourceDisplayGroup = displayLayouts[source.index];
      const destinationDisplayGroup = displayLayouts[destination.index];

      if (sourceDisplayGroup && destinationDisplayGroup) {
        // If the two groups are different
        const sourceGroupId = sourceDisplayGroup.items[0].groupid;
        const destinationGroupId = destinationDisplayGroup.items[0].groupid;

        const newLayouts = Array.from(layouts);
        const tempGroup = newLayouts[sourceGroupId];
        newLayouts[sourceGroupId] = newLayouts[destinationGroupId];
        newLayouts[destinationGroupId] = tempGroup;

        if (isLeftLayout) {
          setLeftLayouts(newLayouts);
        } else {
          setRightLayouts(newLayouts);
        }
        adjustLayouts(leftLayouts, leftRefs, setLeftDisplayLayouts);
      }
    }
  } else {
    // Moving between left and right layouts
    const newLeftLayouts = Array.from(leftLayouts);
    const newRightLayouts = Array.from(rightLayouts);
    const tempItems = newLeftLayouts[source.index].items;

    newLeftLayouts[source.index].items =
      newRightLayouts[destination.index].items;
    newRightLayouts[destination.index].items = tempItems;

    setLeftLayouts(newLeftLayouts);
    setRightLayouts(newRightLayouts);
    adjustLayouts(true); // Adjust left layout
    adjustLayouts(false); // Adjust right layout
  }
};
