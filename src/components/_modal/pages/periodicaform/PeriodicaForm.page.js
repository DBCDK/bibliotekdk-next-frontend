import Top from "@/components/_modal/pages/base/top";
import Input from "@/components/base/forms/input";
import Text from "@/components/base/text";
import Button from "@/components/base/button";

import Translate from "@/components/base/translate";

import { useState } from "react";

import styles from "./PeriodicaForm.module.css";

export function PeriodicaForm({ modal, context }) {
  const fields = [{ key: "year", required: true }, { key: "volume" }];

  const [state, setState] = useState({ year: "", volume: "" });
  const [hasTry, setHasTry] = useState(false);

  function validate() {
    let result = true;
    fields.forEach(({ key, required }) => {
      if (required && !state[key].trim()) {
        result = false;
      }
    });
    return result;
  }
  const isValid = validate();

  console.log({ isValid });

  return (
    <div className={styles.periodicaform}>
      <Top
        title={Translate({
          context: "order-periodica",
          label: `title`,
        })}
      />
      <Text type="text2">
        {Translate({
          context: "order-periodica",
          label: `description`,
        })}
      </Text>

      <Text type="text3" className={styles.requiredtext}>
        <Text type="text1" tag="span" className={styles.required}>
          *&nbsp;
        </Text>
        {Translate({
          context: "form",
          label: `required`,
        })}
      </Text>
      <form
        // novalidate="novalidate"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (isValid) {
            // Change context for previous page
            modal.update(modal.index("order"), { periodicaForm: state });
            modal.prev("order");
          }
        }}
      >
        {fields.map(({ key, required }) => {
          return (
            <div
              key={key}
              className={
                hasTry && required && !state[key]?.trim() ? styles.invalid : ""
              }
            >
              <Text type="text1" tag="label">
                {Translate({
                  context: "order-periodica",
                  label: `label-${key}`,
                })}
                {required && <span className={styles.required}>&nbsp;*</span>}
              </Text>
              <Input
                key={key}
                value={state[key]}
                type={"text"}
                dataCy={`input-year`}
                onChange={(value) =>
                  setState({
                    ...state,
                    [key]: value,
                  })
                }
                placeholder={Translate({
                  context: "order-periodica",
                  label: `placeholder-${key}`,
                })}
                required={required}
              />
            </div>
          );
        })}

        <div className={styles.bottom}>
          {hasTry && !isValid && (
            <Text type="text3" className={styles.errormessage}>
              {Translate({
                context: "form",
                label: "error-missing-required",
              })}
              <Text type="text1" tag="span" className={styles.required}>
                &nbsp;*
              </Text>
            </Text>
          )}
          <Button onClick={() => setHasTry(true)} tabIndex="0">
            {Translate({
              context: "general",
              label: "save",
            })}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default PeriodicaForm;
