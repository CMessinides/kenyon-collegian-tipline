import React from "react";
import Field from "./Field";
import "./Form.css";

const Form = ({ embedded, onSubmit }) => {
  return (
    <div className="form">
      <p className="form__intro">
        Do you have a story for the <em>Kenyon Collegian</em>? We want to hear
        it. Please use the form below to submit your tip.
      </p>
      <form onSubmit={onSubmit} className="form__body">
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
      </form>
      <div className='form__footer'>
        <button className='form__submit-btn' type='submit' disabled>Submit</button>
      </div>
    </div>
  );
};

export default Form;
