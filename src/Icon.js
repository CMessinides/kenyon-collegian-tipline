import React from "react";

import "./Icon.css";

const IconShell = ({ size = 24, className = "", name, children, ...props }) => {
  className = ["icon", `icon--${name}`, className].join(" ");
  return (
    <svg
      {...props}
      height={size}
      width={size}
      className={className}
      viewBox="0 0 24 24"
    >
      {children}
    </svg>
  );
};

export const ArrowIcon = props => {
  return (
    <IconShell {...props} name="arrow">
      <path d="M21 13c.5523 0 1-.4477 1-1s-.4477-1-1-1v2zM3 12l-.7071-.7071c-.3905.3905-.3905 1.0237 0 1.4142L3 12zm7.7071-6.2929c.3905-.3905.3905-1.0237 0-1.4142-.3905-.3905-1.0237-.3905-1.4142 0L10.707 5.707zm-1.4142 14c.3905.3905 1.0237.3905 1.4142 0 .3905-.3905.3905-1.0237 0-1.4142L9.293 19.7071zM21 11H3v2h18v-2zM3.7071 12.7071l7-7L9.293 4.293l-7 7 1.414 1.414zm-1.4142 0l7 7 1.4142-1.4142-7-7L2.293 12.707z" />
    </IconShell>
  );
};

export const PopoutIcon = props => {
  return (
    <IconShell {...props} name="popout">
      <path d="M7 4c.5523 0 1-.4477 1-1s-.4477-1-1-1v2zM3 3V2c-.5523 0-1 .4477-1 1h1zm0 18H2c0 .5523.4477 1 1 1v-1zm18 0v1c.5523 0 1-.4477 1-1h-1zm1-4c0-.5523-.4477-1-1-1s-1 .4477-1 1h2zM7 2H3v2h4V2zM2 3v18h2V3H2zm1 19h18v-2H3v2zm19-1v-4h-2v4h2zM6.2929 16.2929c-.3905.3905-.3905 1.0237 0 1.4142.3905.3905 1.0237.3905 1.4142 0L6.293 16.2929zM21 3h1c0-.5523-.4477-1-1-1v1zm-1 8c0 .5523.4477 1 1 1s1-.4477 1-1h-2zm-7-9c-.5523 0-1 .4477-1 1s.4477 1 1 1V2zM7.7071 17.7071l14-14-1.4142-1.4142-14 14 1.4142 1.4142zM20 3v8h2V3h-2zm1-1h-8v2h8V2z" />
    </IconShell>
  );
};
