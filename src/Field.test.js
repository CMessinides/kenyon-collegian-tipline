import React from "react";
import { shallow } from "enzyme";
import Field from "./Field";

it("renders without crashing", () => {
  shallow(<Field />);
});
