/**
 * @author Anthony Altieri on 10/23/16.
 */


const combineWaterfalls = (waterfallsObj) => {
  const keys = Obj.keys(waterfallsObj);
  keys.forEach((k) => {
  })
};

const trickle = (tag) => {
  const helper = (obj, tag, payload) => {
    const keys = Obj.keys(obj);
    let values = [];
    keys.forEach((k) => {
      values = [...values, obj[k]];
    });
    values.forEach((v) => {
      switch (typeof v) {
        case 'function': {
          v(tag, payload);
          break;
        }
        case 'object': {
          helper(v, tag, payload);
          break;
        }
        default: {
          throw new Error(`Invalid waterfall value of type: ${typeof v}`);
        }
      }
    })
  }
};

const createSource = (source) => {
  this.source = source;
};

const waterfall = {
  createSource: createSource.bind(waterfall),
  trickle: trickle.bind(waterfall),
};

