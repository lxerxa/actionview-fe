import _ from 'lodash';
const moment = require('moment');

export function getAgoAt(stamptime, current_time) {

  if (!stamptime) { return ''; }
  if (!current_time) { return moment.unix(stamptime).format('YY/MM/DD HH:mm:ss'); }

  const points = [
    { value: 365 * 24 * 60 * 60, suffix: '年前', max: 2 },
    { value: 30 * 24 * 60 * 60, suffix: '个月前', max: 11 },
    { value: 7 * 24 * 60 * 60, suffix: '周前', max: 4 },
    { value: 24 * 60 * 60, suffix: '天前', max: 6 },
    { value: 60 * 60, suffix: '小时前', max: 23 },
    { value: 10 * 60, suffix: '0分钟前', max: 5 }
  ];

  let agoAt = '刚刚';
  const diff = current_time - stamptime;
  if (diff <= 0) { return agoAt; }

  for (let i = 0; i < 6; i++) {
    const mode = _.floor(diff / points[i].value);
    if (mode >= 1) {
      agoAt = _.min([ mode, points[i].max ]) + points[i].suffix;
      break;
    }
  }
  return agoAt;
}

export function getFileIconCss(fileName) {
  const newFileName = (fileName || '').toLowerCase();
  if (_.endsWith(newFileName, 'doc') || _.endsWith(newFileName, 'docx')) {
    return 'fa fa-file-word-o';
  } else if (_.endsWith(newFileName, 'xls') || _.endsWith(newFileName, 'xlsx')) {
    return 'fa fa-file-excel-o';
  } else if (_.endsWith(newFileName, 'ppt') || _.endsWith(newFileName, 'pptx')) {
    return 'fa fa-file-powerpoint-o';
  } else if (_.endsWith(newFileName, 'pdf')) {
    return 'fa fa-file-pdf-o';
  } else if (_.endsWith(newFileName, 'txt')) {
    return 'fa fa-file-text-o';
  } else if (_.endsWith(newFileName, 'zip') || _.endsWith(newFileName, 'rar') || _.endsWith(newFileName, '7z') || _.endsWith(newFileName, 'gz') || _.endsWith(newFileName, 'bz')) {
    return 'fa fa-file-zip-o';
  } else {
    return 'fa fa-file-o';
  }
}

export function ttFormat(value, w2m, d2m) {
  const direct = value < 0 ? -1 : 1;
  value = Math.abs(value);

  const newTT = [];
  let new_remain_min = _.ceil(value);
  if (new_remain_min >= 0)
  {
    const new_weeknum = _.floor(value / w2m);
    if (new_weeknum > 0)
    {
      newTT.push(new_weeknum + 'w');
    }
  }

  new_remain_min = value % w2m;
  if (new_remain_min >= 0)
  {
    const new_daynum = _.floor(new_remain_min / d2m);
    if (new_daynum > 0)
    {
      newTT.push(new_daynum + 'd');
    }
  }

  new_remain_min = new_remain_min % d2m;
  if (new_remain_min >= 0)
  {
    const new_hournum = _.floor(new_remain_min / 60);
    if (new_hournum > 0)
    {
      newTT.push(new_hournum + 'h');
    }
  }

  new_remain_min = new_remain_min % 60;
  if (new_remain_min > 0)
  {
    newTT.push(new_remain_min + 'm');
  }

  if (newTT.length <= 0)
  {
    newTT.push('0m');
  }
  return (direct < 0 ? '-' : '') + newTT.join(' ');
}
