
export const FieldTypes =  [
  { value: 'Integer', label: '整数字段' },
  { value: 'Number', label: '数值字段' },
  { value: 'Text', label: '文本框单行' },
  { value: 'TextArea', label: '文本框多行' },
  { value: 'RichTextEditor', label: '富文本' },
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
  { value: 'Url', label: 'URL' }
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
    { id: 'edit_self_issue', name: '编辑自己创建的问题' },
    { id: 'delete_issue', name: '删除问题' },
    { id: 'delete_self_issue', name: '删除自己创建的问题' },
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
    { id: 'add_comments', name: '添加评论' },
    { id: 'edit_comments', name: '编辑评论' },
    { id: 'edit_self_comments', name: '编辑自己的评论' },
    { id: 'delete_comments', name: '删除评论' },
    { id: 'delete_self_comments', name: '删除自己的评论' }
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
  { id: 'resolve_issue', name: '解决问题' },
  { id: 'close_issue', name: '关闭问题' },
  { id: 'reopen_issue', name: '重新打开问题' },
  { id: 'create_version', name: '创建版本' },
  { id: 'edit_version', name: '编辑版本' },
  { id: 'release_version', name: '发布版本' },
  { id: 'merge_version', name: '合并版本' },
  { id: 'del_version', name: '删除版本' },
  { id: 'add_worklog', name: '添加工作日志' },
  { id: 'edit_worklog', name: '编辑工作日志' }
];

export const CardTypes = {
  CARD: 'card',
  KANBAN_COLUMN: 'kanban_column',
  KANBAN_FILTER: 'kanban_filter'
};

export const PriorityRGBs = [
  '#CCCCCC',
  '#B3B3B3',
  '#999999',
  '#A4DD00',
  '#68BC00',
  '#006600',
  '#73D8FF',
  '#009CE0',
  '#0062B1',
  '#FCDC00',
  '#FCC400',
  '#FB9E00',
  '#FE9200',
  '#E27300',
  '#C45100',
  '#F44E3B',
  '#D33115',
  '#9F0500'
];

export const LabelRGBs = [
  '#CCCCCC',
  '#B3B3B3',
  '#999999',
  '#808080',
  '#666666',
  '#FDA1FF',
  '#FA28FF',
  '#AB149E',
  '#AEA1FF',
  '#7B64FF',
  '#653294',
  '#73D8FF',
  '#009CE0',
  '#0062B1',
  '#68CCCA',
  '#16A5A5',
  '#0C797D',
  '#A4DD00',
  '#68BC00',
  '#006600',
  '#DBDF00',
  '#B0BC00',
  '#808900',
  '#FCDC00',
  '#FCC400',
  '#FB9E00',
  '#FE9200',
  '#E27300',
  '#C45100',
  '#F44E3B',
  '#D33115',
  '#9F0500',
  '#4D4D4D',
  '#333333',
  '#000000'
];

export const DetailMinWidth = 660;
export const DetailMaxWdith = 1000;
