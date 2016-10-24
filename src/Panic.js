/**
 * @author Anthony Altieri on 10/22/16.
 */

import * as CQ from './CallQueue';
import * as Ajax from './Ajax';
import Hub from './Hub';
import Heartbeat from './Heartbeat';

type HTTP_TYPE = 'POST' | 'GET';
type options = {
  type: HTTP_TYPE,
  secondsPerBeat: number,
  withCredentials: boolean,
};


class Panic {
  constructor(hub, endpoint: string, options: options) {
    CQ.init();
    this.heartbeat = new Heartbeat(endpoint, options);
    this.unsubscribeOnAlive = this.heartbeat.subscribe('ALIVE', onAlive.bind(this));
    this.unsubscribeOnDead = this.heartbeat.subscribe('DEAD', onDead.bind(this));
    this.priorAliveStatus = false;
  }


  http(type: HTTP_TYPE, url, params, responseTag, withCredentials) {
    return new Promise((resolve, reject) => {
      if (this.heartbeat.isAlive) {
        Ajax
          .send(type, url, params, withCredentials)
          .then((payload) => { resolve(payload) })
          .catch(() => {
            this.heartbeat.forceDead();
            this.http(type, url, params, withCredentials);
          })
      } else {
        CQ.add(CQ.get(), {
          time: new Date().getTime(),
          type,
          url,
          params,
          withCredentials,
          responseTag,
        });
      }

    })
  }

  get(url, params, responseTag, withCredentials = true) {
    this.http('GET', url, params, responseTag, withCredentials);
  }

  post(url, params, responseTag, withCredentials = true) {
    this.http('POST', url, params, responseTag, withCredentials);
  }
}

function onAlive() {
  if (this.heartbeat.isPanic) {
    this.heartbeat.stopPanic();
  }
  if (this.priorAliveStatus === false) {
    this.priorAliveStatus = true;
    // Going from dead to alive
    CQ
      .get()
      .forEach((c) => {
        this.http(c.type, c.url, c.params, c.withCredentials)
          .then((payload) => {
            const response = this.hub[c.responseTag];
            if (typeof response === 'function') {
              response(payload);
            }
          })
      })
  }
  console.log('alive')
}

function onDead() {
  if (!this.heartbeat.isPanic) {
    this.heartbeat.startPanic();
  }
  if (this.priorAliveStatus === true) {
    this.priorAliveStatus = false;
    // Going from alive to dead
  }
  console.log('dead');
}


export default Panic;
