import React, { Component } from "react";
import Field from "./Field";
import "./Form.css";

const collectValidationData = (props, state) => {
  const fields = { ...state.fields };
  for (const name in props.fields) {
    if (props.fields.hasOwnProperty(name)) {
      fields[name].required = props.fields[name].required;
    }
  }
  return Object.values(fields);
};

const canSubmit = (props, state) => {
  return collectValidationData(props, state).every(
    field =>
      field.error === null && (field.required ? field.value.length > 0 : true)
  );
};

class Form extends Component {
  constructor(props, ...args) {
    super(props, ...args);
    const fields = props.fields || {};
    this.state = {
      fields: Object.assign(
        {},
        ...Object.keys(fields).map(name => {
          const value = fields[name].value || "";
          return { [name]: { value, error: null } };
        })
      )
    };
  }

  onFieldChange = (event, validator) => {
    const value = event.target.value;
    const error = validator.validate(value);
    this.setState({
      fields: {
        ...this.state.fields,
        [event.target.name]: { error, value }
      }
    });
  };

  onFieldBlur = (event, validator) => {
    const name = event.target.name;
    const field = this.state.fields[name];
    const error = validator.validate(event.target.value);

    if (error !== field.error) {
      this.setState({
        fields: {
          ...this.state.fields,
          [name]: {
            ...field,
            error
          }
        }
      });
    }
  };

  render() {
    const fields = this.props.fields || {};
    return (
      <form
        className="form"
        data-netlify="true"
        data-netlify-honeypot="bot-field"
      >
        <input type="hidden" name="form-name" value={this.props.name} />
        {Object.keys(fields).map(name => (
          <Field
            {...fields[name]}
            error={this.state.fields[name].error}
            value={this.state.fields[name].value}
            name={name}
            key={name}
            onChange={this.onFieldChange}
            onBlur={this.onFieldBlur}
          />
        ))}
        <div className="form__footer">
          <button
            className="form__submit-btn"
            type="submit"
            disabled={!canSubmit(this.props, this.state)}
          >
            Submit
          </button>
        </div>
      </form>
    );
  }
}

export default Form;
