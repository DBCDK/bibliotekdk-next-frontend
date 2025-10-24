// app/preview/[id]/page.jsx
"use client";
import { useRouter } from "next/navigation";

import EpubSample from "@/components/sample/epub";

import styles from "./Page.module.css";

export default function PreviewPage({ params }) {
  const router = useRouter();
  //   const { id } = params;

  const url = "https://samples.pubhub.dk/9788758817842.epub";

  //

  return (
    <main className={styles.layout}>
      <EpubSample url={url} />
    </main>
  );
}
