/**
 * @author Anthony Altieri on 10/14/16.
 * @author Bharat Batra on 10/14/16.
 */

export const send = (type, url, params = {}, withCredentials = false)  => {
  console.log('send()')
  return new Promise((resolve, reject) => {
    const ajax = new XMLHttpRequest();
    ajax.open(type, url, true);
    ajax.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    ajax.withCredentials = withCredentials;
    ajax.onreadystatechange = () => {
      if (ajax.readyState !== XMLHttpRequest.DONE) return;
      const isFivehundred = (code) => code >= 500 && code <= 599;
      if (isFivehundred(ajax.status)) {
        reject({
          code: 500,
          error: {
            code: 500,
            info: 'Server Error',
          }
        });
      } else {
        console.log('ajax', ajax);
        try {
          const payload = JSON.stringify(ajax.payload);
          resolve({
            code: ajax.status,
            payload,
          })
        } catch (error) {
          reject({
            code: undefined,
            error,
          })
        }
      }
    };
    let parameters;
    try {
      if (!!params) {
        parameters = JSON.stringify(params)
      }
    } catch (e) {
      reject({
        error: {
          code: null,
          info: 'Stringify Failed: ' + e
        }
      });
    }
    ajax.send(parameters);
    return;
  })
};

