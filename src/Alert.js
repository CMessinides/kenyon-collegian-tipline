import React from "react";
import classnames from "classnames";
import { Transition } from "react-transition-group";

import "./Alert.css";
import { AlertIcon, CheckIcon, CloseIcon } from "./Icon";

const Alert = ({
  message,
  show,
  animate,
  ok,
  onDismiss,
  onAnimationEnd,
  timeout = 300
}) => {
  return (
    <Transition in={show} timeout={timeout}>
      {status => {
        const className = classnames("alert", `alert--${status}`, {
          "alert--success": ok === true,
          "alert--error": ok === false,
          "alert--animated": animate === true
        });
        const iconProps = {
          size: 20,
          className: "alert__icon"
        };
        return (
          <div className={className} onAnimationEnd={onAnimationEnd}>
            <div className="alert__badge">
              {ok ? <CheckIcon {...iconProps} /> : <AlertIcon {...iconProps} />}
            </div>
            <div className="alert__body">{message}</div>
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
      }}
    </Transition>
  );
};

export default Alert;
