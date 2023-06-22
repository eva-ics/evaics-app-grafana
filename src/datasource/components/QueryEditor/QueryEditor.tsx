import React, {
  ChangeEvent, FormEvent,
 useCallback,
  useState,
} from "react";

import { GrafanaTheme2, SelectableValue } from "@grafana/data";
import { InputsParametersData, Names, QueryProps } from "../../types";
import { options } from "../../helpers";

import {
  Icon,
  InlineField,
  Input,
  Select,
  TextArea,
  useStyles2,
} from "@grafana/ui";
import { css } from "@emotion/css";

export const QueryEditor = ({ query, onChange, onRunQuery }: QueryProps) => {
  const s = useStyles2(getStyles);
  const [method, setMethod] = useState<SelectableValue<string> | null>(null);
  const [methodInput, setMethodInput] = useState("");
  const [additional, setAdditional] = useState("");
  const [showEditor, setShowEditor] = useState(false);
  const [combinedString, setCombinedString] = useState<string>();
  const [inputs, setInputs] = useState<InputsParametersData[]>([]);

  // console.log("combinedString", combinedString);
  // console.log("inputs", inputs);

  //change value of drop-down menu
  const handleMethodChange = useCallback(
      (selectedValue: SelectableValue) => {
        setMethod(selectedValue);
        onChange({ ...query, queryText: selectedValue?.value });
      },
      [setMethod, onChange, query]
  );

  const handleChange = useCallback(
      (e: FormEvent<HTMLInputElement>) => {
        const fieldName = e.currentTarget?.name;
        const fieldValue = e.currentTarget?.value.trim();
        let finalString;

        let updatedFields = {
          methodInput,
          additional,
        };

        switch (fieldName) {
          case Names.METHODINPUT:
            setMethodInput(fieldValue);
            updatedFields.methodInput = fieldValue;
            break;

          case Names.ADDITIONAL:
            setAdditional(fieldValue);
            updatedFields.additional = fieldValue;
            break;

          default:
            return;
        }

        finalString = `${method?.value || ""}${updatedFields.methodInput || ""} ${
            updatedFields.additional || ""
        } `;

        setCombinedString(finalString);
        onChange({ ...query, queryText: finalString });
      },
      [setMethodInput, setAdditional, method, methodInput, additional, setCombinedString, onChange, query]
  );

  // console.log("combine", combinedString);
  const handleAddedInputChange = useCallback((
      e: ChangeEvent<HTMLInputElement>,
      index: number
  ) => {
    const { name, value } = e.target;

    const updatedInputs = [...inputs];
    updatedInputs[index] = { ...updatedInputs[index], [name]: value.trim() };
    setInputs(updatedInputs);

    // Recalculate final string and update state after updating the inputs
    const inputsName = updatedInputs.map((input) => input.name);
    const inputsValue = updatedInputs.map((input) => input.value);
    const addInputsString = inputsName
        .map((name, i) => `${name}=${inputsValue[i]}`)
        .join(" ");

    const finalString = `${method?.value || ""}${methodInput || ""} ${
        additional || ""
    } ${addInputsString || ""}`;
    setCombinedString(finalString);
    onChange({ ...query, queryText: finalString });
  },[ method, methodInput, additional, setCombinedString, onChange, query,inputs])

  //remove inputs line from editor
  const handleRemoveInputs = useCallback((index: number) => {
    const updatedInputs = [...inputs];
    updatedInputs.splice(index, 1);
    setInputs(updatedInputs);

    // Recalculate final string and update state after updating the inputs
    const inputsName = updatedInputs.map((input) => input.name);
    const inputsValue = updatedInputs.map((input) => input.value);
    const addInputsString = inputsName
        .map((name, i) => `${name}=${inputsValue[i]}`)
        .join(" ");

    const finalString = `${method?.value || ""}${methodInput || ""} ${
        additional || ""
    } ${addInputsString || ""}`;
    setCombinedString(finalString);
    onChange({ ...query, queryText: finalString });
  },[additional,inputs,method?.value,methodInput,onChange,query])

  //show or hide editor mode
  const onHandleEditMode = () => {
    setShowEditor(!showEditor);
  };

  //add parameter's inputs
  const addInput = () => {
    setInputs([...inputs, { name: "", separator: "=", value: "" }]);
  };

  return (
    <div className={s.query_wrapper}>
      {showEditor ? (
        <div className={s.editor_wrapper}>
          <TextArea cols={80} value={combinedString} />
          <button
            type="button"
            className="gf-form-label query-part"
            onClick={() => setShowEditor(!showEditor)}
          >
            <Icon name="pen" />
          </button>
        </div>
      ) : (
        <>
          <div className={s.method_wrapper}>
            <InlineField
              label="Method"
              labelWidth={16}
              style={{ display: "flex" }}
            >
              <Select
                options={options}
                onChange={handleMethodChange}
                value={method}
                width={15}
              />
            </InlineField>
            {!method?.value ? (
              <Input
                onChange={handleChange}
                value={methodInput}
                width={64}
                name={Names.METHODINPUT}
              />
            ) : (
              ""
            )}

            <button
              type="button"
              className="gf-form-label query-part"
              onClick={onHandleEditMode}
            >
              <Icon name="pen" />
            </button>
          </div>
          <div className={s.input_block}>
            <InlineField label="OID(s)" labelWidth={16}>
              <Input
                name={Names.ADDITIONAL}
                onChange={handleChange}
                value={additional}
                width={79.5}
              />
            </InlineField>
            {inputs.length === 0 && (
              <button
                type="button"
                className="gf-form-label query-part"
                onClick={addInput}
              >
                <Icon name="plus" />
              </button>
            )}
          </div>
          <div className={s.input_block}>
            <div>
              {inputs.map((input, index) => (
                <div key={index} className={s.editor_wrapper}>
                  <InlineField label="Parameter" labelWidth={16}>
                    <Input
                      name="name"
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleAddedInputChange(e, index)
                      }
                      value={input.name}
                      width={30}
                    />
                  </InlineField>
                  <Input
                    name="value"
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleAddedInputChange(e, index)
                    }
                    value={input.value}
                    width={30}
                  />
                  {index !== inputs.length && (
                    <button
                      type="button"
                      className="gf-form-label query-part"
                      onClick={() => handleRemoveInputs(index)}
                    >
                      <Icon name="minus" />
                    </button>
                  )}
                  {index === inputs.length - 1 && (
                    <button
                      type="button"
                      className="gf-form-label query-part"
                      onClick={addInput}
                    >
                      <Icon name="plus" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const getStyles = (theme: GrafanaTheme2) => ({
  query_wrapper: css`
    display: flex;
    align-items: start;
    justify-content: flex-start;
    flex-direction: column;
  `,
  method_wrapper: css`
    display: flex;
    align-items: start;
    justify-content: center;
  `,
  button: css`
    display: flex;
    align-items: center;
    justify-content: center;
  `,
  input_block: css`
    display: flex;
  `,
  separator: css`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 5px;
  `,
  editor_wrapper: css`
    display: flex;
  `,
});
