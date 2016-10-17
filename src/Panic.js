/**
 * @author Anthony Altieri on 10/14/16.
 * @author Bharat Batra on 10/14/16.
 */

import Heartbeat from './Heartbeat';
import { send } from './Ajax';
import * as Storage from './Storage';


const FLATLINE = 'flatline';

class Panic {
  constructor(heartbeatEndpoint, type, secondsPerBeat, panicSecondsPerBeat = 10) {
    console.log('init()');
    if (typeof heartbeatEndpoint === 'undefined') {
      throw new Error('Must have a valid heartbeat endpoint');
    }
    this.panicMilisecondsPerBeat = panicSecondsPerBeat;
    this.heartbeat = new Heartbeat(heartbeatEndpoint, type, secondsPerBeat);
  }

  get(url, params, withCredentials = true) {
    this.http('GET', url, params, withCredentials);
  }

  post(url, params, withCredentials = true) {
    this.http('POST', url, params, withCredentials);
  }
  http(type, url, params, withCredentials) {
    if (this.heartbeat.isAlive) {
      // If the heartbeat is alive send the HTTP request
      send(type, url, params, withCredentials)
    } else {
      // If the heartbeat is dead, determine if panic mode as been enabled
      if (!this.isPanic) {
        this.isPanic = true;
        this.heartbeat.beginPanic();
        this.crashcart = window.setInterval(
          () => {
            this.heartbeat.beat();
          }, this.panicMilisecondsPerBeat
        );
        const unsubscribe = this.heartbeat.subscribe(() => {
          clearInterval(this.crashcart);
          this.isPanic = false;
          this.heartbeat.endPanic();
          const flatlineActions = Storage.get(FLATLINE);
          if (typeof flatlineActions !== 'undefined') {
            flatlineActions.forEach((a) => {
              // TODO: Deal with dead data
              const [toCall, time] = a.split('&');
              const type = toCall.split(':')[0];
              const [url, params, withCredentials] = toCall.split(',');
              switch (type) {
                case 'GET': {
                  this.get(url, params, withCredentials);
                  break;
                }
                case 'POST': {
                  this.post(url, params, withCredentials);
                  break;
                }
              }
            });

          }
          unsubscribe();
        });
        Storage.set(FLATLINE, '[]');
      }
      const flatline = Storage.get(FLATLINE);
      Storage.set([
        ...flatline,
        `${type}:${url},${params},${withCredentials}&time:${new Date().getTime()}`]
      );
    }
  }

}





export default Panic;
