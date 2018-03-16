import React from "react";
import classnames from "classnames";
import Validator from "./Validator";
import MaskedInput from "react-maskedinput";
import { AlertIcon } from "./Icon";

import "./Field.css";

const wrapEventHandler = (fn, validator) => event => fn(event, validator);

const FieldInput = props => {
  // Delegate to MaskedInput if a mask pattern is provided
  if (props.mask) {
    return <MaskedInput {...props} className="field__input" />;
  }

  return props.type === "textarea" ? (
    <textarea cols="80" rows="4" {...props} className="field__input" />
  ) : (
    <input {...props} className="field__input" />
  );
};

const Field = ({
  label,
  name,
  helpText,
  error,
  onChange,
  onBlur,
  validator = new Validator(),
  type = "text",
  required = false,
  value = "",
  ...passToInput
}) => {
  const id = `field-${name}`;
  const className = classnames("field", `field--${type}`, `field--${name}`, {
    "field--required": required,
    "field--error": error
  });

  // to be passed to the child Input
  const inputProps = {
    id,
    name,
    type,
    required,
    value,
    onChange: wrapEventHandler(onChange, validator),
    onBlur: wrapEventHandler(onBlur, validator),
    ...passToInput
  };

  return (
    <div className={className}>
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      {helpText && <p className="field__help">{helpText}</p>}
      <div className="field__input-wrapper">
        <FieldInput {...inputProps} />
        {error && (
          <AlertIcon
            className="field__error-icon"
            aria-hidden="true"
            size={20}
          />
        )}
      </div>
      {error && <p className="field__error-message">{error.message}</p>}
    </div>
  );
};

export default Field;
