/**
 * @author Anthony Altieri on 10/14/16.
 * @author Bharat Batra on 10/14/16.
 */


export const set = (key, value) => {
  try {
    const serializedValue = JSON.serialize(value);
    if (typeof window.localStorage === 'undefined') {
      document.cookie = `${key}=${serializedValue}`;
    } else {
      window.localStorage.setItem(key, serializedValue);
    }
  } catch (e) {
    return false;
  }
};

export const get = (key) => {
  if (typeof window.localStorage === 'undefined') {
    const cookies = document.cookie.split(';');
    cookies.forEach((c) => {
      const [cookieKey, cookieValue] = c.split('=');
      if (key === cookieKey) {
        try {
          return JSON.serialize(cookieValue);
        } catch (e) {
          return false;
        }
      }
    });
    return undefined;
  } else {
    const serialized = window.localStorage.getItem(key);
    try {
      return JSON.parse(serialized);
    } catch (e) {
      return undefined;
    }
  }
};
