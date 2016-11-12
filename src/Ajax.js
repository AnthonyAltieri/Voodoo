/**
 * @author Anthony Altieri on 11/1/16.
 */

const SERVER_PREFIX = 'https://regi';
const LOCAL_PREFIX = 'http://localhost:4040';

export const send = (type, url, params = {}, withCredentials = true) => {
  return new Promise((resolve, reject) => {
    const xmlhttp = new XMLHttpRequest();
    if (type !== 'POST' && type !== 'GET') {
      throw new Error(`Invalid xmlhttp type ${type}`);
    }
    console.log(`sending ${type} at ${LOCAL_PREFIX + url}`);
    xmlhttp.open(type, LOCAL_PREFIX + url, true);
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.withCredentials = withCredentials;
    xmlhttp.onreadystatechange = () => {
      if (xmlhttp.readyState !== 4) return;
      if (xmlhttp.status === 200) {
        try {
          const payload = JSON.parse(xmlhttp.responseText);
          resolve(payload);
        } catch (e) {
          reject({
            text: 'response parse error'
          })
        }
      } else {
        reject({
          code: xmlhttp.status,
          text: xmlhttp.statusText,
        })
      }
    }
    try {
      const parameters = JSON.stringify(params);
      console.log('parameters', parameters);
      xmlhttp.send(parameters);
    } catch (e) {
      reject({
        text: 'params stringify error',
      })
    }
  });
};

export const post = (url, params = {}, withCredentials = true) => {
  console.log('post()');
  return new Promise((resolve, reject) => {
    send('POST', url, params, withCredentials)
      .then((payload) => { resolve(payload) })
      .catch((error) => { reject(error) })
  })
};
