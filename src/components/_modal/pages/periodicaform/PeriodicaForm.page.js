import Top from "@/components/_modal/pages/base/top";
import Input from "@/components/base/forms/input";
import Text from "@/components/base/text";
import Button from "@/components/base/button";
import Accordion, { Item } from "@/components/base/accordion";

import Translate from "@/components/base/translate";

import { useEffect, useState } from "react";

import styles from "./PeriodicaForm.module.css";
import cx from "classnames";

/**
 *
 * @param {String} label
 * @param {Boolean} required
 * @param {String} value
 * @param {Function} onChange
 * @param {Boolean} hasTry
 * @returns
 */
function Field({ label, required, value, onChange, hasTry }) {
  const labelKey = `label-${label}`;
  return (
    <div
      className={cx({
        [styles.invalid]: hasTry && required && !value?.trim(),
        [styles.field]: true,
      })}
    >
      <Text id={labelKey} type="text2" tag="label">
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

/**
 * @param {Object} props
 * @param {Object} props.modal
 * @param {Object} props.context
 * @param {Object} props.context.periodicaForms list of several periodicaForms, only provided from multiorder
 * @param {Object} props.context.periodicaForm
 * @param {String} props.context.materialKey only provided from multiorder
 * @param {Boolean} props.active
 * @returns {React.JSX.Element}
 */
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

  const {
    periodicaForms,
    periodicaForm: newPeriodicaForm,
    materialKey,
  } = context;

  const [state, setState] = useState(newPeriodicaForm || {});
  const [hasTry, setHasTry] = useState(false);
  const [expanded, setExpanded] = useState(false);

  //If we dont force update of state on materialKey change, state shows values of previous periodicaForm in multiOrder
  useEffect(() => {
    if (!materialKey) return; //dont set key for single order
    if (!newPeriodicaForm) {
      // Generate a unique key to trigger a re-render and reset the state
      setState({ key: materialKey });
    } else {
      setState(newPeriodicaForm);
    }
  }, [materialKey]);

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
            //update multiorder periodicaForm if we came from multiorder
            const multiorderModalId = "multiorder";
            if (modal.stack.some((m) => m.id === multiorderModalId)) {
              modal.update(modal.index(multiorderModalId), {
                periodicaForms: {
                  ...periodicaForms,
                  [materialKey]: periodicaForm,
                },
              });
              modal.prev(multiorderModalId);
            } else {
              //else update periodicaForm for single order
              const orderModalId = "order";
              modal.update(modal.index(orderModalId), { periodicaForm });
              modal.prev(orderModalId);
            }
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
              onChange={(e) => {
                setState({
                  ...state,
                  [key]: e?.target?.value,
                });
              }}
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
