import path from 'path';
import { readFile } from 'fs-promise';
import debug from 'debug';

import marked from 'marked';

import { users } from './data.json';

const simplifyUsers = (collection) => collection
  .map(({ user, seed }) => ({ ...user, seed }))
  .map(({ name, seed, picture }) => ({ name, seed, picture }));

export default function(router) {

  router.get('/project', function(req, res) {
    const results = { ecode: 0, data: [{ id: '546761', name: '社交化项目管理系统', key: 'SPMS', creator: '卢红兵', create_time: 144444 },{ id: '54676i2', name: '企业安全网盘', key: 'WEBDISK', creator: '王仕喜', create_time: 144444 }] };
    return res.status(200).send(results);
  });

  router.get('/project/:key', function(req, res) {
    const results = { ecode: 0, data: { id: '546761', name: '播吧', key: 'BOBA', creator: '刘旭', create_time: 144444 }};
    return res.status(200).send(results);
  });

  router.post('/project', function(req, res) {
    const startTime = new Date().getTime(); 
    while (new Date().getTime() < startTime + 2000);
    //const results = { ecode: 0, data: { id: '546761', name: '播吧', key: 'BOBA', creator: '刘旭', create_time: 144444 }};
    const results = { ecode: 0, data: req.body };
    return res.status(200).send(results);
  });

  router.get('/project/:key/type', function(req, res) {
    const startTime = new Date().getTime();
    while (new Date().getTime() < startTime + 2000);
    const results = { ecode: 0, data: [{ id: '546761', name: '任务', screen: {id:'111', name:'界面1'}, workflow:{id:'111', name:'流程1'}},{ id: '546763', name: '需求', screen: {id:'222', name:'界面2'}, workflow:{id:'111', name:'流程2'}, default: true },{ id: '546762', name: '缺陷', screen: {id:'111', name:'界面1'}, workflow:{id:'111', name:'流程1'}},{ id: '2323', name: '子任务', screen: {id:'111', name:'界面1'}, workflow:{id:'222', name:'流程2'}}], options:{ screens:[{id:'111',name:'界面1'},{id:'222', name:'界面2'}, {id:'333', name:'界面3'}], workflows:[{id:'111',name:'流程1'},{id:'222', name:'流程2'}, {id:'333', name:'流程3'}] }};
    return res.status(200).send(results);
  });

  router.post('/project/:key/type', function(req, res) {
    const results = { ecode: 0, data: { id: 'were', name: '5C问题', screen: {id:'222', name:'界面2'}, workflow:{id:'111', name:'流程1'}} };
    return res.status(200).send(results);
  });

  router.get('/project/:key/type/:id', function(req, res) {
    const startTime = new Date().getTime();
    while (new Date().getTime() < startTime + 2000);
    const { id } = req.params;
    let results = {};
    if (id === '546761') {
      results = { ecode: 0, data: { id: '546761', name: '任务', screen: '111', workflow:'111'}};
    } else {
      results = { ecode: 0, data: { id: '546762', name: '任务2', screen: '222', workflow:'111'}};
    }
    return res.status(200).send(results);
  });

  router.put('/project/:key/type/:id', function(req, res) {
    const startTime = new Date().getTime();
    while (new Date().getTime() < startTime + 2000);
    const results = { ecode: 0, data: { id: '546761', name: '任务1111', screen:{id:'222', name:'界面2'}, workflow:{id:'222', name:'流程2'}}};
    return res.status(200).send(results);
  });

  router.put('/project/:key/type', function(req, res) {
    const startTime = new Date().getTime();
    while (new Date().getTime() < startTime + 2000);
    const results = { ecode: 0, data: [{ id: '546763', name: '需求', screen: {id:'222', name:'界面2'}, workflow:{id:'111', name:'流程2'}},{ id: '546761', name: '任务', screen: {id:'111', name:'界面1'}, workflow:{id:'111', name:'流程1'}},{ id: '546762', name: '缺陷', screen: {id:'111', name:'界面1'}, workflow:{id:'111', name:'流程1'}},{ id: '2323', name: '子任务', screen: {id:'111', name:'界面1'}, workflow:{id:'222', name:'流程2'}}] };
    return res.status(200).send(results);
  });

  router.delete('/project/:key/type/:id', function(req, res) {
    const startTime = new Date().getTime();
    while (new Date().getTime() < startTime + 2000);
    const results = { ecode: 0, data: { id: req.params.id }};
    return res.status(200).send(results);
  });

  router.get('/project/:key/field', function(req, res) {
    const startTime = new Date().getTime();
    while (new Date().getTime() < startTime + 2000);
    const results = { ecode: 0, data: [
      { id: '546761', name: '主题', type: 'Text', screens: [{id:'111', name:'界面1'}], key:'title'},
      { id: '546763', name: '描述', type:'Text', screens: [{id:'222', name:'界面2'}, {id:'111', name:'界面1'}], key:'description'},
      { id: '546762', name: '优先级', type:'Select', screens: [{id:'111', name:'界面1'}], key:'priority'},
      { id: '2323', name: '附件', type:'File', screens: [{id:'111', name:'界面1'}], key:'attachement'}], 
      options:{ screens:[{id:'111',name:'界面1'},{id:'222', name:'界面2'}, {id:'333', name:'界面3'}], workflows:[{id:'111',name:'流程1'},{id:'222', name:'流程2'}, {id:'333', name:'流程3'}] }};
    return res.status(200).send(results);
  });

  router.post('/project/:key/field', function(req, res) {
    const results = { ecode: 0, data: { id: 'were', name: '5C问题', type:'Select', key:'test', description:'aaaaaaa' } };
    return res.status(200).send(results);
  });

  router.get('/project/:key/field/:id', function(req, res) {
    const startTime = new Date().getTime();
    while (new Date().getTime() < startTime + 2000);
    const { id } = req.params;
    let results = {};
    if (id === '546761') {
      results = { ecode: 0, data: { id: '546761', name: '主题', key:'title',type:'Text', description:'aaaaaaaa'}};
    } else {
      results = { ecode: 0, data: { id: '546762', name: '优先级', key:'priority', type:'Select', optionValues:['111', '222', '333']}};
    }
    return res.status(200).send(results);
  });

  router.put('/project/:key/field/:id', function(req, res) {
    const startTime = new Date().getTime();
    while (new Date().getTime() < startTime + 2000);
    const results = { ecode: 0, data: { id: '546761', name: '主题2', key:'title',type:'Text', description:'bbbbb'}};
    return res.status(200).send(results);
  });

  router.delete('/project/:key/field/:id', function(req, res) {
    const startTime = new Date().getTime();
    while (new Date().getTime() < startTime + 2000);
    const results = { ecode: 0, data: { id: req.params.id }};
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
