import React from "react";
import { shallow } from "enzyme";
import SubmitButton from "./SubmitButton";

it("should render without crashing", () => {
  shallow(<SubmitButton />);
});
