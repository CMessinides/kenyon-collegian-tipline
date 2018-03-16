import React, { Component } from "react";
import PropTypes from "prop-types";
import Field from "./Field";
import SubmitButton from "./SubmitButton";
import TransportService from "./TransportService";

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
  static propTypes = {
    fields: PropTypes.objectOf(
      PropTypes.shape({
        label: PropTypes.string,
        helpText: PropTypes.string,
        required: PropTypes.bool,
        type: PropTypes.string,
        validator: PropTypes.shape({
          validate: PropTypes.func
        }),
        mask: PropTypes.string
      })
    ),
    action: PropTypes.string,
    name: PropTypes.string,
    transportService: PropTypes.shape({
      fetch: PropTypes.func
    })
  };

  static defaultProps = {
    fields: {},
    action: "/",
    name: "",
    transportService: new TransportService(fetch)
  };

  constructor(args) {
    super(args);

    // Proxy this.fetch() to the transport service
    this.fetch = this.props.transportService.fetch.bind(
      this.props.transportService
    );

    this.state = {
      fields: getInitialFieldsState(this.props.fields)
    };
  }

  updateField = event =>
    new Promise(resolve => {
      const field = this.props.fields[event.target.name];
      const value = event.target.value;
      let error = null;

      if (value.trim().length === 0) {
        if (field.required) {
          error = Error(`${field.label} is required.`);
        }
      } else {
        if (field.validator) {
          error = field.validator.validate(value);
        }
      }

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

  canSubmit = () => {
    const fields = Object.keys(this.state.fields).map(name => ({
      ...this.state.fields[name],
      required: this.props.fields[name].required
    }));

    if (fields.some(f => f.error)) return false;
    if (fields.some(f => f.required && f.value.trim().length === 0)) {
      return false;
    }

    return true;
  };

  handleSubmit = event =>
    new Promise((resolve, reject) => {
      if (event) event.preventDefault();
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

      this.fetch(this.props.action, config).then(
        response => {
          this.setState(
            {
              fields: getInitialFieldsState(this.props.fields)
            },
            resolve
          );
        },
        err => resolve()
      );
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
            onChange={this.updateField}
            onBlur={this.updateField}
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
