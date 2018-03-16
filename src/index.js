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
      createValidatorFn(isNotEmpty, "Please enter a valid email address."),
      createValidatorFn(isEmail, "Please enter a valid email address.")
    ])
  },
  phone: {
    label: "Phone Number",
    type: "tel",
    validator: new Validator([
      createValidatorFn(
        input =>
          isNotEmpty(input)
            ? isMobilePhone(blacklist(input, "\\s\\(\\)\\-"), "en-US")
            : true,
        "Please enter a valid phone number."
      )
    ]),
    mask: "(111) 111-1111"
  },
  tip: {
    label: "Tip Information",
    helpText: "Please briefly describe your tip. What makes it newsworthy?",
    required: true,
    type: "textarea",
    validator: new Validator([
      createValidatorFn(isNotEmpty, "Please provide a description of your tip.")
    ])
  },
  "potential-interviews": {
    label: "Potential Interviews",
    helpText:
      "Please list the names of anyone you think we should interview for this story."
  },
  "additional-sources": {
    label: "Additional Sources",
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
