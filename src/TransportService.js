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
              : reject(
                  Error(
                    `Got response ${response.status}, ${response.statusText}`
                  )
                )
        )
        .catch(error => reject(Error("Encountered network connection error")));
    });
}

export default TransportService;
