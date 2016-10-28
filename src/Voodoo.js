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

var Voodoo = {
  createSource,
  perform,
  source: null,
};

export default Voodoo;
