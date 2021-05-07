import Link from "@/components/base/link";
import Divider from "@/components/base/divider";
import Title from "@/components/base/title";
import Text from "@/components/base/text";
import Button from "@/components/base/button";
import Translate from "@/components/base/translate";
import Tag from "@/components/base/forms/tag";
import Input from "@/components/base/forms/input";
import Cover from "@/components/base/cover";
import { Arrow } from "@/components/article/preview";

import styles from "./Info.module.css";

export default function Info({ material, user, className, onLayerSelect }) {
  // Mateiral props
  const { title, creators, materialType, cover } = material;

  const { agency, name, mail } = user;

  return (
    <div className={`${styles.info} ${className}`}>
      <div className={styles.edition}>
        <div className={styles.left}>
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
            <Link onClick={() => onLayerSelect("edition")} disabled>
              <Text type="text3">Udgave underordnet</Text>
            </Link>
          </div>
        </div>
        <div className={styles.right}>
          <Cover src={cover?.detail} size="thumbnail" />
        </div>
      </div>

      <div className={styles.pickup}>
        <div className={styles.title}>
          <Title type="title5">Afhentningssted</Title>
        </div>
        <div className={styles.library}>
          <Text type="text1">{agency?.branches[0]?.name}</Text>
          <div>
            <Link
              onClick={() => onLayerSelect("pickup")}
              border={{ bottom: { keepVisible: true } }}
            >
              <Text type="text3">Vælg afhentning</Text>
            </Link>
            <Arrow className={styles.arrow} />
          </div>
        </div>
        <div className={styles.address}>
          <Text type="text3">Willy Sørensens Plads 1</Text>
          <Text type="text3">7100 Vejle</Text>
        </div>
      </div>

      <div className={styles.user}>
        <Title type="title5">Bestilles af</Title>
        <div className={styles.name}>
          <Text type="text1">{name}</Text>
        </div>
        <div className={styles.email}>
          <label for="order-user-email">
            <Text type="text1">Email</Text>
          </label>
          <Input
            value={mail}
            id="order-user-email"
            onChange={(val) => console.log("input", val)}
          />
        </div>
        <div className={styles.message}>
          <Text type="text3">
            Du får besked når materialet er klar til afhentning på Vejle
            Bibliotek
          </Text>
        </div>
      </div>
    </div>
  );
}
