import path from 'path';
import { readFile } from 'fs-promise';
import debug from 'debug';

import marked from 'marked';

import { users } from './data.json';

const simplifyUsers = (collection) => collection
  .map(({ user, seed }) => ({ ...user, seed }))
  .map(({ name, seed, picture }) => ({ name, seed, picture }));

export default function(router) {

  router.get('/admin/syssetting', function(req, res) {
    const startTime = new Date().getTime();
    while (new Date().getTime() < startTime + 2000);
    const results = { ecode: 0, data: { properties: { allowed_login_num: 3, login_mail_domain: 'chinamobile.com', week2day: 5, day2hour: 8 }, smtp: { ip: '10.2.5.34', port: 25, send_addr: 'actionview@chinamobile.com', auth_pwd: '111' }, sysroles: { sys_admin: [ { id: 'nhy67ujm', email:'liuxuyjy@chinamobile.com', name: 'liuxu' }, { id: 'nhy67ujm2', email:'liuxuyjy@chinamobile.com', name: 'liuxuaaaa' } ] } } };
    return res.status(200).send(results);
  });

  router.post('/admin/syssetting', function(req, res) {
    const startTime = new Date().getTime();
    while (new Date().getTime() < startTime + 2000);                                                                               const results = { ecode: 0, data: { properties: { allowed_login_num: 5, mail_domain: 'chinamobile.com' }, timetrack: { week2day: 6, day2hour: 7 }, smtp: { ip: '10.2.5.34', port: 25, account: 'actionview@chinamobile.com' }, permissions: { } } };
    return res.status(200).send(results);
  });

  router.post('/mysetting/notify', function(req, res) {
    const startTime = new Date().getTime();
    while (new Date().getTime() < startTime + 2000);
    const results = { ecode: 0, data: { mail_notify: true, mobile_notify: true } };
    return res.status(200).send(results);
  });

  router.get('/mysetting', function(req, res) {
    const startTime = new Date().getTime();
    while (new Date().getTime() < startTime + 2000);
    const results = { ecode: 0, data: { accounts: { avatar: '', name: '刘旭研究院', email: 'liuxuyjy@chinamobile.com', department: '科技管理部', phone: 13811450899}, notifications: { mail_notify: true, mobile_notify: true, daily_notify: false, monthly_notify: false }, favorites: { language: 'chinese' } } };
    return res.status(200).send(results);
  });

  router.get('/scheme', function(req, res) {
    const startTime = new Date().getTime();
    while (new Date().getTime() < startTime + 2000);
    const results = { ecode: 0, data: [{ id: '546761', name: '软件开发类', description: 'aaaaaaaaaaa'},{ id: '546763', name: '市场供求类', description: 'aaaaaaaaaaa', disabled: false },{ id: '546762', name: '跟哥哥哥哥', disabled: true }]};
    return res.status(200).send(results);
  });

  router.get('/user/:id/renewpwd', function(req, res) {
    const startTime = new Date().getTime();
    while (new Date().getTime() < startTime + 2000);
    const results = { ecode: 0, data: '' };
    return res.status(200).send(results);
  });

  router.get('/user/resetpwd', function(req, res) {
    const startTime = new Date().getTime(); 
    while (new Date().getTime() < startTime + 2000);
    const results = { ecode: 0, data: '' };
    return res.status(200).send(results);
  });

  router.post('/user', function(req, res) {
    const startTime = new Date().getTime(); 
    while (new Date().getTime() < startTime + 2000);
    const results = { ecode: 0, data: '' };
    return res.status(200).send(results);
  });

  router.get('/user', function(req, res) {
    const startTime = new Date().getTime(); 
    while (new Date().getTime() < startTime + 2000);
    const results = { ecode: 0, data: [{ id: '1111', name: '刘旭111', email: 'liuxu@chinamobile.com', phone: 13811450899, groups:['aa', 'bb'], status: 'active'}, {id: '111122', name: '刘旭111',email: 'liuxu@chinamobile.com', phone: 13811450899, status: 'active'},  { id: '111111', name: '刘旭11331',email: 'liuxu@chinamobile.com', phone: 13811450899, status: 'active'}, { id: '11133111', name: '刘旭111333', email: 'liuxu@chinamobile.com', phone: 13811450899, status: 'closed'} ], options: { groups: [{id:'111', name:'111'}, {id:'222', name:'222'}] } };
    return res.status(200).send(results);
  });

  router.get('/user/search', function(req, res) {
    const startTime = new Date().getTime();
    while (new Date().getTime() < startTime + 2000);
    const results = { ecode: 0, data: [{ id: '1111', name: '刘旭111', email: 'liuxu@chinamobile.com', phone: 13811450899, status: 'active'}, {id: '111122', name: '刘旭111',email: 'liuxu@chinamobile.com', phone: 13811450899, status: 'active'},  { id: '111111', name: '刘旭11331',email: 'liuxu@chinamobile.com', phone: 13811450899, status: 'active'}, { id: '11133111', name: '刘旭111333', email: 'liuxu@chinamobile.com', phone: 13811450899, status: 'closed'} ] };
    return res.status(200).send(results);
  });

  router.get('/group/search', function(req, res) {
    const startTime = new Date().getTime();
    while (new Date().getTime() < startTime + 2000);
    const results = { ecode: 0, data: [{ id: '1111', name: '111' }, {id: '111122', name: '刘旭111'},  { id: '111111', name: '刘旭11331'}, { id: '11133111', name: '刘旭111333'} ] };
    return res.status(200).send(results);
  });

  router.get('/group', function(req, res) {
    const startTime = new Date().getTime();
    while (new Date().getTime() < startTime + 2000);
    const results = { ecode: 0, data: [{ id: '1111', name: '刘旭111', users:['aa', 'bb']}, {id: '111122', name: '刘旭111',  users:[ { id: 'aa', name : 'aa' } , { id: 'bb', name: 'bb'}, { id: 'cc', name: 'cc' } ]},  { id: '111111', name: '刘旭11331', description: '111111111111111111', users:['aa', 'bb', 'cc', 'dd']}, { id: '11133111', name: '刘旭111333' }], options: { total: 4 }};
    return res.status(200).send(results);
  });

  router.delete('/group/:id', function(req, res) {
    const startTime = new Date().getTime();
    while (new Date().getTime() < startTime + 2000);
    const results = { ecode: 0, data: { id: req.params.id }};
    return res.status(200).send(results);
  });

  router.get('/myproject', function(req, res) {
    const startTime = new Date().getTime(); 
    while (new Date().getTime() < startTime + 2000);
    const results = { ecode: 0, data: [{ id: '1111', status: 'active', name: '社交化项目管理系统', description: 'aaaabbbbccc测试测试测试测试测试测试测测试时测试测试测试测试测试测试', key: 'SPMS', creator: '卢红兵', create_time: 144444, principal: { id: 'nhy67ujm', nameAndEmail:'liuxu@aa.com', name: '刘旭' } },{ id: '2222', name: '企业安全网盘', key: 'WEBDISK', creator: '王仕喜', create_time: 144444, principal: { id: 'zzz', name: '刘旭' } },{ id: '3333', name: '社交化项目管理系统', key: 'SPMS', creator: '卢红兵', create_time: 144444, principal: { id: 'zzz', name: '刘旭' } },{ id: '4444', name: '企业安全网盘', key: 'WEBDISK', creator: '王仕喜', create_time: 144444, principal: { id: 'zzz', name: '王世喜' }}] };
    return res.status(200).send(results);
  });

  router.get('/project/recent', function(req, res) {
    const startTime = new Date().getTime();
    while (new Date().getTime() < startTime + 2000);
    const results = { ecode: 0, data: [{ id: '546761', name: '社交化项目管理系统', key: 'SPMS', creator: '卢红兵', create_time: 144444 },{ id: '54676i2', name: '企业安全网盘', key: 'WEBDISK', creator: '王仕喜', create_time: 144444 },{ id: '5s46761', name: '社交化项目管理系统', key: 'SPMS', creator: '卢红兵', create_time: 144444 },{ id: '54r676i2', name: '企业安全网盘', key: 'WEBDISK', creator: '王仕喜', create_time: 144444 },{ id: '5i46761', name: '社交化项目管理系统', key: 'SPMS', creator: '卢红兵', create_time: 144444 },{ id: '54aa676i2', name: '企业安全网盘', key: 'WEBDISK', creator: '王仕喜', create_time: 144444 },{ id: '54bgg6761', name: '社交化项目管理系统', key: 'SPMS', creator: '卢红兵', create_time: 144444 }], options: { 'total': 8 } };
    return res.status(200).send(results);
  });

  router.get('/project', function(req, res) {
    const startTime = new Date().getTime(); 
    while (new Date().getTime() < startTime + 2000);
    const results = { ecode: 0, data: [{ id: '546761', name: '社交化项目管理系统', key: 'SPMS', creator: '卢红兵', create_time: 144444 },{ id: '54676i2', name: '企业安全网盘', key: 'WEBDISK', creator: '王仕喜', create_time: 144444 },{ id: '5s46761', name: '社交化项目管理系统', key: 'SPMS', creator: '卢红兵', create_time: 144444 },{ id: '54r676i2', name: '企业安全网盘', key: 'WEBDISK', creator: '王仕喜', create_time: 144444 },{ id: '5i46761', name: '社交化项目管理系统', key: 'SPMS', creator: '卢红兵', create_time: 144444 },{ id: '54aa676i2', name: '企业安全网盘', key: 'WEBDISK', creator: '王仕喜', create_time: 144444 },{ id: '54bgg6761', name: '社交化项目管理系统', key: 'SPMS', creator: '卢红兵', create_time: 144444 }], options: { 'total': 8 } };

    return res.status(200).send(results);
  });

  router.get('/project/options', function(req, res) {
    const startTime = new Date().getTime();
    while (new Date().getTime() < startTime + 2000);
    const results = { ecode:0, data: { principals: [{ id: '111', name: '1111', email: 'aa@aa.aa' }, { id: '222', name: '2222', email: 'aa@aa.aa' }, { id: '333', name: '3333', email: 'aa@aa.aa' }, { id: '444', name: '4444', email: 'aa@aa.aa' } ]} };
    return res.status(200).send(results);
  });

  router.get('/project/checkkey/:key', function(req, res) {
    const startTime = new Date().getTime(); 
    while (new Date().getTime() < startTime + 2000);
    const results = { ecode: 0, data: { flag : 1 } };
    return res.status(200).send(results);
  });

  router.get('/project/:key', function(req, res) {
    const results = { ecode: 0, data: { id: '546761', name: '播吧', key: 'BOBA', principal: { id:'xxx', name: '刘旭' }, creator: '刘旭', create_time: 144444 }, options: { permissions: [ 'manage_project', 'create_issue', 'edit_issue', 'exec_workflow', 'link_issue', 'view_project', 'download_file', 'remove_file' ] }};
    return res.status(200).send(results);
  });

  router.get('/project/:key/summary', function(req, res) {
    const startTime = new Date().getTime(); 
    while (new Date().getTime() < startTime + 2000);
    const results = {"ecode":0,"data":{"new_issues":{percent:30,"total":182,"580314351d41c82c7204e82c":16,"5803140b1d41c8689559abe4":81,"5803141b1d41c863de053625":75,"58898c1e1d41c844577ee642":9,"588be9be1d41c84f294a86e2":1},"closed_issues":{percent: 0,"total":6,"5803141b1d41c863de053625":5,"5803140b1d41c8689559abe4":1},"assignee_unresolved_issues":{"57afced21d41c8174d7421c1":{"percent": 80,"5803140b1d41c8689559abe4":33,"total":44,"5803141b1d41c863de053625":8,"58898c1e1d41c844577ee642":3},"57afcef01d41c817500aed73":{"percent": 10,"5803141b1d41c863de053625":1,"total":1},"58f1d7751d41c86e296e75ea":{"percent": 90,"5803141b1d41c863de053625":1,"total":1},"57b12aee1d41c817500aed75":{"percent": 5,"5803140b1d41c8689559abe4":1,"total":1},"57b12a801d41c819135a6c93":{"percent": 10,"58898c1e1d41c844577ee642":1,"total":1}},"priority_unresolved_issues":{"57a97fdd1d41c848b53bc166":{"5803140b1d41c8689559abe4":19,"total":26,"5803141b1d41c863de053625":7, percent: 35},"Major":{"5803140b1d41c8689559abe4":14,"total":21,"58898c1e1d41c844577ee642":4,"5803141b1d41c863de053625":3, percent: 50},"Blocker":{"5803140b1d41c8689559abe4":1,"total":1, percent: 19},"Critical":{"5803140b1d41c8689559abe4":1,"total":1, percent: 5}}},"options":{"types":[{"abb":"T","created_at":"2016-10-16 13:45:47","default":true,"disabled":false,"name":"\u4efb\u52a1","project_key":"boba","screen_id":"58ddfc5f1d41c82c6b16f42f","sn":1,"updated_at":"2017-03-31 21:47:21","workflow_id":"58dc8d9f1d41c828264c7bd3","id":"5803140b1d41c8689559abe4"},{"abb":"F","created_at":"2016-10-16 13:46:29","description":"","disabled":false,"name":"\u65b0\u529f\u80fd","project_key":"boba","screen_id":"58ddfc5f1d41c82c6b16f42f","sn":2,"type":"standard","updated_at":"2017-03-31 21:47:11","workflow_id":"58dc8d9f1d41c828264c7bd3","id":"580314351d41c82c7204e82c"},{"abb":"B","created_at":"2016-10-16 13:46:03","disabled":false,"name":"\u7f3a\u9677","project_key":"boba","screen_id":"58ddfc5f1d41c82c6b16f42f","sn":3,"updated_at":"2017-03-31 21:46:06","workflow_id":"58dc8d9f1d41c828264c7bd3","id":"5803141b1d41c863de053625"},{"abb":"I","created_at":"2017-03-31 21:46:51","name":"\u6539\u8fdb","project_key":"boba","screen_id":"58ddfc5f1d41c82c6b16f42f","sn":4,"updated_at":"2017-03-31 21:47:11","workflow_id":"58dc8d9f1d41c828264c7bd3","id":"58de5dcb1d41c82c6b16f43b"},{"abb":"S","created_at":"2017-01-26 13:41:50","description":"","disabled":true,"name":"\u5b50\u4efb\u52a1","project_key":"boba","screen_id":"58ddfc5f1d41c82c6b16f42f","sn":5,"type":"subtask","updated_at":"2017-05-20 21:16:14","workflow_id":"58dc8d9f1d41c828264c7bd3","id":"58898c1e1d41c844577ee642"}],"users":{"57afced21d41c8174d7421c1":"\u5218\u65ed","57afcef01d41c817500aed73":"\u4faf\u742a","58f1d7751d41c86e296e75ea":"\u9ad8\u8fc7\u672a","57b12aee1d41c817500aed75":"\u5218\u65ed\u4e1c","57b12a801d41c819135a6c93":"\u674e\u6bbf\u519b"},"priorities":{"Blocker":"\u81f4\u547d","Critical":"\u4e25\u91cd","Major":"\u91cd\u8981","Minor":"\u8f7b\u5fae","Trivial":"\u5fae\u5c0f"},"weekAgo":"2015\/06\/22"}}; 
    return res.status(200).send(results);
  });

  router.post('/project', function(req, res) {
    const startTime = new Date().getTime(); 
    while (new Date().getTime() < startTime + 2000);
    const results = { ecode: 0, data: { id: '546761', name: '播吧', key: 'BOBA', principal: { id: 'zzz', name: '王世喜' }, creator: '刘旭', create_time: 144444 }};
    return res.status(200).send(results);
  });

  router.put('/project/:id', function(req, res) {
    const startTime = new Date().getTime();
    while (new Date().getTime() < startTime + 2000);
    const results = { ecode: 0, data: { id: '546761', name: '播吧', key: 'BOBA', principal: { id: 'zzz', name: '王世喜' }, creator: '刘旭', create_time: 144444 }};
    return res.status(200).send(results);
  });

  router.get('/project/:key/config', function(req, res) {
    const startTime = new Date().getTime();
    while (new Date().getTime() < startTime + 2000);
    const results = { ecode: 0, data: { types: [{ id: '546761', abb:'T', name: '任务', description:'bbbbb', screen_id:'111', workflow_id:'111', 'screen': { name: 'aaa', schema: [{"key":"title","name":"\u4e3b\u9898","type":"Text","required":true,"id":"580039521d41c81fdf499353"}] } },{ id: '546763', name: '需求', abb:'D', screen_id:'222', workflow_id:'111', default: true },{ id: '546762', abb: 'C', name: '缺陷', screen_id:'111', workflow_id:'111'},{ id: '2323', abb:'S', name: '子任务', screen_id:'111', workflow_id:'222'}]}};
    return res.status(200).send(results);
  });

  router.get('/project/:key/type', function(req, res) {
    const startTime = new Date().getTime();
    while (new Date().getTime() < startTime + 2000);
    const results = { ecode: 0, data: [{ id: '546761', abb:'T', name: '任务', description:'bbbbb', screen_id:'111', workflow_id:'111'},{ id: '546763', name: '需求', abb:'D', screen_id:'222', workflow_id:'111', default: true },{ id: '546762', abb: 'C', name: '缺陷', screen_id:'111', workflow_id:'111'},{ id: '2323', abb:'S', name: '子任务', screen_id:'111', workflow_id:'222'}], options:{ screens:[{id:'111',name:'界面1'},{id:'222', name:'界面2'}, {id:'333', name:'界面3'}], workflows:[{id:'111',name:'流程1'},{id:'222', name:'流程2'}, {id:'333', name:'流程3'}] }};
    return res.status(200).send(results);
  });

  router.get('/project/:key/module', function(req, res) {
    const startTime = new Date().getTime();
    while (new Date().getTime() < startTime + 2000);
    const results = { ecode: 0, data: [{ id: '546761', name: '任务', description:'bbbbb', principal_id:'111', defaultAssignee_id:'111'},{ id: '546763', name: '需求', principal_id:'222', defaultAssignee_id:'111', default: true },{ id: '546762', name: '缺陷', principal_id:'111', defaultAssignee_id:'111'},{ id: '2323', name: '子任务'}], options:{ users: [{ id: '111', name:'刘旭', email:'liuxuyjy@chinamobile.com' }, { id: '222', name:'葛鹏', email: 'gepeng@chinamobile.com' }] }};
    return res.status(200).send(results);
  });

  router.get('/project/:key/version', function(req, res) {
    const startTime = new Date().getTime();
    while (new Date().getTime() < startTime + 2000);
    const results = { ecode: 0, data: [{ id: '546761', name: '任务', description:'bbbbb', start_time:1474642399, end_time:1474646399},{ id: '546763', name: '需求', start_time:1474546399, end_time:1474646499 },{ id: '546762', name: '缺陷', start_time:1474646399, end_time:1474646399},{ id: '2323', name: '子任务'}] };
    return res.status(200).send(results);
  });

  router.get('/project/:key/issue', function(req, res) {
    const startTime = new Date().getTime();
    while (new Date().getTime() < startTime + 2000);
    const results = { ecode: 0, options: { 'total': 8 }, data: [{ no:1555, id: '546761', type:'1111', title: '国拨类型的项目添加任务中责任人没有必选*号', description:'bbbbb', priority:'1111', state:'546761', creator: {id:'aaa', name:'刘旭（研究院）'}, created_at: '2016-08-15T14:01:52.683Z', rank: 100 },{ no:9999, id: '546763', type:'1111', title: 'osn首页“项目周月报”未填写的本月月报显示为本月待填', assignee:{id:'aaa', name:'刘旭（研究院）'}, priority:'2222', state:'546761', created_at: '2016-08-15T14:01:52.683Z', rank: 98 },{ no:3, id: '546762', type:'2222', assignee: {id:'xxxx', name:'liuxu'}, title: 'OSN首页右上角新建报工窗口，提交成功后窗口关闭没有提示信息', priority:'3333', state:'546762', creator: {id:'aaa', name:'刘旭（研究院）'}, created_at: '2016-08-15T14:01:52.683Z', rank: 49},{ no:4, id: '2323', title: 'OSN首页-我的日程起止时间，第一行和第二行字体大小相同' , created_at: '2016-08-15T14:01:52.683Z', rank: 88 },{ no:1, id: '5426761', type:'1111', title: '国拨类型的项目添加任务中责任人没有必选*号', description:'bbbbb', priority:'1111', state:'546763', creator: {id:'aaa', name:'刘旭（研究院）'}, created_at: '2016-08-15T14:01:52.683Z', rank: 21 },{ no:2, id: '5462763', type:'1111', title: 'osn首页“项目周月报”未填写的本月月报显示为本月待填', assignee:{id:'aaa', name:'刘旭（研究院）'}, priority:'2222', state:'546762', created_at: '2016-08-15T14:01:52.683Z', rank: 35 },{ no:365, id: '5467621', type:'2222', assignee: {id:'xxxx', name:'liuxu'}, title: 'OSN首页右上角新建报工窗口，提交成功后窗口关闭没有提示信息', priority:'3333', state:'546761', creator: {id:'aaa', name:'刘旭（研究院）'}, created_at: '2016-08-15T14:01:52.683Z', rank: 23},{ no:8, type: '1111', id: '22323', title: 'OSN首页-我的日程起止时间，第一行和第二行字体大小相同' , created_at: '2016-08-15T14:01:52.683Z', priority:'1111', state: '546762', parent: { no: 2, title: 'tttt', id: '5462763', state: '546762' }, rank : 100}, { no:7, type: '1111', id: '2232dd3', title: 'OSN首页-我>的日程起止时间，第一行和第二行字体大小相同' , created_at: '2016-08-15T14:01:52.683Z', priority:'1111', state: '546762', parent: { no: 2, title: 'tttt', id: '5462763', state: '546762' }, rank : 100}] };
    return res.status(200).send(results);
  });

  router.get('/project/:key/issue/search', function(req, res) {
    const startTime = new Date().getTime();
    while (new Date().getTime() < startTime + 2000);
    const results = {ecode: 0, data:[{id:'1111', title:'aaaa', no:111, type:'2222'}, {id:'2222', title:'bbbb', no:222, type:'2222'}, {id:'3333', title:'cccc', no:333, type:'2222'}]};
    return res.status(200).send(results);
  }); 

  router.get('/project/:key/issue/:id/wfactions', function(req, res) {
    const startTime = new Date().getTime();
    while (new Date().getTime() < startTime + 200);
    const results = { ecode: 0, data: [{ id: 1001, name: 'aa', state: '546761' }, { id: 1002, name: 'bb', state: '546762' } ]};
    return res.status(200).send(results);
  });

  router.get('/project/:key/issue/:id/worklog', function(req, res) {
    const startTime = new Date().getTime();
    while (new Date().getTime() < startTime + 2000);
    const results = { ecode: 0, data: [{ id: '1111', started_at: 1478414469, adjust_type: '1', spend: '3d 4h', comments: '1111111', recorder: {id:'aaa', name:'刘旭（研究院）'}, recorded_at: 1478414469 }, { id: '2222', started_at: 1478414469, adjust_type: '2', spend: '6h', comments: '2222222', recorder: {id:'aaa', name:'刘旭（研究院）'}, recorded_at: 1478414469 }, { id: '3333', started_at: 1478414469, adjust_type: 1, spend: '3d 4h 5m', comments: '333333',recorder: {id:'aaa', name:'刘旭（研究院）'}, recorded_at: 1478414469 }] };
    return res.status(200).send(results);
  });

  router.post('/project/:key/issue/:id/worklog', function(req, res) {
    const startTime = new Date().getTime();
    while (new Date().getTime() < startTime + 2000);
    const results = { ecode: 0, data: { id: '4444', started_at: 1478414469, adjust_type: 1, spend: '3h', comments: '1111111' } };
    return res.status(200).send(results);
  });

  router.put('/project/:key/issue/:id/worklog/:worklog_id', function(req, res) {
    const startTime = new Date().getTime();
    while (new Date().getTime() < startTime + 2000);
    const results = { ecode: 0, data: { id: '3333', started_at: 1478414469, adjust_type: 1, spend: '3h', comments: '1111111' } };
    return res.status(200).send(results);
  });

  router.put('/project/:key/issue/:id/worklog/:worklog_id', function(req, res) {
    const startTime = new Date().getTime();
    while (new Date().getTime() < startTime + 2000);
    const results = { ecode: 0, data: { id: '3333' } };
    return res.status(200).send(results);
  });

  router.get('/project/:key/issue/:id/history', function(req, res) {
    const startTime = new Date().getTime();
    while (new Date().getTime() < startTime + 2000);
    const results = { ecode: 0, data: [{ operator: { id: '1111', name: '刘旭', email: 'bbb' }, operated_at: 1478414469, operation: 'modify',items: [ { field: '优先级', before: 'aa', after: 'bb' }, { field: '优先级', before: 'aa', after: 'bb'}, { field: '优先级', before: 'aa', after: 'bb'} ] }, { operator: { id: '1111', name: '刘旭', email: 'tttt' }, operated_at: 1478415479, operation: 'modify',items: [ { field: '优先级', before: 'aa', after: 'bb' }, { field: '优先级22', before: 'aa', after: 'bb'}, { field: '优先级3', before: 'aa', after: 'bb'} ] }, { operator: { id: '1111', name: '刘旭' }, operated_at: 1478415469, operation: 'new' }] };
    return res.status(200).send(results);
  });

  router.get('/project/:key/issue/:id/comments', function(req, res) {
    const startTime = new Date().getTime();
    while (new Date().getTime() < startTime + 2000);
    const results = { ecode: 0, data: [{ id: '1111', contents: 'aaaaaa', creator: {id:'aaa', name:'刘旭（研究院）'}, created_at: 1478415469, edited_flag : 1 }, {id: '2222', contents: '@刘旭 bbbb\r\nbbbb', atWho: [ {id: '111', name: '刘旭', email: 'liuxuyjy@chinamobile.com'} ], creator: {id:'aaa', name:'刘旭（研究院）'}, created_at: 1478415469, reply: [ { id: '111', to: { id: '111', name: '刘旭', email: 'liuxuyjy@chinamobile.com' }, contents: '测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试>测试测试测试', created_at: 1478415469, updated_at: 1478415469, creator: {id: '111', name: '刘旭', email: 'liuxuyjy@chinamobile.com'} }, {id: '2222', contents: '测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试>测试测试测试', created_at: 1478415469, updated_at: 1478415469, creator: {id: '111', name: '刘旭', email: 'liuxuyjy@chinamobile.com'} } ] }, {id: '3333', contents: 'aaaaaa', creator: {id:'aaa', name:'刘旭（研究院）'}, created_at: 1478415469}] }; 
    return res.status(200).send(results);
  });

  router.post('/project/:key/issue/:id/comments', function(req, res) {
    const startTime = new Date().getTime();
    while (new Date().getTime() < startTime + 2000);
    const results = { ecode: 0, data: { id: '5555', contents: 'ttttttt', creator: {id:'aaa', name:'刘旭（研究院）'}, created_at: 1478415469 } };
    return res.status(200).send(results);
  });

  router.delete('/project/:key/issue/:id/comments/:cid', function(req, res) {
    const startTime = new Date().getTime();
    while (new Date().getTime() < startTime + 2000);
    const results = { ecode: 0, data: { id: '1111' } };
    return res.status(200).send(results);
  });

  router.get('/project/:key/issue/options', function(req, res) {
    const startTime = new Date().getTime();
    while (new Date().getTime() < startTime + 2000);
    const results = { ecode:0, data: { timetrack:{ w2d: 6, d2h: 9},searchers:[{id:'1111', name:'分配给我的', query:{ aa: 'aa'}},{id:'2222', name:'分配给我的2', query:{bb:'bb'}},{id:'3333', name:'分配给我的3', query:{cc:'cc'}},{id:'4444', name:'分配给我的4', link:'dd'},{id:'5555', name:'分配给我的5', link:'dd'}], types: [{id: '1111', name: '任务',abb:'T', type: 'standard'}, { id: '2222', name: 'Bug', abb:'B', type:'standard', default: true, schema: [ { key:'name', name:'名称', required: true, type: 'TextArea' }, { key:'title', name:'主题', type: 'Url', defaultValue: 'bb' }, { key:'version', name:'版本', type: 'MultiSelect', optionValues: [{id: '1111', name: 'aaaa'},{id: '2222', name: 'bbbb'}, {id: '3333', name: 'cccc'} ], defaultValue: '1111', required: true }, { key:'attachments', name:'附件', type: 'File'}, { key:'expect_time', name:'完成时间', type: 'DateTimePicker' }, { key:'assignee', name:'经办人', type: 'Select' } ] }, { id: '3333', name: '需求',abb:'D', type:'standard', schema: [ { key:'title', name:'主题', type: 'Text', required: true }, { key:'version', name:'版本', type: 'MultiSelect', optionValues: [{id: '1111', name: 'aaaa'},{id: '2222', name: 'bbbb'}, {id: '3333', name: 'cccc'} ], defaultValue: '1111', required: true }, { key:'city2', name:'完成时间', type: 'CheckboxGroup', optionValues: [{id: '1111', name: 'aaaa'},{id: '2222', name: 'bbbb'}, {id: '3333', name: 'cccc'} ], defaultValue: '1111', required: true }, { key:'expect_time', name:'期望时间', type: 'DateTimePicker', required: true }, { key:'title2', name:'主题', type: 'Number' } ] }, { id: '4444', name: '子任务', abb:'S', type:'subtask', schema: [ { key:'name', name:'名称', required: true, type: 'TextArea' }, { key:'title', name:'主题', type: 'Url', defaultValue: 'bb' }, { key:'version', name:'版本', type: 'MultiSelect', optionValues: [{id: '1111', name: 'aaaa'},{id: '2222', name: 'bbbb'}, {id: '3333', name: 'cccc'} ], defaultValue: '1111', required: true }, { key:'attachments', name:'附件', type: 'File'}, { key:'expect_time', name:'完成时间', type: 'DateTimePicker' }, { key:'assignee', name:'经办人', type: 'Select' } ] }, { id: '5555', name: '子任务2', abb:'S', type:'subtask', schema: [ { key:'title', name:'主题', type: 'Url', defaultValue: 'bb' }, { key:'version', name:'版本', type: 'MultiSelect', optionValues: [{id: '1111', name: 'aaaa'},{id: '2222', name: 'bbbb'}, {id: '3333', name: 'cccc'} ], defaultValue: '1111', required: true }, { key:'attachments', name:'附件', type: 'File'}, { key:'expect_time', name:'完成时间', type: 'DateTimePicker' }, { key:'assignee', name:'经办人', type: 'Select' } ] }], priorities:[{id:'1111',color:'#000000',name:'重要'},{id:'2222',color:'#aaaaaa',name:'一般'},{id:'3333',color:'#cccccc',name:'微小'}], resolutions:[{id:'1111',name:'待处理'},{id:'2222',name:'开发中'},{id:'3333',name:'完成'}], states:[{id:'546761',name:'待处理'},{id:'546762',name:'开发中'},{id:'546763',name:'完成'}], users: [{ id: '111', name:'刘旭', email: 'liuxuyjy@chinamobile.com' }, { id: '222', name:'葛鹏', email: 'gepeng@chinamobile.com' }], versions:[{id: '1111', name: '1111' }, { id: '2222', name: '2222'}] }};
    return res.status(200).send(results);
  });

  router.get('/project/:key/issue/:id', function(req, res) {
    const startTime = new Date().getTime();
    while (new Date().getTime() < startTime + 2000);
    const results = { ecode: 0, data: { id: '546761', no:155, name: 'aaaaaaa', links: [{id: '1111', src:{id:'546761', no:111, type:'2222', title:'aaaaaaa'}, dest:{id:'546762', no:112, type:'2222', title:'aaaaaaa'}, relation:'is blocked by'}, {id: '1111',dest:{id:'546761', no:111, type:'2222', title:'aaaaaaa'}, src:{id:'546762', no:113, type:'2222', title:'bbbbb'}, relation:'is blocked by'}, {id: '1111',src:{id:'546761', no:111, type:'2222', title:'aaaaaaa'}, dest:{id:'546762', no:114, type:'2222', title:'cccc'}, relation:'is cloned by'}], description: 'bbbbbb', assignee:{ id: '1111', name: '刘旭' },type: '2222', title: '国拨类型的项目添加任务中责任人没有必选*号', priority:'1111', state:'2222', expect_time: 1478415469, version: '1111,2222', wfactions: [ {name:'纳入迭代', screen: '11111', id: 1111 }, { name:'纳入迭代', screen: '11111', id: 1112 }, { name:'纳入迭代', screen: '11111', id:1113 } ], attachments:[{id: '1111',type:'image/jpeg', uploader:'aaaa', size: 2222, time:1474646499, name: '截图.jpeg'}, {id: '2222',type:'docx', uploader:'aaaa', size: 2222, time:1474646499, name: '测试.docx'},{id: '2222',type:'docx',uploader:'aaaa', size: 2222, time:1474646499, name: '测试2.docx'}, {id: '4444',type:'image/png',uploader:'aaaa', size: 2222, time:1474646499, name: '截图3.jpeg'}] } };
    return res.status(200).send(results);
  });

  router.post('/project/:key/issue', function(req, res) {
    const startTime = new Date().getTime();
    while (new Date().getTime() < startTime + 2000);
    const results = { ecode: 0, data: { no:1, id: '546761', type:'1111', title: '国拨类型的项目添加任务中责任人没有必选*号', description:'bbbbb', priority:'1111', state:'2222', creator: {id:'aaa', name:'刘旭（研究院）'} } };
    return res.status(200).send(results);
  }); 

  router.post('/project/:key/issue/searcher', function(req, res) {
    const startTime = new Date().getTime();
    while (new Date().getTime() < startTime + 2000);
    const results = { ecode: 0, data: { id: '6666', name:'分配给我的6', link:'ee' } };
    return res.status(200).send(results);
  });

  router.delete('/project/:key/issue/searcher/:id', function(req, res) {
    const startTime = new Date().getTime();
    while (new Date().getTime() < startTime + 2000);
    const results = { ecode: 0, data: { id: req.params.id }};
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
      { id: '546762', name: '优先级', type:'Select', screens: [], key:'priority'},
      { id: '546764', name: '开始时间', type:'DatePicker', screens: [{id:'111', name:'界面1'}], key:'starttime'},
      { id: '2323', name: '附件', type:'CheckboxGroup', screens: [{id:'111', name:'界面1'}], key:'attachment'}],
      options: { types: [{id: '1111', name: '1111'}, {id: '2222', name: '2222'}] }
    };
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
      results = { ecode: 0, data: { id: '546763', name: '描述', key:'title',type:'CheckboxGroup', optionValues:['111', '222', '333'], defaultValue: ['111', '222']}};
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
      { id: '546762', name: '测试界面3', workflows: []},
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
      { id: '546761', name: '测试流程1', latest_modified_time: '2016-03-02 12:09:08', latest_modifier: { id: '1111', name: '张三' }, steps: 5 },
      { id: '546763', name: '测试流程2', latest_modified_time: '2016-03-02 12:09:08', latest_modifier: { id: '1111', name: '张三' }, steps: 5 },
      { id: '546762', name: '测试流程3', latest_modified_time: '2016-03-02 12:09:08', latest_modifier: { id: '2222', name: '李四' }, steps: 6 },
      { id: '546764', name: '测试流程5', latest_modified_time: '2016-03-02 12:09:08', latest_modifier: { id: '2222', name: '李四' }, steps: 4 }]
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
    const results = { ecode: 0, data:{ id: 'aaaa', name: '软件开发', contents: { steps:
    [{
       id: 1,
       name: 'step1',
       state: '1111',
       actions: [
        {
           id: 1,
           name: 'action1',
           restrict_to: {
             conditions: {
               type: 'or',
               list: [
                {
                   name: 'App\\Workflow\\Util@trueCondition1',
                   args: {
                     owner: 'aaa'
                  }
                },
                {
                   name: 'App\\Workflow\\Util@falseCondition2',
                   args: {
                     owner: 'aaa'
                  }
                }
              ]
            }
          },
           results: [
            {
               step: 2,
               old_status: 'Finished',
               status: 'Underway'
            },
            {
               step: 3,
               old_status: 'Finished',
               status: 'Underway'
            }
          ]
        },
        {
           id: 2,
           name: 'action2',
           results: [
            {
               step: 2,
               old_status: 'Finished',
               status: 'Underway'
            }
          ]
        }
      ]
    },
    {
       id: 2,
       name: 'step2',
       state: '2222',
       actions: [
        {
           id: 3,
           name: 'action3',
           results: [
            {
               step: 3,
               old_status: 'Finished',
               status: 'Underway'
            }
          ]
        }
      ]
    },
    {
       id: 3,
       name: 'step3',
       state: '3333',
       actions: [
        {
           id: 4,
           name: 'action4',
           results: [
            {
               step: 1,
               old_status: 'Finished',
               status: 'Underway'
            }
          ]
        },
        {
           id: 5,
           name: 'action5',
           results: [
            {
               step: 1,
               old_status: 'Finished',
               status: 'Underway'
            }
          ]
        }
      ]
    }]}},
    options: { states : [{id: '1111', name:'test1'}, {id: '2222', name:'test2'}, {id: '3333', name:'test3'}], permissions:[{id: '1111', name:'permission1'}, {id: '2222', name:'permission2'}, {id: '3333', name:'permission3'}], roles: [{id: '1111', name:'role1'}, {id: '2222', name:'role2'}, {id: '3333', name:'role3'}], screens:[{id: '1111', name:'screen1'}, {id: '2222', name:'screen2'}, {id: '3333', name:'screen3'}], users: [{ id: '111', name:'刘旭', email: 'liuxuyjy@chinamobile.com' }, { id: '222', name:'葛鹏', email: 'gepeng@chinamobile.com' }], events: [ {id: '1111', name: '一般事件'}, { id: '2222', name: 'ceshi'} ] }
};
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
  router.get('/project/:key/resolution', function(req, res) {
    const startTime = new Date().getTime();
    while (new Date().getTime() < startTime + 2000);
    const results = { ecode: 0, data: [{ id: '546761', name: '开发中', description: 'aaaaaaaaaaa'},{ id: '546763', name: '待测试', description: 'aaaaaaaaaaa', default: true },{ id: '546762', name: '已发布' },{ id: '2323', name: '已关闭', description: 'ddddddddddd' }]};
    return res.status(200).send(results);
  });

  router.post('/project/:key/resolution', function(req, res) {
    const results = { ecode: 0, data: { id: 'were', name: '5C问题', screen: {id:'222', name:'界面2'}, workflow:{id:'111', name:'流程1'}} };
    return res.status(200).send(results);
  });

  router.get('/project/:key/resolution/:id', function(req, res) {
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

  router.put('/project/:key/resolution/:id', function(req, res) {
    const startTime = new Date().getTime();
    while (new Date().getTime() < startTime + 2000);
    const results = { ecode: 0, data: { id: '546761', name: '任务1111', screen:{id:'222', name:'界面2'}, workflow:{id:'222', name:'流程2'}}};
    return res.status(200).send(results);
  });

  router.put('/project/:key/resolution', function(req, res) {
    const startTime = new Date().getTime();
    while (new Date().getTime() < startTime + 2000);
    const results = { ecode: 0, data: [{ id: '546763', name: '需求', screen: {id:'222', name:'界面2'}, workflow:{id:'111', name:'流程2'}},{ id: '546761', name: '任务', screen: {id:'111', name:'界面1'}, workflow:{id:'111', name:'流程1'}},{ id: '546762', name: '缺陷', screen: {id:'111', name:'界面1'}, workflow:{id:'111', name:'流程1'}},{ id: '2323', name: '子任务', screen: {id:'111', name:'界面1'}, workflow:{id:'222', name:'流程2'}}] };
    return res.status(200).send(results);
  });

  router.delete('/project/:key/resolution/:id', function(req, res) {
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
    const results = { ecode: 0, data: [{ id: '546761', project_key: '$_sys_$', name: '项目经理', description: '111aaa', permissions:[ 'create_issue', 'edit_issue'], users: [{id: '1111', name: 'liuxu', email: 'liuxu@aa.com' }, {id: '2222', name: 'lihui', email: 'lihui@aa.com'}] }, { id: '546762', name: '产品经理', permissions:['create_issue', 'edit_issue'], users: [{id: '1111', name: 'liuxu', email: 'liuxu@aa.com'}] }] };
    return res.status(200).send(results);
  });

  router.get('/project/:key/team', function(req, res) {
    const startTime = new Date().getTime();
    while (new Date().getTime() < startTime + 2000);
    const results = { ecode: 0, data: [{ id: '546761', name: '项目经理', description: '111aaa', permissions:[ 'create_issue', 'edit_issue'], users: [{id: '1111', name: 'liuxu', email: 'liuxu@aa.com' }, {id: '2222', name: 'lihui', email: 'lihui@aa.com'}] }, { id: '546762', name: '产品经理', permissions:['create_issue', 'edit_issue'], users: [{id: '1111', name: 'liuxu', email: 'liuxu@aa.com'}] }] };
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
      results = { ecode: 0, data: { id: '546761', name:'项目经理', description: '111aaa', permissions:['createIssue', 'projectConfig']}};
    } else {
      results = { ecode: 0, data: { id: '546762', name: '产品经理', description: 'adsfs', permissions:['createIssue', 'viewWorkflow']}};
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
    while (new Date().getTime() < startTime + 5000);
    const results = { ecode: 0, data: [{ id: '546763', name: '需求', screen: {id:'222', name:'界面2'}, workflow:{id:'111', name:'流程2'}},{ id: '546761', name: '任务', screen: {id:'111', name:'界面1'}, workflow:{id:'111', name:'流程1'}},{ id: '546762', name: '缺陷', screen: {id:'111', name:'界面1'}, workflow:{id:'111', name:'流程1'}},{ id: '2323', name: '子任务', screen: {id:'111', name:'界面1'}, workflow:{id:'222', name:'流程2'}}] };
    return res.status(200).send(results);
  });

  router.delete('/project/:key/role/:id', function(req, res) {
    const startTime = new Date().getTime();
    while (new Date().getTime() < startTime + 2000);
    const results = { ecode: 0, data: { id: req.params.id }};
    return res.status(200).send(results);
  });

  /*******************roleactor*****************/
  router.get('/project/:key/roleactor', function(req, res) {
    const startTime = new Date().getTime();
    while (new Date().getTime() < startTime + 2000);
    const results = { ecode: 0, data: [{ id: '546761', role: {id: '2222', name: '项目经理'}}, { id: '546762', role: { id: '3333', name: '产品经理'}}] };
    return res.status(200).send(results);
  });

  router.put('/project/:key/roleactor/:id', function(req, res) {
    const startTime = new Date().getTime();
    while (new Date().getTime() < startTime + 2000);
    const results = { ecode: 0, data: { id: '546761', name: '任务1111', screen:{id:'222', name:'界面2'}, workflow:{id:'222', name:'流程2'}}};
    return res.status(200).send(results);
  });

  router.post('/session', function(req, res) {
    const startTime = new Date().getTime();
    while (new Date().getTime() < startTime + 2000);
    const results = { ecode: 0, data: { user: { id: 'nhy67ujm', email:'liuxuyjy@chinamobile.com', first_name: 'liuxu', avatar: '', permissions: {sys_admin: true}, latest_access_url: '/project/boba/summary' }}};
    return res.status(200).send(results);
  });

  router.get('/session', function(req, res) {
    const startTime = new Date().getTime();
    while (new Date().getTime() < startTime + 2000);
    const results = { ecode: 0, data: { user: { id: 'nhy67ujm', email:'liuxuyjy@chinamobile.com', first_name: 'liuxu', avatar: 'http://tp1.sinaimg.cn/2214067364/180/5605327547/1', permissions: { sys_admin: true } }}};
    return res.status(200).send(results);
  });

  router.get('/user', function(req, res) {
    const results = { ecode: 0, data: [{id: '1111', name: 'liuxu'}, {id: '2222', name: 'lihui'}]};
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

  router.post('/project/:key/file', function(req, res) {
    return res.status(200).send({ecode: 0, data: { field:'attachments', file: {id: '546761'}}});
  });

  /*******************events*****************/
  router.get('/project/:key/events', function(req, res) {
    const startTime = new Date().getTime();
    while (new Date().getTime() < startTime + 2000);
    const results = { ecode: 0, data: [{ id: '546761', name: '创建问题', notifications: [  'assignee', 'reporter','project_principal', { key: 'role', value: '1111'} ] },{ id: '546763', name: '编辑问题', notifications: [ 'assignee', 'reporter', 'project_principal' ] },{ id: '546762', name: '删除问题' },{ id: '2323', name: '添加备注', notifications: [ 'assignee', 'reporter', 'module_principal' ] }], options:{ users: [{ id: '111', name:'刘旭', email:'liuxuyjy@chinamobile.com' }, { id: '222', name:'葛鹏', email: 'gepeng@chinamobile.com' }], roles: [{id: '1111', name:'role1'}, {id: '2222', name:'role2'}, {id: '3333', name:'role3'}] }};
    return res.status(200).send(results);
  });

  router.post('/project/:key/events', function(req, res) {
    const results = { ecode: 0, data: { id: 'were', name: '5C问题', screen: {id:'222', name:'界面2'}, workflow:{id:'111', name:'流程1'}} };
    return res.status(200).send(results);
  });
  /******************Events*************/

  /******************Activity***************/
  router.get('/project/:key/activity', function(req, res) {
    const startTime = new Date().getTime();
    while (new Date().getTime() < startTime + 2000);
    const results = { ecode: 0, data: [{ id: '546761', event_key: 'del_file', user : { id : '57afced21d41c8174d7421c1', name : '刘旭', email : 'liuxuyjy@chinamobile.com' }, data : 'aaa.jpg', issue: { id: '1111', no: '23', title: '1111111111111' }, ago_key: '1m' }, { id: '546763', event_key: 'add_file', user : { id : '57afced21d41c8174d7421c1', name : '刘旭', email : 'liuxuyjy@chinamobile.com' }, data : 'bbb.jpg', issue: { id: '1111', no:'45', title: '1111111111111' }, 'ago_key': '1w' }, { id: '546761', event_key: 'create_issue', user : { id : '57afced21d41c8174d7421c1', name : '刘旭', email : 'liuxuyjy@chinamobile.com' }, issue: { id: '1111', no:'324', title: '1111111111111' }, data: '' }, { id: '546763', user : { id : '57afced21d41c8174d7421c1', name : '刘旭', email : 'liuxuyjy@chinamobile.com' }, event_key: 'edit_issue', data: [{ field : '主题', after_value : 'jjjjjjj', type : 'Text' }, { field : '优先级', after_value : '一般', type : 'Select'} ], issue: { id: '1111', no: '77', title: '1111111111111' } }] };
    return res.status(200).send(results);
  });
  /******************Activity***************/

  /******************kanban***************/
  router.get('/project/:key/kanban', function(req, res) {
    const startTime = new Date().getTime();
    while (new Date().getTime() < startTime + 2000);
    const results={ ecode: 0, data: [{ id: '1111', name: '测试测试11', type: 'kanban', filters: [{no: 2, name: '1111', query:{ assignee: [ 'me', 'ttt' ] }}, {no: 3, name: '2222', query:{updated_at: '1w'}}, {no: 1, name: '3333', query: {created_at: '1w'}}], columns: [{name: '待处理', no: 1, states: ['546761','546762'], max: 4, min: 2}, {name:'处理中', no: 0, states: [ '546763' ], max: 4}, {name:'关闭', no: 2, states:[], min: 1}], query: { subtask: false, type: [ '1111', '3333' ] }, ranks: [{ col: 0, parent: '', rank: [9999, 1555]}], last_access_time: 11111111 }, { id: '2222', name:'2222', type: 'scrum', filters: [{ no: 1, name: 'mmmmmmm', query:{ assignee: [ 'me','ttt' ] } }, {no: 2, name: 'nnnnnnn', query:{updated_at: '1w'}}, {no: 4, name: 'tttt', query: {created_at: '1w'}}], columns: [{name: '待处理22', no: 0, states: [ '546761']}, {name:'处理中22', no: 2, states: [ '546762' ]}, {name:'关闭22', no: 5, states:[ '546763' ]}], query: { subtask: true, type: [ '1111', '2222' ] }, rank: {} }] };
    return res.status(200).send(results);
  });

  router.post('/project/:key/kanban', function(req, res) {
    const startTime = new Date().getTime();
    while (new Date().getTime() < startTime + 2000);
    const results={ ecode: 0, data: { id: '333', name: '测试测试33', type: 'kanban' } };
    return res.status(200).send(results);
  });

  router.delete('/project/:key/kanban/:id', function(req, res) {
    const startTime = new Date().getTime();
    while (new Date().getTime() < startTime + 2000);
    const results={ ecode: 0, data: { id: '333' } };
    return res.status(200).send(results);
  });

  router.put('/project/:key/kanban/:id', function(req, res) {
    const startTime = new Date().getTime();
    while (new Date().getTime() < startTime + 2000);
    const results={ ecode: 0, data: { id: '2222', name:'2222', type: 'scrum', filters: [{ no: 1, name: 'mmmmmmm', query:{ assignee: [ 'me','ttt' ] } }, {no: 2, name: 'nnnnnnn', query:{updated_at: '1w'}}, {no: 4, name: 'tttt', query: {created_at: '1w'}}], columns: [{name: '待处理22', no: 0, states: [ '546761']}, {name:'处理中22', no: 2, states: [ '546762' ]}], query: { subtask: true, type: [ '1111', '2222' ] }, rank: {} } };
    return res.status(200).send(results);
  });

  router.get('/project/:key/kanban/:kid/rank', function(req, res) {
    const startTime = new Date().getTime();
    while (new Date().getTime() < startTime + 2000);
    const results = { ecode: 0, data: { rank: [9999, 1555, 365, 2] } };
    return res.status(200).send(results);
  });
  router.post('/project/:key/kanban/:kid/rank', function(req, res) {
    const startTime = new Date().getTime();
    while (new Date().getTime() < startTime + 2000);
    const results = { ecode: 0, data: { rank: [9999, 1555, 365, 2] } };
    return res.status(200).send(results);
  });
  /******************kanban***************/
}
