import React, { PropTypes, Component } from 'react';
import { Modal, Button, Table } from 'react-bootstrap';
import _ from 'lodash';

const no_avatar = require('../../assets/images/no_avatar.png');

export default class ViewSprintModal extends Component {
  constructor(props) {
    super(props);
    this.handleCancel = this.handleCancel.bind(this);
  }

  static propTypes = {
    close: PropTypes.func.isRequired,
    sprintNo: PropTypes.number.isRequired,
    sprints: PropTypes.array.isRequired, 
    collection: PropTypes.array.isRequired
  }

  handleCancel() {
    const { close } = this.props;
    close();
  }

  render() {
    const { sprintNo, sprints, collection } = this.props;

    const issues = [];
    const curSprint = _.find(sprints, { no: sprintNo });
    if (curSprint) {
      _.map(collection, (v) => {
        if (_.indexOf(curSprint.issues, v.no) !== -1) {
          issues.push(v);
        }
      });
    }

    let total_issue_count = 0;
    let total_story_points = 0;
    const unassignedIssues = { issue_count: 0, story_points: 0 }
    const issuesByAssignee = {};
    _.map(issues, (v) => {
      if (!v.assignee || !v.assignee.id) {
        unassignedIssues.issue_count = _.add(unassignedIssues.issue_count, 1);
        unassignedIssues.story_points = _.add(unassignedIssues.story_points, v.story_points || 0);
      } else {
        if (!issuesByAssignee[v.assignee.id]) {
          issuesByAssignee[v.assignee.id] = { assignee: v.assignee, issue_count: 1, story_points: v.story_points || 0 } 
        } else {
          issuesByAssignee[v.assignee.id].issue_count = _.add(issuesByAssignee[v.assignee.id].issue_count, 1); 
          issuesByAssignee[v.assignee.id].story_points = _.add(issuesByAssignee[v.assignee.id].story_points, v.story_points || 0); 
        }
      }
      total_issue_count += 1;
      total_story_points += (v.story_points || 0);
    });

    return (
      <Modal { ...this.props } onHide={ this.handleCancel } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>工作量查看 - Sprint{ sprintNo }</Modal.Title>
        </Modal.Header>
        <Modal.Body style={ { height: '420px', overflow: 'auto' } }>
          { !_.isEmpty(issuesByAssignee) &&
          <Table hover responsive>
            <thead>
              <tr>
                <th>经办人</th>
                <th>问题数</th>
                <th>故事点数</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>未分配的</td>
                <td>{ unassignedIssues.issue_count }</td>
                <td>{ unassignedIssues.story_points }</td>
              </tr>
            { _.map(issuesByAssignee, (v, key) => {
              return (<tr key={ key }>
                <td>
                  <div style={ { float: 'left' } }>
                    <img className='board-avatar' src={ v.assignee && v.assignee.avatar ? '/api/getavatar?fid=' + v.assignee.avatar : no_avatar }/>
                    <span style={ { marginLeft: '5px' } }>{ v.assignee.name }</span>
                  </div>
                </td>
                <td style={ { verticalAlign: 'middle' } }>
                  <span>{ v.issue_count }</span>
                </td>
                <td style={ { verticalAlign: 'middle' } }>
                  <span>{ v.story_points }</span>
                </td>
              </tr>); }) }
              <tr>
                <td>合计</td>
                <td>{ total_issue_count }</td>
                <td>{ total_story_points }</td>
              </tr>
            </tbody>
          </Table> }
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={ this.handleCancel }>关闭</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

