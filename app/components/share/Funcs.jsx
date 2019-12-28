import _ from 'lodash';
const moment = require('moment');

export function getAgoAt(stamptime, current_time) {

  if (!stamptime) { return ''; }
  if (!current_time) { return moment.unix(stamptime).format('YYYY/MM/DD HH:mm:ss'); }

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
  const newFileName = fileName.toLowerCase();
  const index = newFileName.lastIndexOf('.');
  if (index === -1) {
    return 'fa fa-file-o';
  }

  const docTypes = { 
    doc: 'word', docx: 'word', 
    xls: 'excel', 'xlsx': 'excel', 
    ppt: 'powerpoint', pptx: 'powerpoint',
    bmp: 'image', jpg: 'image', jpeg: 'image', png: 'image', gif: 'image',
    c: 'code', cpp: 'code', h: 'code', hpp: 'code', js: 'code', jsx: 'code', php: 'code', tpl: 'code', py: 'code', java: 'code', sh: 'code', pl: 'code', perl: 'code', go: 'code',cs: 'code', rb: 'code', html: 'code', css: 'code', asp: 'code', aspx: 'code', jsp: 'code', 
    pdf: 'pdf',
    txt: 'text',
    zip: 'zip', rar: 'zip', '7z': 'zip', gz: 'zip', bz: 'zip',
    avi: 'movie', mpg: 'movie', mov: 'movie', swf: 'movie', mp4: 'movie',
    wav: 'sound', aif: 'sound', mp3: 'sound', wma: 'sound', aac: 'sound'
  };

  const suffix = newFileName.substr(index + 1);
  if (docTypes[suffix]) {
    return 'fa fa-file-' + docTypes[suffix] + '-o';
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
