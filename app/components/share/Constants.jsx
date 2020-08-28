
export const FieldTypes =  [
  { value: 'Number', label: 'Number' },
  { value: 'Text', label: 'Text' },
  { value: 'TextArea', label: 'Text area' },
  { value: 'Select', label: 'Select' },
  { value: 'MultiSelect', label: 'Multiselect' },
  { value: 'CheckboxGroup', label: 'Checkbox group' },
  { value: 'RadioGroup', label: 'Radio group' },
  { value: 'DatePicker', label: 'Date Picker' },
  { value: 'DateTimePicker', label: 'Datetime picker' },
  { value: 'TimeTracking', label: 'Time tracking' },
  { value: 'File', label: 'File' },
  { value: 'SingleVersion', label: 'Single Version' },
  { value: 'MultiVersion', label: 'Multiversion' },
  { value: 'SingleUser', label: 'Single user' },
  { value: 'MultiUser', label: 'Multiuser' },
  { value: 'Url', label: 'URL' }
];

export const StateCategories = [
  { id: 'new', name: 'New' },
  { id: 'inprogress', name: 'In progress' },
  { id: 'completed', name: 'Completed' }
];

export const Permissions = {
  project: [
    { id: 'view_project', name: 'View project' },
    { id: 'manage_project', name: 'Manage project' }
  ],
  issue: [
    { id: 'create_issue', name: 'Create issue' },
    { id: 'edit_issue', name: 'Edit issue' },
    { id: 'delete_issue', name: 'Delete issue' },
    { id: 'assign_issue', name: 'Assign issue' },
    { id: 'assigned_issue', name: 'Assigned issue' },
    { id: 'resolve_issue', name: 'Resolve issue' },
    { id: 'close_issue', name: 'Close issue' },
    { id: 'reset_issue', name: 'Reset issue' },
    { id: 'link_issue', name: 'Link issue' },
    { id: 'move_issue', name: 'Move issue' },
    { id: 'exec_workflow', name: 'Execute workflow' }
  ],
  comments: [
    { id: 'add_comments', name: 'Add comments' },
    { id: 'edit_comments', name: 'Edit comments' },
    { id: 'edit_self_comments', name: 'Edit own comments' },
    { id: 'delete_comments', name: 'Delete comments' },
    { id: 'delete_self_comments', name: 'Delete own comments' }
  ],
  worklogs: [
    { id: 'add_worklog', name: 'Add worklog' },
    { id: 'edit_worklog', name: 'Edit worklog' },
    { id: 'edit_self_worklog', name: 'Edit self worklog' },
    { id: 'delete_worklog', name: 'Delete worklog' },
    { id: 'delete_self_worklog', name: 'Delete own worklog' }
  ],
  files: [
    { id: 'upload_file', name: 'Upload file' },
    { id: 'download_file', name: 'Download file' },
    { id: 'remove_file', name: 'Delete file' },
    { id: 'remove_self_file', name: 'Delete own file' }
  ]
};

export const webhookEvents = [
  { id: 'create_issue', name: 'Create issue' },
  { id: 'edit_issue', name: 'Edit issue' },
  { id: 'del_issue', name: 'Delete issue' },
  { id: 'resolve_issue', name: 'Resolve issue' },
  { id: 'close_issue', name: 'Close issue' },
  { id: 'reopen_issue', name: 'Reopen issue' },
  { id: 'create_version', name: 'Create version' },
  { id: 'edit_version', name: 'Edit version' },
  { id: 'release_version', name: 'Release version' },
  { id: 'merge_version', name: 'Merge version' },
  { id: 'del_version', name: 'Delete version' },
  { id: 'add_worklog', name: 'Add worklog' },
  { id: 'edit_worklog', name: 'Edit worklog' }
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
