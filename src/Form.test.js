import React from "react";
import { mount, shallow } from "enzyme";
import Form from "./Form";

// Mock helpers
const mockValidator = (fn = str => null) => {
  const v = {};
  v.validate = fn;
  return v;
};

const mockTransportService = fn => {
  const ts = {};
  ts.fetch = fn;
  return ts;
};

// Assertion helpers
const assertInputsNotCleared = wrapper => {
  expect(wrapper.find("input").someWhere(i => i.props().value.length > 0)).toBe(
    true
  );
};

const assertSubmitDisabled = wrapper => {
  expect(wrapper.find("[type='submit']").prop("disabled")).toBe(true);
};

// TransportService.fetch() mocks
const mockFetchOK = (url, config) =>
  new Promise(resolve =>
    resolve({
      ok: true
    })
  );
const mockFetchErr = (url, config) =>
  new Promise((resolve, reject) => reject(Error()));

// Field mocks
const optionalField = {
  label: "Optional"
};
const requiredField = {
  label: "Required",
  required: true
};
const invalidField = {
  label: "Invalid",
  validator: mockValidator(string => Error())
};

const createForm = (manualProps = {}) => {
  const props = {
    name: "tip",
    fields: {},
    transportService: mockTransportService(mockFetchOK),
    ...manualProps
  };

  const wrapper = mount(<Form {...props} />);
  const form = wrapper.instance();

  return { wrapper, form };
};

const changeField = async (form, name, value) => {
  const event = { target: { name, value } };
  const validator = form.props.fields[name].validator;
  await form.handleFieldChange(event, validator);
};

describe("with empty required fields", () => {
  const mockFetch = jest.fn();
  let wrapper;
  let form;

  beforeEach(async () => {
    // Create the form
    const f = createForm({
      fields: { requiredField, optionalField },
      transportService: mockTransportService(mockFetch)
    });
    wrapper = f.wrapper;
    form = f.form;

    // Put the form into an incomplete state
    await changeField(form, "optionalField", "optional");
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it("disables the submit button", () => {
    wrapper.update();
    assertSubmitDisabled(wrapper);
  });

  describe("on submit", () => {
    it("does not send the data", async () => {
      expect.assertions(1);

      await form.handleSubmit();
      wrapper.update();

      expect(mockFetch).not.toHaveBeenCalled();
    });

    it("does not clear the inputs", async () => {
      expect.assertions(1);

      await form.handleSubmit();
      wrapper.update();

      assertInputsNotCleared(wrapper);
    });
  });
});

describe("with field validation errors", () => {
  const mockFetch = jest.fn();
  let wrapper;
  let form;

  beforeEach(async () => {
    // Create the form
    const f = createForm({
      fields: { invalidField },
      transportService: mockTransportService(mockFetch)
    });
    wrapper = f.wrapper;
    form = f.form;

    // Put the form into an invalid state
    await changeField(form, "invalidField", "invalid");
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it("disables the submit button", () => {
    wrapper.update();
    assertSubmitDisabled(wrapper);
  });

  describe("on submit", () => {
    it("does not send the data", async () => {
      expect.assertions(1);

      await form.handleSubmit();
      wrapper.update();

      expect(mockFetch).not.toHaveBeenCalled();
    });

    it("does not clear the inputs", async () => {
      expect.assertions(1);

      await form.handleSubmit();
      wrapper.update();

      assertInputsNotCleared(wrapper);
    });
  });
});

describe("with valid fields", () => {
  let wrapper;
  let form;

  beforeEach(async () => {
    // Create the form
    const f = createForm({
      action: "/",
      name: "valid",
      fields: { requiredField, optionalField }
    });
    wrapper = f.wrapper;
    form = f.form;

    // Put the form into a valid state
    await changeField(form, "requiredField", "text");
    await changeField(form, "optionalField", "more text");
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it("enables the submit button", () => {
    wrapper.update();
    expect(wrapper.find("[type='submit']").prop("disabled")).toBe(false);
  });

  describe("on submit", () => {
    describe("on success", () => {
      const mockFetch = jest.fn().mockImplementation(mockFetchOK);

      beforeEach(() => {
        form.fetch = mockFetch;
      });

      it("sends the data", async () => {
        expect.assertions(1);

        await form.handleSubmit();
        wrapper.update();

        expect(mockFetch).toHaveBeenCalledWith("/", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: "form-name=valid&requiredField=text&optionalField=more%20text"
        });
      });

      it("clears the inputs", async () => {
        expect.assertions(1);

        await form.handleSubmit();
        wrapper.update();

        expect(
          wrapper.find("input").everyWhere(i => i.prop("value").length === 0)
        ).toBe(true);
      });

      //  TODO: Implement alerts
      // it("shows a success alert", async () => {
      //   expect.assertions(1);

      //   await form.handleSubmit();
      //   wrapper.update();

      //   expect(wrapper.find(".alert--success").exists()).toBe(true);
      // });
    });

    describe("on error", () => {
      beforeEach(() => {
        form.fetch = mockFetchErr;
      });

      it("does not clear the inputs", async () => {
        expect.assertions(1);

        await form.handleSubmit();
        wrapper.update();

        assertInputsNotCleared(wrapper);
      });

      // TODO: Implement alerts
      // it("shows an error alert", async () => {
      //   expect.assertions(1);

      //   await form.handleSubmit();
      //   wrapper.update();

      //   expect(wrapper.find(".alert--error").exists()).toBe(true);
      // });
    });
  });
});
