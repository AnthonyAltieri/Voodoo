// @flow

/**
 * @author Anthony Altieri on 10/22/16.
 */

// Define Types
type Tag = string;
type Grave = Object<String, Zombie | Grave>;
type Zombie = (tag: Tag, payload: Payload) => void;
type Payload = Object;

function createSource(source: Grave) {
  this.source = source;
}

function perform(tag: Tag, payload: Payload) {
  if (this.source === null) {
    throw new Error('Voodoo must have a source before using trickle');
  }
  const helper = (obj: Grave, t: Tag, p: Payload)  => {
    const keys = Object.keys(obj);
    let values = [];
    keys.forEach((key) => {
      values = [...values, obj[key]];
    });
    values.forEach((value) => {
      switch (typeof value) {
        case 'function': {
          value(tag, payload);
          break;
        }
        case 'object': {
          helper(value, tag, payload);
          break;
        }
        default: {
          throw new Error(`Invalid value of type: ${typeof value}`);
        }
      }
    })
  };
  helper(this.source, tag, payload);
}

function combineGraves(graves) {
  if (typeof graves === 'undefined') {
    throw new Error('The parameter must not be undefined');
  }
  if (typeof graves !== 'object') {
    throw new Error('The parameter must be an object');
  }
  const keys = Object.keys(graves);
  keys.forEach((k) => {
    const value = graves[k];
    if (typeof value === 'undefined') {
      throw new Error('The values of the keys of the parameter must not be undefined');
    }
    if (typeof value !== 'function' && typeof value !== 'object') {
      throw new Error('The value to the keys in the parameter object must be' +
        'either a grave (Object) or a zombie (function)');
    }
  });
  return {
    ...graves
  }
};

var Voodoo = {
  createSource,
  perform,
  source: null,
};

export default Voodoo;
