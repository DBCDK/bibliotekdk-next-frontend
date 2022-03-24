import Top from "@/components/_modal/pages/base/top";
import Input from "@/components/base/forms/input";
import Text from "@/components/base/text";
import Button from "@/components/base/button";
import Accordion, { Item } from "@/components/base/accordion";

import Translate from "@/components/base/translate";

import { useEffect, useState } from "react";

import styles from "./PeriodicaForm.module.css";

// TODO create jsdoc and proptypes

function Field({ label, required, value, onChange, hasTry }) {
  const labelKey = `label-${label}`;
  return (
    <div className={hasTry && required && !value?.trim() ? styles.invalid : ""}>
      <Text id={labelKey} type="text1" tag="label">
        {Translate({
          context: "order-periodica",
          label: labelKey,
        })}
        {required && <span className={styles.required}>&nbsp;*</span>}
      </Text>
      <Input
        key={label}
        value={value}
        type={"text"}
        dataCy={`input-${label}`}
        onChange={onChange}
        placeholder={Translate({
          context: "order-periodica",
          label: `placeholder-${label}`,
        })}
        required={required}
        aria-labelledby={labelKey}
      />
    </div>
  );
}

export function PeriodicaForm({ modal, context, active }) {
  const fields = [
    { key: "publicationDateOfComponent", required: true },
    { key: "volume" },
  ];
  const articleFields = [
    { key: "authorOfComponent" },
    { key: "titleOfComponent" },
    { key: "pagination" },
  ];

  const [state, setState] = useState(context?.periodicaForm || {});
  const [hasTry, setHasTry] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (active) {
      setHasTry(false);
    }
  }, [active]);

  function validate() {
    let result = true;
    fields.forEach(({ key, required }) => {
      if (required && !state?.[key]?.trim()) {
        result = false;
      }
    });
    if (expanded) {
      articleFields.forEach(({ key, required }) => {
        if (required && !state?.[key]?.trim()) {
          result = false;
        }
      });
    }
    return result;
  }
  const isValid = validate();

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
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (isValid) {
            const periodicaForm = {};
            // Process in order
            fields.forEach(({ key }) => {
              const val = state?.[key]?.trim?.();
              if (val) {
                periodicaForm[key] = val;
              }
            });
            if (expanded) {
              articleFields.forEach(({ key }) => {
                const val = state?.[key]?.trim?.();
                if (val) {
                  periodicaForm[key] = val;
                }
              });
            }
            // Change context for previous page
            modal.update(modal.index("order"), { periodicaForm });
            modal.prev("order");
          }
        }}
      >
        {fields.map(({ key, required }) => {
          return (
            <Field
              key={key}
              label={key}
              required={required}
              value={state[key]}
              hasTry={hasTry}
              onChange={(e) =>
                setState({
                  ...state,
                  [key]: e?.target?.value,
                })
              }
            />
          );
        })}
        <Accordion className={styles.accordion}>
          <Item
            title={Translate({
              context: "order-periodica",
              label: `specific-article`,
            })}
            key={"0"}
            eventKey={"0"}
            onChange={setExpanded}
          >
            <div className={styles.accordioncontent}>
              {articleFields.map(({ key, required }) => {
                return (
                  <Field
                    key={key}
                    label={key}
                    required={required}
                    value={state[key]}
                    hasTry={hasTry}
                    onChange={(e) =>
                      setState({
                        ...state,
                        [key]: e?.target?.value,
                      })
                    }
                  />
                );
              })}
            </div>
          </Item>
        </Accordion>

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
