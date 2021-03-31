import React, { PropTypes, Component } from 'react';
import { OverlayTrigger, Popover, Grid, Row, Col, ControlLabel } from 'react-bootstrap';
import _ from 'lodash';

const moment = require('moment');

export default class BlockItem extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    cellWidth: PropTypes.number.isRequired,
    blockHeight: PropTypes.number.isRequired,
    origin: PropTypes.number.isRequired,
    foldIssues: PropTypes.array.isRequired,
    issue: PropTypes.object.isRequired,
    options: PropTypes.object.isRequired,
    mode: PropTypes.string.isRequired
  }

  //shouldComponentUpdate(newProps, newState) {
  //  if (newProps.cellWidth != this.props.cellWidth
  //    || newProps.origin != this.props.origin
  //    || newProps.mode != this.props.mode
  //    || this.props.foldIssues.indexOf(this.props.issue.id) !== -1
  //    || newProps.foldIssues.indexOf(this.props.issue.id) !== -1
  //    || this.props.issue.id == newProps.selectedIssue.id 
  //    || this.props.issue.id == newProps.selectedIssue.parent_id) {
  //    return true;
  //  }
  //  return false;
  //}

  render() {
    const { 
      cellWidth,
      blockHeight,
      origin, 
      foldIssues, 
      issue,
      options:{ states=[] },
      mode
    } = this.props;

    const stateColors = { new : '#ccc', inprogress: '#3db9d3', completed: '#3c9445' };

    const popover=(
      <Popover id='popover-trigger-hover' style={ { maxWidth: '350px', padding: '15px 0px' } }>
        <Grid>
          <Row>
            <Col sm={ 4 } componentClass={ ControlLabel } style={ { textAlign: 'right' } }>主题</Col>
            <Col sm={ 8 }><div style={ { textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' } }>{ issue.title }</div></Col>
          </Row>
          <Row>
            <Col sm={ 4 } componentClass={ ControlLabel } style={ { textAlign: 'right' } }>开始时间</Col>
            <Col sm={ 8 }>{ issue.expect_start_time ? moment.unix(issue.expect_start_time).format('YYYY/MM/DD') : <span style={ { fontStyle: 'italic', color: '#aaa' } }>未指定</span> }</Col>
          </Row>
          <Row>
            <Col sm={ 4 } componentClass={ ControlLabel } style={ { textAlign: 'right' } }>结束时间</Col>
            <Col sm={ 8 }>{ issue.expect_complete_time ? moment.unix(issue.expect_complete_time).format('YYYY/MM/DD') : <span style={ { fontStyle: 'italic', color: '#aaa' } }>未指定</span> }</Col>
          </Row>
          { mode == 'progress' &&
          <Row>
            <Col sm={ 4 } componentClass={ ControlLabel } style={ { textAlign: 'right' } }>进度</Col>
            <Col sm={ 8 }>{ issue.progress ? issue.progress + '%' : '0%' }</Col>
          </Row> }
          { mode == 'status' &&
          <Row>
            <Col sm={ 4 } componentClass={ ControlLabel } style={ { textAlign: 'right' } }>状态</Col>
            <Col sm={ 8 }>{ _.findIndex(states, { id: issue.state }) != -1 ? <span className={ 'state-' + _.find(states, { id: issue.state }).category + '-label' }>{ _.find(states, { id: issue.state }).name }</span>: '-' }</Col>
          </Row> }
        </Grid>
      </Popover>);

    const start = moment.unix(issue.expect_start_time || issue.expect_complete_time || issue.created_at).startOf('day').format('X');
    const end = moment.unix(issue.expect_complete_time || issue.expect_start_time || issue.created_at).startOf('day').format('X');
    const size = (end - start) / 3600 / 24 + 1;
    const offset = (start - origin) / 3600 / 24;

    const width = size * cellWidth - 3;

    let backgroundColor = '#ccc';
    if (mode == 'progress') {
      if ((!issue.expect_start_time || !issue.expect_complete_time) && (!issue.progress || issue.progress < 100)) {
        backgroundColor = '#555';
      } else {
        backgroundColor = issue.hasSubtasks ? '#65c16f' : '#3db9d3';
      }
    } else if (mode == 'status') {
      const stateInd = _.findIndex(states, { id: issue.state });
      if (stateInd !== -1) {
        const category = states[stateInd].category;
        if ((!issue.expect_start_time || !issue.expect_complete_time) && category !== 'completed') {
          backgroundColor = '#555';
        } else {
          backgroundColor = stateColors[category];
        }
      }
    }

    const progressBGColor = issue.hasSubtasks ? '#3c9445' : '#2898b0';

    return (
      <div className='ganttview-block-container'>
        <OverlayTrigger trigger={ [ 'hover', 'focus' ] } rootClose placement='top' overlay={ popover }>
          { issue.hasSubtasks && foldIssues.indexOf(issue.id) === -1 ?
          <div className='ganttview-block-parent'
            id={ issue.id + '-block' }
            data-id={ issue.id }
            style={ { width: width + 'px', marginLeft: (offset * cellWidth + 1) + 'px' } }>
            <div className='ganttview-block-parent-left'/>
            <div className='ganttview-block-parent-right'/>
          </div>
          :
          <div
            className={ 'ganttview-block ' + (issue.hasSubtasks ? '' : 'ganttview-block-movable') }
            id={ issue.id + '-block' }
            data-id={ issue.id }
            style={ { width: width + 'px', height: blockHeight + 'px', marginLeft: (offset * cellWidth + 1) + 'px', backgroundColor } }>
            { mode == 'progress' &&
            <div
              className='ganttview-block-progress'
              style={ { height: blockHeight + 'px', width: (width * _.min([ _.max([ issue.progress || 0, 0 ]), 100 ]) / 100) + 'px', backgroundColor: progressBGColor } }/> }
          </div> }
        </OverlayTrigger>
      </div> ); 
  }
}
