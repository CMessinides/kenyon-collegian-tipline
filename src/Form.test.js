import React from "react";
import { shallow } from "enzyme";
import Form from "./Form";

it("should render without crashing", () => {
  shallow(<Form />);
});
