// @flow

/**
 * @author Anthony Altieri on 10/22/16.
 */

import * as Ajax from './Ajax';

type HTTP_TYPE = 'POST' | 'GET';
type options = {
  type: HTTP_TYPE,
  secondsPerBeat: number,
  withCredentials: boolean,
};
type AjaxResult = {
  code: number,
  payload: Object,
};
type AjaxFail = {
  code: number,
  error: Object,
}

class Heartbeat {
  /**
   * endpoint {String} The URI of the endpoint on the server that
   * will be used to determine connection status
   *
   * options {Object} The options that are to be applied to the
   * heartbeat singleton. These include:
   *   - type: HTTP_TYPE the type of
   *   - secondsPerBeat: number
   *   - withCredentials {boolean} if to put withCredentials on the Ajax
   * request
   */
  constructor(endpoint: string, options: options): void {
    const { type, secondsPerBeat, withCredentials } = options;
    const ONE_SECOND = 1;
    const secondsToMilliseconds = (seconds) => {
      const CONVERSION = 1000;
      return seconds * CONVERSION;
    };
    this.milisecondsPerBeat = secondsPerBeat
      ? secondsToMilliseconds(secondsPerBeat)
      : secondsToMilliseconds(ONE_SECOND);
    this.type = type;
    this.endpoint = endpoint;
    this.withCredentials = withCredentials;
    // not in panic by default
    this.inPanic = false;
    this.init();
  }

  /**
   * Initializes the beat interval
   */
  init(): void {
    this.pacemaker = window.setInterval(() => {
      this.beat();
    }, this.milisecondsPerBeat);

  }

  /**
   * Ping the server to determine if the server is working/client is
   * online
   */
  beat(): void {
    Ajax
      .send(this.type, this.endpoint, {}, this.withCredentials)
      .then((result: AjaxResult) => {
        const { code, payload } = result;
        const isOnline = code => code !== 0;
        console.log(`beat code: ${code}`);
        this.isAlive = isOnline(code);
      })
      .catch((fail: AjaxFail) => {
        // Is not alive on server error or offline
        this.isAlive = false;
      })
  }

  /**
   * Stops the interval (pacemaker) that pings the server periodically (beat)
   */
  stop(): void {
    if (!!this.pacemaker) clearInterval(this.pacemaker);
  }

  forceDead(): void {
    this.isAlive = false;
  }
}


export default Heartbeat;
