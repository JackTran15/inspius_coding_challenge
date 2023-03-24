import * as dayjs from 'dayjs';
export class DateUtil {
  static format(date: string | Date, format = 'YYYY-MM-DD HH:mm:ss') {
    return dayjs(date).format(format);
  }

  static get(date: string | Date, units: dayjs.UnitType[]) {
    const obj = {};
    const dateJs = dayjs(date);
    units.forEach((unit) => {
      let _val = 0;
      if (unit === 'month' || unit === 'months' || unit === 'M') _val = 1;
      obj[unit] = dateJs.get(unit) + _val;
    });
    return obj;
  }

  static setReset(date: string | Date, isStart = true) {
    const dateJs = dayjs(date);
    if (isStart) return dateJs.set('h', 0).set('minute', 0).set('second', 0);

    return dateJs.set('h', 23).set('minute', 59).set('second', 59);
  }
}
