import React from "react";
import classnames from "classnames";

import "./Alert.css";
import { AlertIcon, CheckIcon, CloseIcon } from "./Icon";

const alertIcon = (type, iconProps) => {
  switch (type) {
    case "success":
      return <CheckIcon {...iconProps} />;
    default:
      return <AlertIcon {...iconProps} />;
  }
};

const Alert = ({
  message,
  show,
  animate,
  type,
  onDismiss,
  onAnimationEnd,
  timeout = 300
}) => {
  const className = classnames(
    "alert",
    `alert--${type}`,
    `alert--${show ? "show" : "hide"}`,
    {
      "alert--animated": animate === true
    }
  );
  const iconProps = {
    size: 20,
    className: "alert__icon"
  };
  return (
    <div className={className} onAnimationEnd={onAnimationEnd}>
      <div className="alert__badge">{alertIcon(type, iconProps)}</div>
      <div className="alert__body">
        <strong className="alert__heading">{type}</strong>
        <p>{message}</p>
      </div>
      {onDismiss && (
        <button
          className="alert__dismiss"
          type="button"
          aria-label="Dismiss alert"
          disabled={!show}
          onClick={onDismiss}
        >
          <CloseIcon {...iconProps} size={16} />
        </button>
      )}
    </div>
  );
};

export default Alert;
