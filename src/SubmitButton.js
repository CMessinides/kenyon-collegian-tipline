import React from "react";

const SubmitButton = ({ disabled }) => {
  return (
    <button className="form__submit-btn" type="submit" disabled={disabled}>
      Submit
    </button>
  );
};

export default SubmitButton;
