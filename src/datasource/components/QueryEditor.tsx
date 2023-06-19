import React, { ChangeEvent, useState } from "react";
import { DataSource } from "../datasource";
import {
  GrafanaTheme2,
  QueryEditorProps,
  SelectableValue,
} from "@grafana/data";
import { EvaDataSourceOptions, EvaQuery } from "../types";
import {
  Icon,
  InlineField,
  Input,
  Select,
  TextArea,
  useStyles2,
} from "@grafana/ui";
import { css } from "@emotion/css";

type Props = QueryEditorProps<DataSource, EvaQuery, EvaDataSourceOptions>;

//FIXME: remove to single file
enum Names {
  METHODINPUT = "methodInput",
  ADDITIONAL = "additional",
  NAME = "name",
  VALUE = "value",
  SECONDNAME = "secondName",
  SECONDVALUE = "secondValue",
}
//

export function QueryEditor({ query, onChange, onRunQuery }: Props) {
  const s = useStyles2(getStyles);
  const [method, setMethod] = useState<SelectableValue<string> | null>(null);
  const [methodInput, setMethodInput] = useState("");
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [secondName, setSecondName] = useState("");
  const [secondValue, setSecondValue] = useState("");
  const [additional, setAdditional] = useState("");
  const [showEditor, setShowEditor] = useState(false);
  const [showNextLevel, setShowNextLevel] = useState(false);
  const [combinedString, setCombinedString] = useState<string>();

  // const onQueryTextChange = () => {
  //   onChange({ ...query, queryText: combineString });
  //   console.log("Query works");
  // };
  // const { queryText } = query;

  const options = [
    { value: "", label: "Custom method" },
    { value: "Method", label: "Method" },
    { value: "Method", label: "Method" },
    { value: "Method", label: "Method" },
  ];

  const handleMethodChange = (selectedValue: SelectableValue) => {
    setMethod(selectedValue);
    onChange({ ...query, queryText: selectedValue?.value });
  };
  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const fieldName = e.target?.name;
    const fieldValue = e.target?.value;
    let updatedFields = {
      methodInput,
      additional,
      name,
      value,
      secondName,
      secondValue,
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

      case Names.NAME:
        setName(fieldValue);
        updatedFields.name = fieldValue;
        break;

      case Names.VALUE:
        setValue(fieldValue);
        updatedFields.value = fieldValue;
        break;

      case Names.SECONDNAME:
        setSecondName(fieldValue);
        updatedFields.secondName = fieldValue;
        break;

      case Names.SECONDVALUE:
        setSecondValue(fieldValue);
        updatedFields.secondValue = fieldValue;
        break;

      default:
        return;
    }

    const finalString = `${method?.value || ""}${
      updatedFields.methodInput || ""
    } ${updatedFields.additional || ""} ${updatedFields.name || ""}=${
      updatedFields.value || ""
    } ${updatedFields.secondName || ""}=${updatedFields.secondValue || ""}`;
    setCombinedString(finalString);
    onChange({ ...query, queryText: finalString });
  };

  const onHandleEditMode = () => {
    setShowEditor(!showEditor);
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
            <button type="button" className="gf-form-label query-part">
              <Icon name="plus" />
            </button>
            <button
              type="button"
              className="gf-form-label query-part"
              onClick={onHandleEditMode}
            >
              <Icon name="pen" />
            </button>
          </div>
          <div className={s.input_block}>
            <InlineField label="" labelWidth={16}>
              <Input
                name={Names.ADDITIONAL}
                onChange={handleChange}
                value={additional}
                width={79.5}
              />
            </InlineField>
          </div>
          <div className={s.input_block}>
            <InlineField label="Name" labelWidth={16}>
              <Input
                name={Names.NAME}
                onChange={handleChange}
                value={name}
                width={30}
              />
            </InlineField>
            <div className={s.separator}>
              <span> = </span>
            </div>
            <InlineField label="Value" labelWidth={16}>
              <Input
                name={Names.VALUE}
                onChange={handleChange}
                value={value}
                width={30}
              />
            </InlineField>
            <button
              type="button"
              className="gf-form-label query-part"
              onClick={() => setShowNextLevel(true)}
            >
              <Icon name="plus" />
            </button>
          </div>
          {showNextLevel && (
            <div className={s.input_block}>
              <InlineField label="Name" labelWidth={16}>
                <Input
                  name={Names.SECONDNAME}
                  onChange={handleChange}
                  value={secondName}
                  width={30}
                />
              </InlineField>
              <div className={s.separator}>
                <span> = </span>
              </div>
              <InlineField label="Value" labelWidth={16}>
                <Input
                  name={Names.SECONDVALUE}
                  onChange={handleChange}
                  value={secondValue}
                  width={30}
                />
              </InlineField>
            </div>
          )}
        </>
      )}
    </div>
  );
}

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
