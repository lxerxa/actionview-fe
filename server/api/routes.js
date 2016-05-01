import path from 'path';
import { readFile } from 'fs-promise';
import debug from 'debug';

import marked from 'marked';

import { users } from './data.json';

const simplifyUsers = (collection) => collection
  .map(({ user, seed }) => ({ ...user, seed }))
  .map(({ name, seed, picture }) => ({ name, seed, picture }));

export default function(router) {
  router.get('/users', function(req, res) {
    const results = simplifyUsers(users.slice(0, 10));
    return res.status(200).send(results);
  });

  router.get('/project', function(req, res) {
    const results = { ecode: 0, data: [{ id: '546761', name: '社交化项目管理系统', key: 'SPMS', creator: '卢红兵', create_time: 144444 },{ id: '54676i2', name: '企业安全网盘', key: 'WEBDISK', creator: '王仕喜', create_time: 144444 }] };
    return res.status(200).send(results);
  });

  router.post('/project', function(req, res) {
    const startTime = new Date().getTime(); 
    while (new Date().getTime() < startTime + 5000);
    //const results = { ecode: 0, data: { id: '546761', name: '播吧', key: 'BOBA', creator: '刘旭', create_time: 144444 }};
    const results = { ecode: 0, data: req.body };
    return res.status(200).send(results);
  });

  router.post('/session', function(req, res) {
    const results = { ecode: 0, data: { token: '123456', user: {id: 'nhy67ujm', name: 'liuxu', avatar: 'http://tp1.sinaimg.cn/2214067364/180/5605327547/1'}}};
    return res.status(200).send(results);
  });

  router.get('/users/:seed', function(req, res) {
    const { seed } = req.params;
    const [ result ] = simplifyUsers(users.filter(user => user.seed === seed));

    if (!result) return res.status(422).send({ error: { message: 'User not found' } });
    return res.status(200).send(result);
  });

  router.get('/readme', async function(req, res) {
    const readme = await readFile(path.resolve(__dirname, '../../README.md'), 'utf8');
    return res.status(200).send(marked(readme));
  });
}
