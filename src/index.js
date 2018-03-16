import React from "react";
import ReactDOM from "react-dom";
import "./reset.css";
import "./index.css";
import App from "./App";
import { blacklist, isEmail, isMobilePhone } from "validator";
import Validator, { createValidatorFn } from "./Validator";
import registerServiceWorker from "./registerServiceWorker";

const isNotEmpty = input => input.trim().length > 0;

const fields = {
  email: {
    label: "Email Address",
    helpText: "We may email you about your tip.",
    required: true,
    type: "email",
    validator: new Validator([
      createValidatorFn(isNotEmpty, "Email address is required."),
      createValidatorFn(isEmail, "Email address is invalid.")
    ])
  },
  phone: {
    label: "Phone number (optional)",
    type: "tel",
    validator: new Validator([
      createValidatorFn(
        input =>
          isNotEmpty(input)
            ? isMobilePhone(blacklist(input, "\\s\\(\\)\\-"), "en-US")
            : true,
        "Phone number is invalid."
      )
    ]),
    mask: "(111) 111-1111"
  },
  tip: {
    label: "Tip description",
    helpText: "Please briefly describe your tip. What makes it newsworthy?",
    required: true,
    type: "textarea",
    validator: new Validator([
      createValidatorFn(isNotEmpty, "Tip description is required.")
    ])
  },
  "potential-interviews": {
    label: "Potential interviews (optional)",
    helpText:
      "Please list the names of anyone you think we should interview for this story."
  },
  "additional-sources": {
    label: "Additional sources (optional)",
    helpText:
      "Please describe any other sources that might help us gather information on this story."
  }
};

const embedded = window.parent !== window.top;
if (embedded) document.querySelector("html").classList.add("is-embedded");

ReactDOM.render(
  <App
    formName="tip"
    fields={fields}
    fetchFn={fetch.bind(window)}
    embedded={embedded}
  />,
  document.getElementById("root")
);
registerServiceWorker();
