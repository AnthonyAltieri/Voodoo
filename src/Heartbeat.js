/**
 * @author Anthony Altieri on 10/14/16.
 * @author Bharat Batra on 10/14/16.
 */

import { send } from './Ajax';

class Heartbeat {
  constructor(heartbeatEndpoint, type, secondsPerBeat = 1) {
    this.source = heartbeatEndpoint;
    this.isAlive = false;
    this.listeners = [];
    this.milisecondsPerBeat = secondsPerBeat * 1000;
    this.beatType = type;
    this.keepAlive(type);
  }

  beginPanic() {
    if (typeof this.pacemaker !== 'undefined') {
      clearInterval(this.pacemaker)
    }
  }

  endPanic() {
    this.keepAlive(this.beatType);
  }

  keepAlive(type) {
    console.log('keep Alive');
    this.pacemaker = window.setInterval(() => {
      this.beat(type);
    }, this.milisecondsPerBeat);
  }


  beat(type = 'GET') {
    console.log('beat')
    const notFiveHundred = (n) => (n < 500 && n > 599);
    send(type, this.source)
      .then((response) => {
        console.log('send.then()')
        const { code } = response;
        if (typeof code === 'undefined')  {
          throw new Error(`response code should not be undefined`);
        }
        this.isAlive = notFiveHundred(response.code);
        // If there are listeners waiting for the heartbeat to become
        // alive again then execute them
        if (this.isAlive && this.listeners.length > 0) {
          this.listeners.forEach((l) => { l() });
        }
      }).catch((error) => {console.log('send.catch()', error)});
  }


  subscribe(listener, type) {
      const currentListeners = this.listeners;
      this.listeners = [...this.listeners, listener];
      return () => {
        this.listeners = currentListeners;
      }
  }

}

export default Heartbeat;
