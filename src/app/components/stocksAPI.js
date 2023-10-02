const BASE_URL = 'https://prototype.sbulltech.com';

export function fetchCount(amount = 1) {
  return new Promise((resolve) =>
    setTimeout(() => resolve({ data: amount }), 500)
  );
}
export function fetchUnderlyings() {
  return fetch(`${BASE_URL}/api/underlyings`).then(
    (data) => data.json()
  )
}

export function fetchDerivatives(token = 0) {
  return fetch(`${BASE_URL}/api/derivatives/${token}`).then(
    (data) => data.json()
  )
}

export function fetchQuote(token = 0) {
  return fetch(`${BASE_URL}/api/quotes/${token}`).then(
    (data) => data.json()
  )
}