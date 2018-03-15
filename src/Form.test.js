import React from "react";
import { mount, shallow } from "enzyme";
import Form from "./Form";

const createMockValidator = (fn = str => null) => {
  const v = {};
  v.validate = fn;
  return v;
};

const optionalField = {
  label: "Optional"
};

const requiredField = {
  label: "Required",
  required: true
};

const invalidField = {
  label: "Invalid",
  validator: createMockValidator(string => Error())
};

it("should render without crashing", () => {
  shallow(<Form />);
});

describe("on submit", () => {
  const _fetch = fetch;

  afterAll(() => {
    fetch = _fetch;
  });

  it("should send data", async () => {
    expect.assertions(1);

    // Mock fetch
    fetch = jest.fn().mockImplementation((url, opts) => {
      return new Promise((resolve, reject) => {
        resolve({ ok: true });
      });
    });

    // Create form
    const wrapper = mount(
      <Form action="/" name="tip" fields={{ requiredField, optionalField }} />
    );
    const form = wrapper.instance();

    // Add the required input
    await form.handleFieldChange(
      { target: { name: "requiredField", value: "input" } },
      createMockValidator()
    );

    // Submit the form
    await form.handleSubmit();

    // Assert
    expect(fetch).toHaveBeenCalledWith("/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: "form-name=tip&requiredField=input&optionalField="
    });

    // Clean up
    wrapper.unmount();
  });

  it("should reject if a required field is empty", async () => {
    expect.assertions(1);

    // Mock fetch
    fetch = jest.fn();

    // Create and submit form
    const wrapper = mount(<Form fields={{ requiredField }} />);
    const form = wrapper.instance();

    // Submit the form without required data
    await form.handleSubmit();

    // Assert
    expect(fetch).not.toHaveBeenCalled();

    // Clean up
    wrapper.unmount();
  });

  it("should reject if a field has an error", async () => {
    expect.assertions(1);

    // Mock fetch
    fetch = jest.fn();

    // Create and submit form
    const wrapper = mount(<Form fields={{ invalidField }} />);
    const form = wrapper.instance();

    // Add the invalid input
    await form.handleFieldChange(
      { target: { name: "invalidField", value: "invalid" } },
      invalidField.validator
    );

    // Submit the form with invalid data
    await form.handleSubmit();

    // Assert
    expect(fetch).not.toHaveBeenCalled();

    // Clean up
    wrapper.unmount();
  });
});
