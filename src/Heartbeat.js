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
   *   - secondsPerBeat: {number} how many seconds to wait in between each beat
   *                      Default value set to 3
   *   - secondsPerPanicBeat: {number} when in panic mode how many seconds to wait
   *                           Default value set to 1
   *   between each beat
   *   - withCredentials {boolean} if to put withCredentials on the Ajax
   * request
   */
  constructor(endpoint: string, options: options): void {
    const { type, secondsPerBeat, secondsPerPanicBeat, withCredentials } = options;
    const ONE_SECOND = 1;
    const THREE_SECONDS = 3;
    const secondsToMilliseconds = (seconds) => {
      const CONVERSION = 1000;
      return seconds * CONVERSION;
    };
    this.milisecondsPerBeat = secondsPerBeat
      ? secondsToMilliseconds(secondsPerBeat)
      : secondsToMilliseconds(THREE_SECONDS);
    this.milisecondsPerPanicBeat = secondsPerPanicBeat
      ? secondsToMilliseconds(secondsPerPanicBeat)
      : secondsToMilliseconds(ONE_SECOND);
    this.type = type;
    this.endpoint = endpoint;
    this.withCredentials = withCredentials ? withCredentials : true;
    this.aliveListeners = [];
    this.deadListeners = [];
    this.isPanic = false;
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
        if (this.isAlive) {
          console.log("Beat is alive");
          this.aliveListeners.forEach(l => { l() });
        } else {
          console.log("Beat is dead");
          this.deadListeners.forEach(l => { l() });
        }
      })
      .catch((fail: AjaxFail) => {
        // Is not alive on server error or offline
        this.handleDead()
      })
  }

  startPanic() {
    this.isPanic = true;
    this.panicPacemaker = window.setInterval(() => {
      this.beat();
    }, this.milisecondsPerPanicBeat)
  }

  stopPanic() {
    this.isPanic = false;
    if (!!this.panicPacemaker) clearInterval(this.panicPacemaker);
  }

  /**
   * Stops the interval (pacemaker) that pings the server periodically (beat)
   */
  stop(): void {
    if (!!this.pacemaker) clearInterval(this.pacemaker);
  }

  subscribe(type: string = 'ALIVE' | 'DEAD', listener) {
    switch (type) {
      case 'ALIVE': {
        const listeners = this.aliveListeners;
        this.aliveListeners = [...this.aliveListeners, listener];
        return () => { this.aliveListeners = listeners };
      }

      case 'DEAD': {
        const listeners = this.deadListeners;
        this.deadListeners = [...this.deadListeners, listener];
        return () => { this.deadListeners = listeners };
      }

      default: {
        throw new Error(`subscribe type ${type} not allowed`);
      }
    }

  }

  handleDead():void{
    this.isAlive = false;
    this.deadListeners.forEach(l => { l() });
  }

  forceDead(): void {
    console.log("Forced Dead");
    this.handleDead();
  }
}


export default Heartbeat;
