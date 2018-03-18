import React, { Component } from "react";
import PropTypes from "prop-types";
import Field from "./Field";
import SubmitButton from "./SubmitButton";
import TransportService from "./TransportService";
import Alert from "./Alert";

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
    transportService: new TransportService()
  };

  constructor(...args) {
    super(...args);

    // Proxy this.fetch() to the transport service
    this.fetch = this.props.transportService.fetch;

    this.state = {
      fields: getInitialFieldsState(this.props.fields),
      alert: {
        show: false,
        animate: false
      },
      submitting: false
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

  setStatusSending = () =>
    new Promise(resolve => {
      this.setState(
        {
          submitting: true
        },
        resolve
      );
    });

  setStatusSuccess = () =>
    new Promise(resolve => {
      this.setState(
        prevState => ({
          alert: {
            ...prevState.alert,
            show: true,
            animate: prevState.alert.show,
            type: "success",
            message: "Your tip has been submitted. Thank you!"
          },
          fields: getInitialFieldsState(this.props.fields),
          submitting: false
        }),
        resolve
      );
    });

  setStatusError = error =>
    new Promise(resolve => {
      this.setState(
        prevState => ({
          alert: {
            ...prevState.alert,
            show: true,
            type: "error",
            animate: prevState.alert.show,
            message: `There was an error submitting your tip: ${error.message}`
          },
          submitting: false
        }),
        resolve
      );
    });

  resetAlert = event =>
    new Promise(resolve => {
      this.setState(
        prevState => ({
          alert: {
            ...prevState.alert,
            animate: false
          }
        }),
        resolve
      );
    });

  dismissAlert = event =>
    new Promise(resolve => {
      clearTimeout(this.state.alert.timeout);
      this.setState(
        prevState => ({
          alert: {
            ...prevState.alert,
            show: false
          }
        }),
        resolve
      );
    });

  handleSubmit = event =>
    new Promise((resolve, reject) => {
      if (event) event.preventDefault();
      // Bail early if data is invalid
      if (!this.canSubmit()) {
        return resolve();
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

      this.setStatusSending()
        .then(() => {
          return this.fetch(this.props.action, config);
        })
        .then(
          response => {
            return this.setStatusSuccess();
          },
          error => {
            return this.setStatusError(error);
          }
        )
        .then(() => {
          clearTimeout(this.state.alert.timeout);
          const timeout = setTimeout(() => {
            this.setState(prevState => ({
              alert: {
                ...prevState.alert,
                show: false
              }
            }));
          }, 3500);
          this.setState(
            prevState => ({
              alert: {
                ...prevState.alert,
                timeout
              }
            }),
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
        <Alert
          show={this.state.alert.show}
          animate={this.state.alert.animate}
          type={this.state.alert.type}
          message={this.state.alert.message}
          onDismiss={this.dismissAlert}
          onAnimationEnd={this.resetAlert}
        />
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
          <div className="form__footer-container">
            <SubmitButton
              disabled={!this.canSubmit()}
              submitting={this.state.submitting}
            />
          </div>
        </div>
      </form>
    );
  }
}

export default Form;
