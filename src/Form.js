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
      showAlert: false,
      submitStatus: {
        submitting: false
      }
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
        prevState => ({
          showAlert: false,
          submitStatus: {
            ...prevState.submitStatus,
            submitting: true
          }
        }),
        resolve
      );
    });

  setStatusSuccess = () =>
    new Promise(resolve => {
      this.setState(
        {
          fields: getInitialFieldsState(this.props.fields),
          showAlert: true,
          submitStatus: {
            ok: true,
            submitting: false,
            message: "Your tip has been submitted. Thank you!"
          }
        },
        resolve
      );
    });

  setStatusError = error =>
    new Promise(resolve => {
      this.setState(
        {
          showAlert: true,
          submitStatus: {
            ok: false,
            submitting: false,
            message: `There was an error submitting your tip: ${error.message}`
          }
        },
        resolve
      );
    });

  dismissAlert = event =>
    new Promise(resolve => {
      clearTimeout(this.state.alertTimeout);
      this.setState({ showAlert: false }, resolve);
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
          clearTimeout(this.state.alertTimeout);
          const alertTimeout = setTimeout(() => {
            this.setState({
              showAlert: false
            });
          }, 3500);
          this.setState({ alertTimeout }, resolve);
        });
    });

  render() {
    const submitStatus = this.state.submitStatus;
    return (
      <form
        className="form"
        data-netlify="true"
        data-netlify-honeypot="bot-field"
        onSubmit={this.handleSubmit}
      >
        <Alert
          show={this.state.showAlert}
          ok={submitStatus.ok}
          message={submitStatus.message}
          onDismiss={this.dismissAlert}
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
          <SubmitButton disabled={!this.canSubmit()} />
        </div>
      </form>
    );
  }
}

export default Form;
