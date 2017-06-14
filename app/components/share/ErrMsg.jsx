import _ from 'lodash';

const Err = {};

Err.enumItems = [
   // session error code
  { code: -10000, msg: '登录失败。' },
  { code: -10001, msg: '会话过期。' },
  { code: -10002, msg: '权限不足。' },
  { code: -10003, msg: '邮箱或密码不能为空。' },

  // issue
  { code: -11100, msg: '问题类型不能为空。' },
  { code: -11101, msg: 'Schema不存在。' },
  { code: -11102, msg: '时间跟踪字段格式有误。' },
  { code: -11103, msg: '问题不存在或不属于此项目。' },
  { code: -11104, msg: '指定经办人不能为空。' },
  { code: -11105, msg: '过滤器名称不能为空。' },
  { code: -11106, msg: '过滤器名称不能重复。' },
  { code: -11107, msg: '过滤器不存在或不属于此项目。' },
  { code: -11108, msg: '主题不能为空。' },
  { code: -11109, msg: '拷贝对象必须指定。' },
  { code: -11110, msg: '父问题对象不存在或不属于此项目。' },
  { code: -11111, msg: '父问题对象必须指定。' },

  { code: -11121, msg: '必须指定链出问题。' },
  { code: -11122, msg: '必须指定链入问题。' },
  { code: -11123, msg: '链接关系指定有误。' },
  { code: -11124, msg: '链接关系已存在。' },
  { code: -11125, msg: '此链接不存在。' },

  // comments error code
  { code: -11200, msg: '备注内容不能为空。' },
  { code: -11201, msg: '备注不存在或不属于此项目。' },
  { code: -11202, msg: '回复ID不能为空。' },
  { code: -11203, msg: '该回复不存在。' },
  { code: -11204, msg: '操作有误。' },
  
  // worklog error code
  { code: -11300, msg: '耗费时间不能为空。' },
  { code: -11301, msg: '耗费时间格式不正确。' },
  { code: -11302, msg: '开始时间不能为空。' },
  { code: -11303, msg: '剩余时间调整方式不正确。' },
  { code: -11304, msg: '必须指定剩余时间。' },
  { code: -11305, msg: '剩余时间指定格式不正确。' },
  { code: -11306, msg: '必须制定缩减时间。' },
  { code: -11307, msg: '缩减时间格式不正确。' },
  { code: -11308, msg: '问题不存在。' },
  { code: -11309, msg: '工作日志不存在或不属于此问题。' },
  
  // module error code
  { code: -11400, msg: '模块名称不能为空。' },
  { code: -11401, msg: '模块名称不能重复。' },
  { code: -11402, msg: '模块不存在或不属于此项目。' },
  { code: -11403, msg: '模块在问题中被使用。' },
  
  // version error code
  { code: -11500, msg: '版本名称不能为空。' },
  { code: -11501, msg: '版本名称不能重复。' },
  { code: -11502, msg: '版本开始时间必须小于结束时间。' },
  { code: -11503, msg: '版本不存在或不属于此项目。' },
  { code: -11504, msg: '版本在问题中被使用。' },

  // type error code
  { code: -12000, msg: '类型名称不能为空。' },
  { code: -12001, msg: '类型名称不能重复。' },
  { code: -12002, msg: '类型缩码不能为空。' },
  { code: -12003, msg: '类型缩码不能重复。' },
  { code: -12004, msg: '类型关联界面不能为空。' },
  { code: -12005, msg: '类型关联工作流不能为空。' },
  { code: -12006, msg: '类型不存在或不属于此项目。' },
  { code: -12007, msg: '类型在问题中被使用。' },

  // workflow error code
  { code: -12100, msg: '工作流名称不能为空。' },
  { code: -12101, msg: '工作流不存在或不属于此项目。' },
  { code: -12102, msg: '该工作流已绑定了问题类型。' },

  // field error code
  { code: -12200, msg: '字段名称不能为空。' },
  { code: -12201, msg: '字段键值不能为空。' },
  { code: -12202, msg: '该键值已被系统占用。' },
  { code: -12203, msg: '键值不能重复。' },
  { code: -12204, msg: '字段类型不能为空。' },
  { code: -12205, msg: '字段类型值不正确。' },
  { code: -12206, msg: '字段不存在或不属于此项目。' },
  { code: -12207, msg: '该字段在界面中被使用。' },

  // screen error code
  { code: -12300, msg: '界面名称不能为空。' },
  { code: -12301, msg: '界面不存在或不属于此项目。' },
  { code: -12302, msg: '该界面已绑定了问题类型。' },
  { code: -12303, msg: '该界面在流程中被使用。' },

  // state error code
  { code: -12400, msg: '状态名称不能为空。' },
  { code: -12401, msg: '状态名称不能重复。' },
  { code: -12402, msg: '状态不存在或不属于此项目。' },
  { code: -12403, msg: '状态在问题中被使用。' },
  { code: -12404, msg: '状态在工作流中被使用。' },

  // resolution error code
  { code: -12500, msg: '结果名称不能为空。' },
  { code: -12501, msg: '结果名称不能重复。' },
  { code: -12502, msg: '结果不存在或不属于此项目。' },
  { code: -12503, msg: '结果在问题中被使用。' },

  // priority error code
  { code: -12600, msg: '优先级名称不能为空。' },
  { code: -12601, msg: '优先级名称不能重复。' },
  { code: -12602, msg: '优先级不存在或不属于此项目。' },
  { code: -12603, msg: '优先级在问题中被使用。' },

  // role error code
  { code: -12700, msg: '角色名称不能为空。' },
  { code: -12701, msg: '权限项值不正确。' },
  { code: -12702, msg: '角色不存在或不属于此项目。' },
  { code: -12703, msg: '角色在项目中被使用。' },

  // event error code
  { code: -12800, msg: '事件名称不能为空。' },
  { code: -12801, msg: '事件名称不能重复。' },
  { code: -12802, msg: '事件不存在或不属于此项目。' },

  // project error code
  { code: -14000, msg: '项目名称不能为空。' },
  { code: -14001, msg: '项目键值不能为空。' },
  { code: -14002, msg: '项目键值已被占用。' },
  { code: -14003, msg: '指定负责人不存在。' },
  { code: -14004, msg: '项目不存在。' },
  { code: -14005, msg: '必须指定负责人。' },
  { code: -14006, msg: '项目不存在。' },
  { code: -14007, msg: '没有选择对象。' },
  { code: -14008, msg: '没有指定状态。' },

  // mysetting error code
  { code: -15000, msg: '用户不存在。' },
  { code: -15001, msg: '原密码不能为空。' },
  { code: -15002, msg: '原密码不正确。' },
  { code: -15003, msg: '新密码不能为空。' },
  { code: -15004, msg: '密码重置失败。' },
  { code: -15005, msg: '用户姓名不能为空。' },

  // file error code
  { code: -15100, msg: '文件不存在。' },
  { code: -15101, msg: '文件上传失败。' },
  { code: -15102, msg: '文件删除失败。' }
];

Err.getErrMsg = function (code) {
  const ind = _.findIndex(Err.enumItems, { code: code });
  if (ind !== -1) {
    return Err.enumItems[ind].msg;
  } else {
    return '';
  }
};

export default Err;
