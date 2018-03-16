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

export const AlertIcon = props => {
  return (
    <IconShell {...props} name="alert">
      <g transform="translate(245 172)">
        <mask id="a">
          <path
            d="M20 10c0 5.5228-4.4772 10-10 10-5.5229 0-10-4.4772-10-10C0 4.4771 4.4771 0 10 0c5.5228 0 10 4.4771 10 10z"
            fill="#fff"
            transform="translate(-243 -170)"
          />
        </mask>
        <g mask="url(#a)">
          <path d="M-225-160c0 4.4183-3.5817 8-8 8v4c6.6274 0 12-5.3726 12-12h-4zm-8 8c-4.4183 0-8-3.5817-8-8h-4c0 6.6274 5.3726 12 12 12v-4zm-8-8c0-4.4183 3.5817-8 8-8v-4c-6.6274 0-12 5.3726-12 12h4zm8-8c4.4183 0 8 3.5817 8 8h4c0-6.6274-5.3726-12-12-12v4z" />
        </g>
      </g>
      <path d="M13 17c0 .5523-.4477 1-1 1s-1-.4477-1-1 .4477-1 1-1 1 .4477 1 1zM13 7c0-.5523-.4477-1-1-1s-1 .4477-1 1h2zm-2 6c0 .5523.4477 1 1 1s1-.4477 1-1h-2zm0-6v6h2V7h-2z" />
    </IconShell>
  );
};
