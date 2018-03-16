class TransportService {
  constructor(fetchFn = fetch.bind(window ? window : global)) {
    this.fetchFn = fetchFn;
  }

  fetch = (uri, config) =>
    new Promise((resolve, reject) => {
      this.fetchFn(uri, config)
        .then(
          response =>
            response.ok
              ? resolve(response)
              : reject(Error("HTTP response not OK"))
        )
        .catch(error => reject(error));
    });
}

export default TransportService;
