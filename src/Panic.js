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
      if (this.heartbeat.isAlive || typeof this.heartbeat.isAlive==='undefined') {
        Ajax
          .send(type, url, params, withCredentials)
          .then((payload) =>
                  {
                    console.log(".then now gonna resolve payload");
                     if(payload.code !== 0){
                       console.log(payload);
                       resolve(payload);
                     }
                     else{
                       console.log("Payload couldn't be resolved code was found to be 0");
                       this.heartbeat.forceDead();
                       this.http(type, url, params, withCredentials);
                     }
                   })
          .catch(() => {
            console.log("Send caught an error");
            this.heartbeat.forceDead();
            this.http(type, url, params, withCredentials);
          })
      } else {
        console.log("Gonna Add to CQ");
        CQ.add( {
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
  console.log('alive');
  if (this.heartbeat.isPanic) {
    console.log("In Panic mode, but gonna stop panic cuz alive");
    this.heartbeat.stopPanic();
  }
  if (this.priorAliveStatus === false) {
    // Going from dead to alive
    this.priorAliveStatus = true;
    console.log("Prior Alive set to true");
    console.log(JSON.stringify(CQ.get(), null, 2));
    //If calls exist on CQ, we will now attempt to make them
    if(!!CQ.get()){
      CQ
        .get()
        .forEach((c) => {
          this.http(c.type, c.url, c.params, c.withCredentials)
            .then((payload) => {
              // const response = this.hub[c.responseTag];
              // if (typeof response === 'function') {
              //   response(payload);
              // }
              console.log("Call Made: ");
              console.log(JSON.stringify(c, null, 2));
              console.log("Response: ");
              console.log(JSON.stringify(payload, null, 2));
            })
        })
    }
  }

}

function onDead() {
  console.log('dead');
  if (!this.heartbeat.isPanic) {
    this.heartbeat.startPanic();
  }
  if (this.priorAliveStatus === true) {
    this.priorAliveStatus = false;
    // Going from alive to dead
  }

}


export default Panic;
