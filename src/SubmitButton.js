import React from 'react';

const SubmitButton = ({
  onSubmit
}) => {
  return (
    <button
      className="form__submit-btn"
      type="submit"
      disabled
      onSubmit={onSubmit}
    >
      Submit
    </button>
  );
};

export default SubmitButton;
