import React from "react";
import Field from "./Field";
import "./Form.css";

const Form = ({ embedded, onSubmit }) => {
  return (
    <form onSubmit={onSubmit} className="form">
      <Field label="Email" name="email" required={true} type="email" />
      <Field label="Phone Number" name="phone" type="tel" />
      <Field
        label="Tip Information"
        name="tip"
        required={true}
        type="textarea"
      />
      <Field label="Potential Interviews" name="potential-interviews" />
      <Field label="Additional Sources" name="additional-sources" />
      <div className="form__footer">
        <button className="form__submit-btn" type="submit" disabled>
          Submit
        </button>
      </div>
    </form>
  );
};

export default Form;
