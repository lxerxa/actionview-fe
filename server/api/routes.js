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

  /************** field *****************/
  router.get('/project/:key/field', function(req, res) {
    const startTime = new Date().getTime();
    while (new Date().getTime() < startTime + 2000);
    const results = { ecode: 0, data: [
      { id: '546761', name: '主题', type: 'Text', screens: [{id:'111', name:'界面1'}], key:'title'},
      { id: '546763', name: '描述', type:'Text', screens: [{id:'222', name:'界面2'}, {id:'111', name:'界面1'}], key:'description'},
      { id: '546762', name: '优先级', type:'Select', screens: [{id:'111', name:'界面1'}], key:'priority'},
      { id: '546764', name: '开始时间', type:'DatePicker', screens: [{id:'111', name:'界面1'}], key:'starttime'},
      { id: '2323', name: '附件', type:'CheckboxGroup', screens: [{id:'111', name:'界面1'}], key:'attachement'}]};
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
      results = { ecode: 0, data: { id: '546761', name: '主题', key:'title',type:'Text', description:'aaaaaaaa', defaultValue: '123qwe'}};
    } else if (id === '546763') {
      results = { ecode: 0, data: { id: '546763', name: '描述', key:'title',type:'TextArea', description:'aaaaaaaa', defaultValue: 'sfasfsaf'}};
    } else if (id === '546764') {
      results = { ecode: 0, data: { id: '546763', name: '描述', key:'title',type:'DatePicker', description:'aaaaaaaa', defaultValue: 'sfasfsaf'}};
    } else if (id === '2323') {
      results = { ecode: 0, data: { id: '546763', name: '描述', key:'title',type:'MultiSelect', optionValues:['111', '222', '333'], defaultValue: ['111', '222']}};
    } else {
      results = { ecode: 0, data: { id: '546762', name: '优先级', key:'priority', type:'Select', optionValues:['111', '222', '333'], defaultValue: '222'}};
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

  /************** screen *****************/
  router.get('/project/:key/screen', function(req, res) {
    const startTime = new Date().getTime();
    while (new Date().getTime() < startTime + 2000);
    const results = { ecode: 0, data: [
      { id: '546761', name: '测试界面1', workflows: [{id:'111', name:'流程A' }, {id:'222', name:'流程B'}]},
      { id: '546763', name: '测试界面2', workflows: [{id:'222', name:'流程B' }, {id:'333', name:'流程C'}]},
      { id: '546762', name: '测试界面3', workflows: [{id:'111', name:'流程A' }]},
      { id: '546764', name: '测试界面5', workflows: [{id:'111', name:'流程C' }]}],
      options:{ fields:[{id:'111',name:'字段A'},{id:'222', name:'字段2'}, {id:'333', name:'字段3'}, {id:'444', name:'字段4'}, {id:'555', name:'字段5'}]}
    };
    return res.status(200).send(results);
  });

  router.post('/project/:key/screen', function(req, res) {
    const results = { ecode: 0, data: { id: 'were', name: '测试界面4', description:'aaaaaaa' } };
    return res.status(200).send(results);
  });

  router.get('/project/:key/screen/:id', function(req, res) {
    const startTime = new Date().getTime();
    while (new Date().getTime() < startTime + 2000);
    const { id } = req.params;
    let results = {};
    if (id === '546761') {
      results = { ecode: 0, data: { id: '546761', name: '测试界面1', description:'aaaaaaaa', fields:[{id:'111', name:'字段A', required: true},{id:'222', name:'字段B'},{id:'333', name:'字段C'}]}};
    } else {
      results = { ecode: 0, data: { id: '546762', name: '测试界面2', description:'bbbbbb', fields:[{id:'111', name:'字段A'},{id:'222', name:'字段B', required: true},{id:'333', name:'字段C', required: true}]}};
    }
    return res.status(200).send(results);
  });

  router.put('/project/:key/screen/:id', function(req, res) {
    const startTime = new Date().getTime();
    while (new Date().getTime() < startTime + 2000);
    const results = { ecode: 0, data: { id: '546761', name: '测试界面11111', workflows: [{id:'111', name:'流程A' }, {id:'222', name:'流程B'}]}};
    return res.status(200).send(results);
  });

  router.delete('/project/:key/screen/:id', function(req, res) {
    const startTime = new Date().getTime();
    while (new Date().getTime() < startTime + 2000);
    const results = { ecode: 0, data: { id: req.params.id }};
    return res.status(200).send(results);
  });

  /************** workflow *****************/
  router.get('/project/:key/workflow', function(req, res) {
    const startTime = new Date().getTime();
    while (new Date().getTime() < startTime + 2000);
    const results = { ecode: 0, data: [
      { id: '546761', name: '测试流程1', latest_modify_time: 1465716065, latest_modifier: { id: '1111', name: '张三' }, step: 5 },
      { id: '546763', name: '测试流程2', latest_modify_time: 1465416065, latest_modifier: { id: '1111', name: '张三' }, step: 5 },
      { id: '546762', name: '测试流程3', latest_modify_time: 1465316065, latest_modifier: { id: '2222', name: '李四' }, step: 6 },
      { id: '546764', name: '测试流程5', latest_modify_time: 1465716005, latest_modifier: { id: '2222', name: '李四' }, step: 4 }]
    };
    return res.status(200).send(results);
  });

  router.post('/project/:key/workflow', function(req, res) {
    const results = { ecode: 0, data: { id: 'were', name: '测试界面4', description:'aaaaaaa' } };
    return res.status(200).send(results);
  });

  router.get('/project/:key/workflow/:id', function(req, res) {
    const startTime = new Date().getTime();
    while (new Date().getTime() < startTime + 2000);
    const { id } = req.params;
    let results = {};
    if (id === '546761') {
      results = { ecode: 0, data: { id: '546761', name: '测试界面1', description:'aaaaaaaa', fields:[{id:'111', name:'字段A', required: true},{id:'222', name:'字段B'},{id:'333', name:'字段C'}]}};
    } else {
      results = { ecode: 0, data: { id: '546762', name: '测试界面2', description:'bbbbbb', fields:[{id:'111', name:'字段A'},{id:'222', name:'字段B', required: true},{id:'333', name:'字段C', required: true}]}};
    }
    return res.status(200).send(results);
  });

  router.put('/project/:key/workflow/:id', function(req, res) {
    const startTime = new Date().getTime();
    while (new Date().getTime() < startTime + 2000);
    const results = { ecode: 0, data: { id: '546761', name: '测试界面11111', workflows: [{id:'111', name:'流程A' }, {id:'222', name:'流程B'}]}};
    return res.status(200).send(results);
  });

  router.delete('/project/:key/workflow/:id', function(req, res) {
    const startTime = new Date().getTime();
    while (new Date().getTime() < startTime + 2000);
    const results = { ecode: 0, data: { id: req.params.id }};
    return res.status(200).send(results);
  });


  /*******************state*****************/
  router.get('/project/:key/state', function(req, res) {
    const startTime = new Date().getTime();
    while (new Date().getTime() < startTime + 2000);
    const results = { ecode: 0, data: [{ id: '546761', name: '开发中', description: 'aaaaaaaaaaa'},{ id: '546763', name: '待测试', description: 'aaaaaaaaaaa', default: true },{ id: '546762', name: '已发布' },{ id: '2323', name: '已关闭', description: 'ddddddddddd' }]};
    return res.status(200).send(results);
  });

  router.post('/project/:key/state', function(req, res) {
    const results = { ecode: 0, data: { id: 'were', name: '5C问题', screen: {id:'222', name:'界面2'}, workflow:{id:'111', name:'流程1'}} };
    return res.status(200).send(results);
  });

  router.get('/project/:key/state/:id', function(req, res) {
    const startTime = new Date().getTime();
    while (new Date().getTime() < startTime + 2000);
    const { id } = req.params;
    let results = {};
    if (id === '546761') {
      results = { ecode: 0, data: { id: '546761', name:'开发中', description: '111aaa'}};
    } else {
      results = { ecode: 0, data: { id: '546762', name: '待测试', description: 'adsfs'}};
    }
    return res.status(200).send(results);
  });

  router.put('/project/:key/state/:id', function(req, res) {
    const startTime = new Date().getTime();
    while (new Date().getTime() < startTime + 2000);
    const results = { ecode: 0, data: { id: '546761', name: '任务1111', screen:{id:'222', name:'界面2'}, workflow:{id:'222', name:'流程2'}}};
    return res.status(200).send(results);
  });

  router.put('/project/:key/state', function(req, res) {
    const startTime = new Date().getTime();
    while (new Date().getTime() < startTime + 2000);
    const results = { ecode: 0, data: [{ id: '546763', name: '需求', screen: {id:'222', name:'界面2'}, workflow:{id:'111', name:'流程2'}},{ id: '546761', name: '任务', screen: {id:'111', name:'界面1'}, workflow:{id:'111', name:'流程1'}},{ id: '546762', name: '缺陷', screen: {id:'111', name:'界面1'}, workflow:{id:'111', name:'流程1'}},{ id: '2323', name: '子任务', screen: {id:'111', name:'界面1'}, workflow:{id:'222', name:'流程2'}}] };
    return res.status(200).send(results);
  });

  router.delete('/project/:key/state/:id', function(req, res) {
    const startTime = new Date().getTime();
    while (new Date().getTime() < startTime + 2000);
    const results = { ecode: 0, data: { id: req.params.id }};
    return res.status(200).send(results);
  });

  /*******************result*****************/
  router.get('/project/:key/result', function(req, res) {
    const startTime = new Date().getTime();
    while (new Date().getTime() < startTime + 2000);
    const results = { ecode: 0, data: [{ id: '546761', name: '开发中', description: 'aaaaaaaaaaa'},{ id: '546763', name: '待测试', description: 'aaaaaaaaaaa', default: true },{ id: '546762', name: '已发布' },{ id: '2323', name: '已关闭', description: 'ddddddddddd' }]};
    return res.status(200).send(results);
  });

  router.post('/project/:key/result', function(req, res) {
    const results = { ecode: 0, data: { id: 'were', name: '5C问题', screen: {id:'222', name:'界面2'}, workflow:{id:'111', name:'流程1'}} };
    return res.status(200).send(results);
  });

  router.get('/project/:key/result/:id', function(req, res) {
    const startTime = new Date().getTime();
    while (new Date().getTime() < startTime + 2000);
    const { id } = req.params;
    let results = {};
    if (id === '546761') {
      results = { ecode: 0, data: { id: '546761', name:'开发中', description: '111aaa'}};
    } else {
      results = { ecode: 0, data: { id: '546762', name: '待测试', description: 'adsfs'}};
    }
    return res.status(200).send(results);
  });

  router.put('/project/:key/result/:id', function(req, res) {
    const startTime = new Date().getTime();
    while (new Date().getTime() < startTime + 2000);
    const results = { ecode: 0, data: { id: '546761', name: '任务1111', screen:{id:'222', name:'界面2'}, workflow:{id:'222', name:'流程2'}}};
    return res.status(200).send(results);
  });

  router.put('/project/:key/result', function(req, res) {
    const startTime = new Date().getTime();
    while (new Date().getTime() < startTime + 2000);
    const results = { ecode: 0, data: [{ id: '546763', name: '需求', screen: {id:'222', name:'界面2'}, workflow:{id:'111', name:'流程2'}},{ id: '546761', name: '任务', screen: {id:'111', name:'界面1'}, workflow:{id:'111', name:'流程1'}},{ id: '546762', name: '缺陷', screen: {id:'111', name:'界面1'}, workflow:{id:'111', name:'流程1'}},{ id: '2323', name: '子任务', screen: {id:'111', name:'界面1'}, workflow:{id:'222', name:'流程2'}}] };
    return res.status(200).send(results);
  });

  router.delete('/project/:key/result/:id', function(req, res) {
    const startTime = new Date().getTime();
    while (new Date().getTime() < startTime + 2000);
    const results = { ecode: 0, data: { id: req.params.id }};
    return res.status(200).send(results);
  });

  /*******************priority*****************/
  router.get('/project/:key/priority', function(req, res) {
    const startTime = new Date().getTime();
    while (new Date().getTime() < startTime + 2000);
    const results = { ecode: 0, data: [{ id: '546761', name: '开发中', description: 'aaaaaaaaaaa'},{ id: '546763', name: '待测试', description: 'aaaaaaaaaaa', default: true },{ id: '546762', name: '已发布' },{ id: '2323', name: '已关闭', description: 'ddddddddddd' }]};
    return res.status(200).send(results);
  });

  router.post('/project/:key/priority', function(req, res) {
    const results = { ecode: 0, data: { id: 'were', name: '5C问题', screen: {id:'222', name:'界面2'}, workflow:{id:'111', name:'流程1'}} };
    return res.status(200).send(results);
  });

  router.get('/project/:key/priority/:id', function(req, res) {
    const startTime = new Date().getTime();
    while (new Date().getTime() < startTime + 2000);
    const { id } = req.params;
    let results = {};
    if (id === '546761') {
      results = { ecode: 0, data: { id: '546761', name:'开发中', description: '111aaa'}};
    } else {
      results = { ecode: 0, data: { id: '546762', name: '待测试', description: 'adsfs'}};
    }
    return res.status(200).send(results);
  });

  router.put('/project/:key/priority/:id', function(req, res) {
    const startTime = new Date().getTime();
    while (new Date().getTime() < startTime + 2000);
    const results = { ecode: 0, data: { id: '546761', name: '任务1111', screen:{id:'222', name:'界面2'}, workflow:{id:'222', name:'流程2'}}};
    return res.status(200).send(results);
  });

  router.put('/project/:key/priority', function(req, res) {
    const startTime = new Date().getTime();
    while (new Date().getTime() < startTime + 2000);
    const results = { ecode: 0, data: [{ id: '546763', name: '需求', screen: {id:'222', name:'界面2'}, workflow:{id:'111', name:'流程2'}},{ id: '546761', name: '任务', screen: {id:'111', name:'界面1'}, workflow:{id:'111', name:'流程1'}},{ id: '546762', name: '缺陷', screen: {id:'111', name:'界面1'}, workflow:{id:'111', name:'流程1'}},{ id: '2323', name: '子任务', screen: {id:'111', name:'界面1'}, workflow:{id:'222', name:'流程2'}}] };
    return res.status(200).send(results);
  });

  router.delete('/project/:key/priority/:id', function(req, res) {
    const startTime = new Date().getTime();
    while (new Date().getTime() < startTime + 2000);
    const results = { ecode: 0, data: { id: req.params.id }};
    return res.status(200).send(results);
  });

  /*******************permission*****************/
  router.get('/project/:key/role', function(req, res) {
    const startTime = new Date().getTime();
    while (new Date().getTime() < startTime + 2000);
    const results = { ecode: 0, data: [{ id: '546761', role: '项目经理', description: '111aaa', permissions:[ 'createIssue', 'viewWorkflow'] }, { id: '546762', role: '产品经理', permissions:['createIssue', 'projectConfig'] }], options:{ permissions: [{ id: 'createIssue', name: '创建问题'}, { id: 'viewWorkflow', name: '查看流程'}, { id: 'projectConfig', name: '项目配置'}, { id: 'deleteComments', name: '删除评论'}] }};
    return res.status(200).send(results);
  });

  router.post('/project/:key/role', function(req, res) {
    const results = { ecode: 0, data: { id: 'were', name: '5C问题', screen: {id:'222', name:'界面2'}, workflow:{id:'111', name:'流程1'}} };
    return res.status(200).send(results);
  });

  router.get('/project/:key/role/:id', function(req, res) {
    const startTime = new Date().getTime();
    while (new Date().getTime() < startTime + 2000);
    const { id } = req.params;
    let results = {};
    if (id === '546761') {
      results = { ecode: 0, data: { id: '546761', role:'项目经理', description: '111aaa', permissions:['createIssue', 'projectConfig']}};
    } else {
      results = { ecode: 0, data: { id: '546762', role: '产品经理', description: 'adsfs', permissions:['createIssue', 'viewWorkflow']}};
    }
    return res.status(200).send(results);
  });

  router.put('/project/:key/role/:id', function(req, res) {
    const startTime = new Date().getTime();
    while (new Date().getTime() < startTime + 2000);
    const results = { ecode: 0, data: { id: '546761', name: '任务1111', screen:{id:'222', name:'界面2'}, workflow:{id:'222', name:'流程2'}}};
    return res.status(200).send(results);
  });

  router.put('/project/:key/role', function(req, res) {
    const startTime = new Date().getTime();
    while (new Date().getTime() < startTime + 2000);
    const results = { ecode: 0, data: [{ id: '546763', name: '需求', screen: {id:'222', name:'界面2'}, workflow:{id:'111', name:'流程2'}},{ id: '546761', name: '任务', screen: {id:'111', name:'界面1'}, workflow:{id:'111', name:'流程1'}},{ id: '546762', name: '缺陷', screen: {id:'111', name:'界面1'}, workflow:{id:'111', name:'流程1'}},{ id: '2323', name: '子任务', screen: {id:'111', name:'界面1'}, workflow:{id:'222', name:'流程2'}}] };
    return res.status(200).send(results);
  });

  router.delete('/project/:key/role/:id', function(req, res) {
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
