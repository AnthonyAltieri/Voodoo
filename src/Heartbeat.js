/**
 * @author Anthony Altieri on 10/14/16.
 * @author Bharat Batra on 10/14/16.
 */

import { send } from './Ajax';

class Heartbeat {
  constructor(heartbeatEndpoint, type, secondsPerBeat = 60) {
    this.source = heartbeatEndpoint;
    this.milisecondsPerBeat = secondsPerBeat * 1000;
    this.isAlive = false;
    this.hasInit = false;
    this.listeners = [];
    this.init(type);
  }

  async init(type) {
    await this.beat(type);
    this.keepAlive();
  }

  async beat(type = 'GET') {
    const response = await send(type);
    if (response.error) {
      this.isAlive = false;
      return {
        error: response.error,
      }
    }
    if (response.code === 200) {
      this.listeners.forEach((l) => {
        l();
      });
      this.isAlive = true;
    } else {
      this.isAlive = false;
      throw new Error (`Response code: ${response.code} invalid, awaiting 200`);
    }
    this.hasInit = true;
  }

  keepAlive() {
    this.pacemaker = window.setInterval(
      () => {
        this.beat()
          .then(() => {})
          .catch((error) => {})
      }, this.milisecondsPerBeat
    )
  }

  subscribe(listeners) {
    const currentListeners = this.listeners;
    this.listeners = [...this.listeners, listeners];
    return () => {
      this.listeners = currentListeners;
    }
  }

}

export default Heartbeat;
