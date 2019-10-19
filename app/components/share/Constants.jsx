
export const FieldTypes =  [
  { value: 'Number', label: '数值字段' },
  { value: 'Text', label: '文本框单行' },
  { value: 'TextArea', label: '文本框多行' },
  { value: 'Select', label: '选择列表(单行)' },
  { value: 'MultiSelect', label: '选择列表(多行)' },
  { value: 'CheckboxGroup', label: '复选按钮' },
  { value: 'RadioGroup', label: '单选按钮' },
  { value: 'DatePicker', label: '日期选择控件' },
  { value: 'DateTimePicker', label: '日期时间选择控件' },
  { value: 'TimeTracking', label: '时间跟踪' },
  { value: 'File', label: '文件' },
  { value: 'SingleVersion', label: '单一版本选择' },
  { value: 'MultiVersion', label: '多版本选择' },
  { value: 'SingleUser', label: '单一用户选择' },
  { value: 'MultiUser', label: '多用户选择' },
  { value: 'Url', label: 'URL字段' }
];

export const StateCategories = [
  { id: 'new', name: '新建' },
  { id: 'inprogress', name: '进行中' },
  { id: 'completed', name: '完成' }
];

export const Permissions = {
  project: [
    { id: 'view_project', name: '查看项目' },
    { id: 'manage_project', name: '管理项目' }
  ],
  issue: [
    { id: 'create_issue', name: '创建问题' },
    { id: 'edit_issue', name: '编辑问题' },
    { id: 'delete_issue', name: '删除问题' },
    { id: 'assign_issue', name: '分配问题' },
    { id: 'assigned_issue', name: '被分配问题' },
    { id: 'resolve_issue', name: '解决问题' },
    { id: 'close_issue', name: '关闭问题' },
    { id: 'reset_issue', name: '重置问题' },
    { id: 'link_issue', name: '链接问题' },
    { id: 'move_issue', name: '移动问题' },
    { id: 'exec_workflow', name: '执行流程' }
  ],
  comments: [
    { id: 'add_comments', name: '添加备注' },
    { id: 'edit_comments', name: '编辑备注' },
    { id: 'edit_self_comments', name: '编辑自己的备注' },
    { id: 'delete_comments', name: '删除备注' },
    { id: 'delete_self_comments', name: '删除自己的备注' }
  ],
  worklogs: [
    { id: 'add_worklog', name: '添加工作日志' },
    { id: 'edit_worklog', name: '编辑工作日志' },
    { id: 'edit_self_worklog', name: '编辑自己的工作日志' },
    { id: 'delete_worklog', name: '删除工作日志' },
    { id: 'delete_self_worklog', name: '删除自己的工作日志' }
  ],
  files: [
    { id: 'upload_file', name: '上传附件' },
    { id: 'download_file', name: '下载附件' },
    { id: 'remove_file', name: '删除附件' },
    { id: 'remove_self_file', name: '删除自己上传附件' }
  ]
};

export const webhookEvents = [
  { id: 'create_issue', name: '创建问题' },
  { id: 'edit_issue', name: '编辑问题' },
  { id: 'del_issue', name: '删除问题' },
  { id: 'create_version', name: '创建版本' },
  { id: 'edit_version', name: '编辑版本' },
  { id: 'del_version', name: '删除版本' },
  { id: 'add_worklog', name: '添加工作日志' }
];

export const CardTypes = {
  CARD: 'card',
  KANBAN_COLUMN: 'kanban_column',
  KANBAN_FILTER: 'kanban_filter'
};
