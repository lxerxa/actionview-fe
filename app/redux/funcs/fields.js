// Utils for removing boilerplate from Redux
import _ from 'lodash';

export function arrange(options) {
  const fields = [
    { key: 'type', name: '类型', type: 'Select' },
    { key: 'priority', name: '优先级', type: 'Select' },
    { key: 'state', name: '状态', type: 'Select' },
    { key: 'resolution', name: '解决结果', type: 'Select' },
    { key: 'module', name: '模块', type: 'MultiSelect' },
    { key: 'resolve_version', name: '解决版本', type: 'SingleVersion' },
    { key: 'effect_versions', name: '影响版本', type: 'MultiVersion' },
    { key: 'labels', name: '标签', type: 'MultiSelect' },
    { key: 'reporter', name: '报告者', type: 'SingleUser' },
    { key: 'assignee', name: '负责人', type: 'SingleUser' },
    { key: 'resolver', name: '解决者', type: 'SingleUser' },
    { key: 'closer', name: '关闭者', type: 'SingleUser' },
    { key: 'created_at', name: '创建时间', type: 'DateTimePicker' },
    { key: 'updated_at', name: '更新时间', type: 'DateTimePicker' },
    { key: 'resolved_at', name: '解决时间', type: 'DateTimePicker' },
    { key: 'closed_at', name: '关闭时间', type: 'DateTimePicker' },
    { key: 'epic', name: 'Epic', type: 'Select' },
    { key: 'sprints', name: 'Sprint', type: 'MultiSelect' }
  ];

  _.forEach(options.fields || [], (v) => {
    const index = _.findIndex(fields, { key: v.key });
    if (index === -1) {
      fields.push(v);
    }
  });

  _.forEach(fields, (v) => {
    if (v.key == 'type') {
      v.optionValues = options.types || [];
    } else if (v.key == 'priority') {
      v.optionValues = options.priorities || [];
    } else if (v.key == 'state') {
      v.optionValues = options.states || []
    } else if (v.key == 'resolution') {
      v.optionValues = options.resolutions || []
    } else if (v.key == 'module') {
      v.optionValues = options.modules || []
    } else if (v.key == 'labels') {
      v.optionValues = options.labels || []
    } else if (v.key == 'epic') {
      v.optionValues = options.epics || []
    } else if (v.key == 'sprints') {
      v.optionValues = options.sprints || []
    } else if (v.type == 'SingleVersion' || v.type == 'MultiVersion') {
      v.optionValues = options.versions || []
    } else if (v.type == 'SingleUser' || v.type == 'MultiUser') {
      v.optionValues = options.users || []
    }
  });

  return fields;
}
