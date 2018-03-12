import React from "react";

import "./Field.css";

const Field = ({ label, name, helpText, required = false, type = "text" }) => {
  const id = `field-${name}`;
  const className = [
    "field__input",
    `field__input--${type}`,
    `field__input--${name}`
  ].join(" ");
  return (
    <div className={required ? "field field--required" : "field"}>
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      {helpText !== undefined && <p className="field__help">{helpText}</p>}
      {type === "textarea" ? (
        <textarea {...{ id, name, required, className }} />
      ) : (
        <input {...{ id, name, required, type, className }} />
      )}
    </div>
  );
};

export default Field;
