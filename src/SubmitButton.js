import React from "react";
import classnames from "classnames";

import "./SubmitButton.css";

const SubmitButton = ({ disabled, submitting = false }) => {
  const txtClassnames = classnames("submit-btn__text", {
    "submit-btn__text--hidden": submitting
  });
  const loaderClassnames = classnames("submit-btn__loader", {
    "submit-btn__loader--hidden": !submitting
  });
  return (
    <button className="submit-btn" type="submit" disabled={disabled}>
      <span className={txtClassnames}>Submit</span>
      <span className={loaderClassnames} aria-label="Submitting" />
    </button>
  );
};

export default SubmitButton;
