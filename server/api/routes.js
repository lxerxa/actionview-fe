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
    const results = { ecode: 0, data: { id: '546761', name: '播吧', key: 'BOBA', creator: '刘旭', create_time: 144444 }, options: { users: [{id: 'xxx', name: 'liuxu', nameAndEmail: 'liuxu(aa@tom.com)' }, {id:'yyy', name: 'lihui', nameAndEmail: 'liuhui(bb@tom.com)'}] }};
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
    const results = { ecode: 0, data: [{ id: '546761', abb:'T', name: '任务', description:'bbbbb', screen_id:'111', workflow_id:'111'},{ id: '546763', name: '需求', abb:'D', screen_id:'222', workflow_id:'111', default: true },{ id: '546762', abb: 'C', name: '缺陷', screen_id:'111', workflow_id:'111'},{ id: '2323', abb:'S', name: '子任务', screen_id:'111', workflow_id:'222'}], options:{ screens:[{id:'111',name:'界面1'},{id:'222', name:'界面2'}, {id:'333', name:'界面3'}], workflows:[{id:'111',name:'流程1'},{id:'222', name:'流程2'}, {id:'333', name:'流程3'}] }};
    return res.status(200).send(results);
  });

  router.get('/project/:key/module', function(req, res) {
    const startTime = new Date().getTime();
    while (new Date().getTime() < startTime + 2000);
    const results = { ecode: 0, data: [{ id: '546761', name: '任务', description:'bbbbb', principal_id:'111', defaultAssignee_id:'111'},{ id: '546763', name: '需求', principal_id:'222', defaultAssignee_id:'111', default: true },{ id: '546762', name: '缺陷', principal_id:'111', defaultAssignee_id:'111'},{ id: '2323', name: '子任务'}], options:{ screens:[{id:'111',name:'界面1'},{id:'222', name:'界面2'}, {id:'333', name:'界面3'}], workflows:[{id:'111',name:'流>程1'},{id:'222', name:'流程2'}, {id:'333', name:'流程3'}] }};
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
    const results = { ecode: 0, options: { 'total': 8 }, data: [{ no:1555, id: '546761', type:'1111', title: '国拨类型的项目添加任务中责任人没有必选*号', description:'bbbbb', priority:'1111', state:'2222', creator: {id:'aaa', name:'刘旭（研究院）'}, created_at: '2016-08-15T14:01:52.683Z' },{ no:9999, id: '546763', type:'1111', title: 'osn首页“项目周月报”未填写的本月月报显示为本月待填', assignee:{id:'aaa', name:'刘旭（研究院）'}, priority:'2222', state:'2222', created_at: '2016-08-15T14:01:52.683Z' },{ no:3, id: '546762', type:'2222', assignee: {id:'xxxx', name:'liuxu'}, title: 'OSN首页右上角新建报工窗口，提交成功后窗口关闭没有提示信息', priority:'3333', state:'1111', creator: {id:'aaa', name:'刘旭（研究院）'}, created_at: '2016-08-15T14:01:52.683Z'},{ no:4, id: '2323', title: 'OSN首页-我的日程起止时间，第一行和第二行字体大小相同' , created_at: '2016-08-15T14:01:52.683Z'},{ no:1, id: '5426761', type:'1111', title: '国拨类型的项目添加任务中责任人没有必选*号', description:'bbbbb', priority:'1111', state:'2222', creator: {id:'aaa', name:'刘旭（研究院）'}, created_at: '2016-08-15T14:01:52.683Z' },{ no:2, id: '5462763', type:'1111', title: 'osn首页“项目周月报”未填写的本月月报显示为本月待填', assignee:{id:'aaa', name:'刘旭（研究院）'}, priority:'2222', state:'2222', created_at: '2016-08-15T14:01:52.683Z' },{ no:3, id: '5467621', type:'2222', assignee: {id:'xxxx', name:'liuxu'}, title: 'OSN首页右上角新建报工窗口，提交成功后窗口关闭没有提示信息', priority:'3333', state:'1111', creator: {id:'aaa', name:'刘旭（研究院）'}, created_at: '2016-08-15T14:01:52.683Z'},{ no:4, id: '22323', title: 'OSN首页-我的日程起止时间，第一行和第二行字体大小相同' , created_at: '2016-08-15T14:01:52.683Z'}] };
    return res.status(200).send(results);
  });

  router.get('/project/:key/issue/546761', function(req, res) {
    const startTime = new Date().getTime();
    while (new Date().getTime() < startTime + 2000);
    const results = { ecode: 0, data: { id: '546761', name: 'aaaaaaa', description: 'bbbbbb', assignee:{ id: '1111', name: '刘旭' },type: '2222', title: '国拨类型的项目添加任务中责任人没有必选*号', priority:'1111', state:'2222', expect_time: 1478415469, version: '1111,2222', wfactions: [ {name:'纳入迭代', screen: '11111', action:'1111' }, { name:'纳入迭代', screen: '11111', action:'1111' }, { name:'纳入迭代', screen: '11111', action:'1111' } ], attachments:[{id: '1111',type:'image/jpeg', uploader:'aaaa', size: 2222, time:1474646499, name: '截图.jpeg'}, {id: '2222',type:'docx', uploader:'aaaa', size: 2222, time:1474646499, name: '测试.docx'},{id: '2222',type:'docx',uploader:'aaaa', size: 2222, time:1474646499, name: '测试2.docx'}, {id: '4444',type:'image/png',uploader:'aaaa', size: 2222, time:1474646499, name: '截图3.jpeg'}] } };
    return res.status(200).send(results);
  });

  router.get('/project/:key/issue/options', function(req, res) {
    const startTime = new Date().getTime();
    while (new Date().getTime() < startTime + 2000);
    const results = { ecode:0, data: { searchers:[{id:'1111', name:'分配给我的', query:{ aa: 'aa'}},{id:'2222', name:'分配给我的2', query:{bb:'bb'}},{id:'3333', name:'分配给我的3', query:{cc:'cc'}},{id:'4444', name:'分配给我的4', link:'dd'},{id:'5555', name:'分配给我的5', link:'dd'}], types: [{id: '1111', name: '任务',abb:'T'}, { id: '2222', name: 'Bug', abb:'B', default: true, schema: [ { key:'name', name:'名称', required: true, type: 'TextArea' }, { key:'title', name:'主题', type: 'Url', defaultValue: 'bb' }, { key:'version', name:'版本', type: 'MultiSelect', optionValues: [{id: '1111', name: 'aaaa'},{id: '2222', name: 'bbbb'}, {id: '3333', name: 'cccc'} ], defaultValue: '1111', required: true }, { key:'attachments', name:'附件', type: 'File'}, { key:'expect_time', name:'城市', type: 'DateTimePicker' }, { key:'assignee', name:'经办人', type: 'Select' } ] }, { id: '3333', name: '需求',abb:'D', schema: [ { key:'title', name:'主题', type: 'Text', required: true }, { key:'version', name:'版本', type: 'MultiSelect', optionValues: [{id: '1111', name: 'aaaa'},{id: '2222', name: 'bbbb'}, {id: '3333', name: 'cccc'} ], defaultValue: '1111', required: true }, { key:'city2', name:'大城市', type: 'CheckboxGroup', optionValues: [{id: '1111', name: 'aaaa'},{id: '2222', name: 'bbbb'}, {id: '3333', name: 'cccc'} ], defaultValue: '1111', required: true }, { key:'expect_time', name:'期望时间', type: 'DateTimePicker', required: true }, { key:'title2', name:'主题', type: 'Number' } ] }], priorities:[{id:'1111',color:'#000000',name:'重要'},{id:'2222',color:'#aaaaaa',name:'一般'},{id:'3333',color:'#cccccc',name:'微小'}], resolutions:[{id:'1111',name:'待处理'},{id:'2222',name:'开发中'},{id:'3333',name:'完成'}], states:[{id:'1111',name:'待处理'},{id:'2222',name:'开发中'},{id:'3333',name:'完成'}] }};
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
       name: "step1",
       state: "1111",
       actions: [
        {
           id: 1,
           name: "action1",
           restrict_to: {
             conditions: {
               type: "or",
               list: [
                {
                   name: "App\\Workflow\\Util@trueCondition1",
                   args: {
                     owner: "aaa"
                  }
                },
                {
                   name: "App\\Workflow\\Util@falseCondition2",
                   args: {
                     owner: "aaa"
                  }
                }
              ]
            }
          },
           results: [
            {
               step: 2,
               old_status: "Finished",
               status: "Underway"
            },
            {
               step: 3,
               old_status: "Finished",
               status: "Underway"
            }
          ]
        },
        {
           id: 2,
           name: "action2",
           results: [
            {
               step: 2,
               old_status: "Finished",
               status: "Underway"
            }
          ]
        }
      ]
    },
    {
       id: 2,
       name: "step2",
       state: "2222",
       actions: [
        {
           id: 3,
           name: "action3",
           results: [
            {
               step: 3,
               old_status: "Finished",
               status: "Underway"
            }
          ]
        }
      ]
    },
    {
       id: 3,
       name: "step3",
       state: "3333",
       actions: [
        {
           id: 4,
           name: "action4",
           results: [
            {
               step: 1,
               old_status: "Finished",
               status: "Underway"
            }
          ]
        },
        {
           id: 5,
           name: "action5",
           results: [
            {
               step: 1,
               old_status: "Finished",
               status: "Underway"
            }
          ]
        }
      ]
    }]}},
    options: { states : [{id: "1111", name:"test1"}, {id: "2222", name:"test2"}, {id: "3333", name:"test3"}], permissions:[{id: "1111", name:"permission1"}, {id: "2222", name:"permission2"}, {id: "3333", name:"permission3"}], roles: [{id: "1111", name:"role1"}, {id: "2222", name:"role2"}, {id: "3333", name:"role3"}], screens:[{id: "1111", name:"screen1"}, {id: "2222", name:"screen2"}, {id: "3333", name:"screen3"}] }
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
    const results = { ecode: 0, data: [{ id: '546761', name: '项目经理', description: '111aaa', permissions:[ 'create_issue', 'edit_issue'], users: [{id: '1111', name: 'liuxu', nameAndEmail: 'liuxu@aa.com' }, {id: '2222', name: 'lihui', nameAndEmail: 'lihui@aa.com'}] }, { id: '546762', name: '产品经理', permissions:['create_issue', 'edit_issue'], users: [{id: '1111', name: 'liuxu', nameAndEmail: 'liuxu@aa.com'}] }], options:{ permissions: [{ id: 'createIssue', name: '创建问题'}, { id: 'viewWorkflow', name: '查看流程'}, { id: 'projectConfig', name: '项目配置'}, { id: 'deleteComments', name: '删除评论'}] }};
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
    const results = { ecode: 0, data: { _id: 'nhy67ujm', name: 'liuxu', avatar: 'http://tp1.sinaimg.cn/2214067364/180/5605327547/1'}};
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

  router.post('/uploadfile', function(req, res) {
    return res.status(200).send({ecode: 0, data: { field:'attachements', fid: '546761'}});
  });
}
