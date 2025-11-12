import Player from "./player";

import Cover from "@/components/base/cover";
import Title from "@/components/base/title";
import Text from "@/components/base/text";

import styles from "./Mp3.module.css";

/**
 * Lille, tilgængelig mp3-afspiller.
 * Props:
 * - src: string (mp3 URL) — kræves
 * - title: string (til screenreaders og tooltip) — anbefales
 * - className: string (valgfri ekstra styling)
 */
export default function AudioSample({ src, className = "", data }) {
  const coverUrl = data?.cover?.large?.url;
  const title = data?.titles?.main?.[0] || "Lydbogssample";
  const creators = data?.creators?.map((c) => c.display).join(", ");

  return (
    <div className={`${styles.wrap} ${className}`}>
      <div className={styles.container}>
        <div className={styles.info}>
          <Cover src={coverUrl} className={styles.cover} size="fill-width" />
          <div>
            <Title type="title4">{title}</Title>
            <Text>{creators}</Text>
          </div>
        </div>
        <Player className={styles.player} src={src} />
      </div>
    </div>
  );
}
