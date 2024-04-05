import { useData } from "@/lib/api/api";
import { doComplexSearchAll } from "@/lib/api/complexSearch.fragments";
import styles from "./CombinedSearch.module.css";
import { useState } from "react";
import isEmpty from "lodash/isEmpty";
import Text from "@/components/base/text";
import isEqual from "lodash/isEqual";
import cx from "classnames";
import { IconLink } from "@/components/base/iconlink/IconLink";
import animations from "@/components/base/animation/animations.module.css";
import Link from "@/components/base/link";
import { useRouter } from "next/router";

import Translate, { hasTranslation } from "@/components/base/translate";
import IconButton from "@/components/base/iconButton/IconButton";
import Button from "@/components/base/button/Button";
import { LogicalOperatorDropDown } from "@/components/search/advancedSearch/fieldInput/TextInputs";

//max number of search queries to be combined
const MAX_ITEMS = 4;

function SearchItem({ query, index, isLastItem }) {
  return (
    <div className={styles.searchItemContainer}>

    <div key={index} className={styles.searchItem}>
      <div className={styles.searchItemNumber}>
        <Text>{index}</Text>
      </div>
      <Text>{query}</Text>
    </div>
   { !isLastItem&&<LogicalOperatorDropDown  onSelect={(selected)=>{console.log('hej',selected)}}/>}

    </div>

  );
}
export default function CombinedSearch({ queries = [], cancelCombinedSearch }) {
  console.log("queries", queries);
  const router = useRouter();

  return (
    <div className={styles.container}>
      <Text type="text1" className={styles.title}>
        Kombiner søgninger
      </Text>
      {queries?.length === 0 && (
        <Text>
          Vælg en eller flere søgninger i listen for at sammensætte dem til en
          ny søgning
        </Text>
      )}

      {queries?.length > 0 && (
        <div>
          {queries.map((query, index) => (
            <SearchItem query={query} index={index + 1} isLastItem={queries.length-1 ===index }/>
          ))}
        </div>
      )}
      <div className={styles.buttonContainer}>
        <Button
          className={styles.searchButton}
          size="small"
          type="secondary"
          disabled={queries.length === 0}
          onClick={()=>{
            const query = { cql: queries.join(" AND ") };
            router.push({ pathname: "/avanceret", query });
          }}
        >
          Søg
        </Button>
        <Text>
          <Link
            border={{
              top: false,
              bottom: {
                keepVisible: true,
              },
            }}
            onClick={cancelCombinedSearch}
          >
            Fortryd
          </Link>
        </Text>
      </div>
    </div>
  );
}
