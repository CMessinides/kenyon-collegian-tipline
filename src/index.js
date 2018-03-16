import React from "react";
import ReactDOM from "react-dom";
import "./reset.css";
import "./index.css";
import App from "./App";
import { blacklist, isEmail, isMobilePhone } from "validator";
import Validator, { createValidatorFn } from "./Validator";
import registerServiceWorker from "./registerServiceWorker";

const fields = {
  email: {
    label: "Email address",
    helpText: "We may email you about your tip.",
    required: true,
    type: "email",
    validator: new Validator([
      createValidatorFn(isEmail, "Email address is invalid.")
    ])
  },
  phone: {
    label: "Phone number",
    type: "tel",
    validator: new Validator([
      createValidatorFn(
        input => isMobilePhone(blacklist(input, "\\s\\(\\)\\-"), "en-US"),
        "Phone number is invalid."
      )
    ]),
    mask: "(111) 111-1111"
  },
  tip: {
    label: "Tip description",
    helpText: "Please briefly describe your tip. What makes it newsworthy?",
    required: true,
    type: "textarea"
  },
  "potential-interviews": {
    label: "Potential interviews",
    helpText:
      "Please list the names of anyone you think we should interview for this story."
  },
  "additional-sources": {
    label: "Additional sources",
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
