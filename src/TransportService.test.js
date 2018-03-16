import TransportService from "./TransportService";

const setup = fetchMock => new TransportService(fetchMock);

describe("fetch()", () => {
  it("should reject if inner fetch() rejects", () => {
    expect.assertions(1);

    // Mock fetch to always reject
    const ts = setup(
      jest.fn().mockImplementation(
        (uri, config) =>
          new Promise((resolve, reject) => {
            reject(Error());
          })
      )
    );

    return expect(ts.fetch("/")).rejects.toEqual(Error());
  });

  it("should reject if response is not OK", () => {
    expect.assertions(1);

    // Mock fetch to always return not OK
    const ts = setup(
      jest.fn().mockImplementation(
        (uri, config) =>
          new Promise((resolve, reject) => {
            resolve({ ok: false });
          })
      )
    );

    return expect(ts.fetch("/")).rejects.toEqual(Error("HTTP response not OK"));
  });

  it("should resolve if the response is OK", () => {
    expect.assertions(1);

    // Mock fetch to always return OK
    const ts = setup(
      jest.fn().mockImplementation(
        (uri, config) =>
          new Promise((resolve, reject) => {
            resolve({ ok: true });
          })
      )
    );

    return expect(ts.fetch("/")).resolves.toEqual({ ok: true });
  });
});
