import Link from "@/components/base/link";
import Divider from "@/components/base/divider";
import Title from "@/components/base/title";
import Text from "@/components/base/text";
import Button from "@/components/base/button";
import Translate from "@/components/base/translate";
import Tag from "@/components/base/forms/tag";
import Cover from "@/components/base/cover";

import styles from "./Info.module.css";

export default function Info({ material, user, className, onLayerSelect }) {
  // Mateiral props
  const { title, creators, materialType, cover } = material;

  console.log("material", material);

  return (
    <div className={`${styles.info} ${className}`}>
      <div className={styles.edition}>
        <div className={styles.about}>
          <Text type="text1" className={styles.title}>
            {title}
          </Text>
          <Text type="text3" className={styles.creators}>
            {creators.map((c, i) =>
              creators.length > i + 1 ? c.name + ", " : c.name
            )}
          </Text>
          <div className={styles.material}>
            <Tag tag="span">{materialType}</Tag>
            <Link onClick={() => onLayerSelect("edition")}>
              <Text type="text3">Udgave underordnet</Text>
            </Link>
          </div>
        </div>
        <div className={styles.cover}>
          <Cover src={cover?.detail} />
        </div>
      </div>

      <div className={styles.pickup}>
        <Link onClick={() => onLayerSelect("pickup")}>Vælg afhentning</Link>
      </div>

      <div className={styles.user}>bruger ...</div>
    </div>
  );
}
