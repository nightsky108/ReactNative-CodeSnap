// @flow
import BackgroundTimer from 'react-native-background-timer';
import { v4 as uuidv4 } from 'uuid';

const numIntervals = 0;
const intervals = {};

const { now } = Date;

const setInterval = (cb: Function, delay: number): number => {
  // const id = numIntervals++;
  const id = uuidv4();
  let planned = now() + delay;

  const tick = () => {
    cb && cb();

    if (intervals[id]) {
      planned += delay;
      let interval = planned - now();

      if (interval < 0) {
        interval = 0;
      }

      intervals[id] = BackgroundTimer.setTimeout(tick, interval);
    }
  };

  intervals[id] = BackgroundTimer.setTimeout(tick, delay);

  return id;
};

const clearInterval = (id: number) => {
  BackgroundTimer.clearTimeout(intervals[id]);

  delete intervals[id];
};
const startTimer = (tick: Function, delay: number) => {
  BackgroundTimer.runBackgroundTimer(tick, 1000);
};
const stopTimer = (tick: Function, delay: number) => {
  BackgroundTimer.stopBackgroundTimer();
};
export default {
  setInterval,
  clearInterval,
  startTimer,
  stopTimer,
};
