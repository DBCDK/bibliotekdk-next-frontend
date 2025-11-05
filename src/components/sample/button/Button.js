import Button from "@/components/base/button";
import Text from "@/components/base/text/Text";

import Overlay from "../overlay";
import EpubSample from "../epub";

import styles from "./Button.module.css";
import { useState } from "react";

export default function SampleButton({ className = "", onClick = () => {} }) {
  return (
    <Button
      className={`${styles.button} ${className}`}
      variant="primary"
      onClick={onClick}
    >
      <Text type="text2">▶</Text>
    </Button>
  );
}
