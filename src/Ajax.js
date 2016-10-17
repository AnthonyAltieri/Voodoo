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
      console.log('ajax done')
      if (ajax.status === 200) {
        let response = null;
        try {
          if (!!ajax.payload) {
            response = JSON.parse(ajax.payload);
          }
        } catch (e) {
          reject({
            code: 200,
            error: {
              info: 'JSON parse failed',
            }
          });
        }
        resolve({
          code: 200,
          payload: response,
        });
      } else {
        console.log('ajax status ' + ajax.status);
        switch (ajax.status) {
          // Redirection
          case 300: {
            // Do nothing
            reject({
              code: 300,
            });
            return;
          }

          // Client Error
          case 400: {
            reject({
              code: 400,
              error: {
                code: 400,
                info: 'Client Error',
              }
            });
            return;
          }

          // Server Error
          case 500: {
            reject({
              code: 500,
              error: {
                code: 500,
                info: 'Server Error',
              }
            });
            return;
          }
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

