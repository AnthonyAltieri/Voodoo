/**
 * @author Anthony Altieri on 10/22/16.
 */

import * as Storage from './Storage';
import * as Ajax from './Ajax';
import Heartbeat from './Heartbeat';

type HTTP_TYPE = 'POST' | 'GET';
type options = {
  type: HTTP_TYPE,
  secondsPerBeat: number,
  withCredentials: boolean,
};

const LS_KEY = 'PanicCallQueue';

class Panic {
  constructor(endpoint: string, options: options) {
    this.heartbeat = new Heartbeat(endpoint, options);
  }

  http(type: HTTP_TYPE, url, params, withCredentials) {
    console.log(`http: ${type}`);
    console.log(`heartbeat.isAlive: ${this.heartbeat.isAlive}`)
    if (this.heartbeat.isAlive) {
      Ajax
        .send(type, url, params, withCredentials)
        .then(() => {})
        .catch(() => {
          // NOTE: Might want to add some sort of functionality to
          // guarantee that the http call after forceDead() uses
          // offline functionality
          this.heartbeat.forceDead();
          this.http(type, url, params, withCredentials);
        })
    } else {
      // TODO: Implement panic mode
      console.log('http with no connection')
      try {
        const call = `${type}**${url}**${JSON.stringify(params)}**${withCredentials}$$$${new Date()}`;
        let callQueue = Storage.get(LS_KEY);
        if (!callQueue) {
          callQueue = [];
        }
        // Add call to queue
        // TODO: Sort [...calQueue, call] by time
        callQueue = [...callQueue, call];
        // Save in local storage
        Storage.set(LS_KEY, callQueue);
      } catch (e) {
        // Silently fail
      }
    }
  }

  get(url, params, withCredentials = true) {
    this.http('GET', url, params, withCredentials);
  }

  post(url, params, withCredentials = true) {
    this.http('POST', url, params, withCredentials);
  }
}

export default Panic;
