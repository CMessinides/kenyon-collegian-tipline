import React, { Component } from "react";
import Field from "./Field";
import SubmitButton from "./SubmitButton";
import "./Form.css";

const encodeForm = fields =>
  Object.keys(fields)
    .map(
      name =>
        encodeURIComponent(name) + "=" + encodeURIComponent(fields[name].value)
    )
    .join("&");

const getInitialFieldsState = fields =>
  Object.assign(
    {},
    ...Object.keys(fields).map(name => {
      const value = fields[name].value || "";
      return { [name]: { value, error: null } };
    })
  );

class Form extends Component {
  static defaultProps = {
    fields: {},
    action: "/",
    name: ""
  };

  constructor(props, ...args) {
    super(props, ...args);

    this.state = {
      fields: getInitialFieldsState(props.fields)
    };
  }

  handleFieldChange = (event, validator) =>
    new Promise((resolve, reject) => {
      const value = event.target.value;
      const error = validator.validate(value);
      this.setState(
        {
          fields: {
            ...this.state.fields,
            [event.target.name]: { error, value }
          }
        },
        resolve
      );
    });

  handleFieldBlur = (event, validator) => {
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

  canSubmit = () => {
    const fields = Object.keys(this.state.fields).map(name => {
      return {
        ...this.state.fields[name],
        required: this.props.fields[name].required
      };
    });
    return fields.every(
      field =>
        !field.error && (field.required ? field.value.trim().length > 0 : true)
    );
  };

  handleSubmit = event =>
    new Promise((resolve, reject) => {
      // Bail early if data is invalid
      if (!this.canSubmit()) {
        resolve();
        return;
      }

      const config = {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: encodeForm({
          "form-name": { value: this.props.name },
          ...this.state.fields
        })
      };

      fetch(this.props.action, config).then(resp => {
        if (!resp.ok) {
          resolve();
          return;
        }
        this.setState(
          {
            fields: getInitialFieldsState(this.props.fields)
          },
          resolve
        );
      });
    });

  render() {
    return (
      <form
        className="form"
        data-netlify="true"
        data-netlify-honeypot="bot-field"
        onSubmit={this.handleSubmit}
      >
        {Object.keys(this.props.fields).map(name => (
          <Field
            {...this.props.fields[name]}
            error={this.state.fields[name].error}
            value={this.state.fields[name].value}
            name={name}
            key={name}
            onChange={this.handleFieldChange}
            onBlur={this.handleFieldBlur}
          />
        ))}
        <div className="form__footer">
          <SubmitButton disabled={!this.canSubmit()} />
        </div>
      </form>
    );
  }
}

export default Form;
