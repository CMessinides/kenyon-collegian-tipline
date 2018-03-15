import React from "react";
import { mount, shallow } from "enzyme";
import Form from "./Form";

// Helpers
const createMockValidator = (fn = str => null) => {
  const v = {};
  v.validate = fn;
  return v;
};

const assertInputsNotCleared = wrapper => {
  wrapper.update();
  expect(wrapper.find("input").someWhere(i => i.props().value.length > 0)).toBe(
    true
  );
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
  // Save fetch()
  const _fetch = fetch;

  // Restore fetch()
  afterAll(() => {
    fetch = _fetch;
  });

  describe("given valid data", () => {
    // Create the form
    const wrapper = mount(
      <Form name="tip" fields={{ requiredField, optionalField }} />
    );
    const form = wrapper.instance();

    beforeAll(async () => {
      // Mock fetch()
      fetch = jest.fn().mockImplementation((url, opts) => {
        return new Promise((resolve, reject) => {
          resolve({ ok: true });
        });
      });

      // Add the required input
      await form.handleFieldChange(
        { target: { name: "requiredField", value: "input" } },
        createMockValidator()
      );

      // Submit the form
      await form.handleSubmit();
      wrapper.update();
    });

    afterAll(() => {
      // Clean up
      wrapper.unmount();
    });

    it("should send the data", () => {
      expect(fetch).toHaveBeenCalledWith("/", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: "form-name=tip&requiredField=input&optionalField="
      });
    });

    it("should clear the inputs", () => {
      const allInputsClear = wrapper
        .find("input")
        .everyWhere(i => i.prop("value") === "");
      expect(allInputsClear).toBe(true);
    });
  });

  describe("given missing data", () => {
    // Create the form
    const wrapper = mount(<Form fields={{ requiredField, optionalField }} />);
    const form = wrapper.instance();

    beforeAll(async () => {
      // Mock fetch()
      fetch = jest.fn();

      // Add optional input
      await form.handleFieldChange(
        { target: { name: "optionalField", value: "optional" } },
        createMockValidator()
      );

      // Submit the form without required data
      await form.handleSubmit();
    });

    afterAll(() => {
      // Clean up
      wrapper.unmount();
    });

    it("should not send the data", () => {
      expect(fetch).not.toHaveBeenCalled();
    });

    it("should not clear the inputs", () => {
      assertInputsNotCleared(wrapper);
    });
  });

  describe("given data with errors", () => {
    // Create the form
    const wrapper = mount(<Form fields={{ invalidField }} />);
    const form = wrapper.instance();

    beforeAll(async () => {
      // Mock fetch()
      fetch = jest.fn();

      // Add the invalid input
      await form.handleFieldChange(
        { target: { name: "invalidField", value: "invalid" } },
        invalidField.validator
      );

      // Submit the form with invalid data
      await form.handleSubmit();
    });

    afterAll(() => {
      // Clean up
      wrapper.unmount();
    });

    it("should not send the data", () => {
      expect(fetch).not.toHaveBeenCalled();
    });

    it("should not clear the inputs", () => {
      assertInputsNotCleared(wrapper);
    });
  });

  describe("given the response is not OK", () => {
    // Create the form
    const wrapper = mount(<Form fields={{ optionalField }} />);
    const form = wrapper.instance();

    beforeAll(async () => {
      // Mock fetch
      fetch = jest.fn().mockImplementation(
        () =>
          new Promise((resolve, reject) => {
            resolve({ ok: false });
          })
      );
      // Add some input
      await form.handleFieldChange(
        { target: { name: "optionalField", value: "optional" } },
        createMockValidator()
      );
      // Submit the form
      await form.handleSubmit();
    });

    afterAll(() => {
      // Clean up
      wrapper.unmount();
    });

    it("should not clear the inputs", () => {
      assertInputsNotCleared(wrapper);
    });
  });
});
