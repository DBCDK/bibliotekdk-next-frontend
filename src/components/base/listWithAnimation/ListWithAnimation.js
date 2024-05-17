import React, { useEffect, useRef, useState } from "react";
import styles from "./listWithAnimation.module.css"; // Adjust the path to your CSS file

const ListWithAnimation = ({ children, props }) => {
  const prevChildrenRef = useRef(React.Children.toArray(children));
  const [currentChildren, setCurrentChildren] = useState(
    React.Children.toArray(children)
  );
  const [removingChildKey, setRemovingChildKey] = useState(null);

  useEffect(() => {
    const currentChildrenArray = React.Children.toArray(children);
    const prevChildrenArray = prevChildrenRef.current;

    if (prevChildrenArray.length !== currentChildrenArray.length) {
      if (currentChildrenArray.length > prevChildrenArray.length) {
        const newChild = currentChildrenArray.find(
          (child) =>
            !prevChildrenArray.some((prevChild) => prevChild.key === child.key)
        );
        console.log(`Count has increased. New child added: `, newChild);
        setCurrentChildren(currentChildrenArray);
      } else {
        const removedChild = prevChildrenArray.find(
          (child) =>
            !currentChildrenArray.some(
              (currChild) => currChild.key === child.key
            )
        );
        console.log(`A child was removed: `, removedChild);
        setRemovingChildKey(removedChild.key);
        setTimeout(() => {
          setRemovingChildKey(null);
          setCurrentChildren(currentChildrenArray);
        }, 500); // Time for the transition to complete
      }
      prevChildrenRef.current = currentChildrenArray;
    }
  }, [children]);
  console.log("children", children);
  return (
    <div {...props}>
      {currentChildren.map((child) => (
        <div
          key={child.key}
          className={`${styles.childelement} ${
            removingChildKey === child.key ? styles.removedChildelement : ""
          }`}
        >
          {child}
        </div>
      ))}
    </div>
  );
};

export default ListWithAnimation;
