import React, { PropTypes, Component } from 'react';
import _ from 'lodash';

const moment = require('moment');

export default class VtHeaderItem extends Component {
  constructor(props) {
    super(props);
    this.getDuration = this.getDuration.bind(this);
  }

  static propTypes = {
    foldIssues: PropTypes.array.isRequired,
    issue: PropTypes.object.isRequired,
    selectedIssue: PropTypes.object.isRequired,
    options: PropTypes.object.isRequired,
    mode: PropTypes.string.isRequired,
    show: PropTypes.func.isRequired,
    locate: PropTypes.func.isRequired,
    mark: PropTypes.func.isRequired,
    fold: PropTypes.func.isRequired
  }

  shouldComponentUpdate(newProps, newState) {
    if (newProps.mode != this.props.mode
      || this.props.foldIssues.indexOf(this.props.issue.id) !== -1
      || newProps.foldIssues.indexOf(this.props.issue.id) !== -1
      || !_.isEqual(newProps.issue, this.props.issue)
      || this.props.issue.id == newProps.selectedIssue.id
      || this.props.issue.id == newProps.selectedIssue.parent_id) {
      return true;
    }
    return false;
  }


  getDuration(start_time, complete_time) {
    const { options: { singulars=[] } } = this.props;

    const new_start_time = moment.unix(start_time).startOf('day').format('X') - 0;
    const new_complete_time = moment.unix(complete_time).startOf('day').format('X') - 0;

    let duration = 0;
    for (let i = new_start_time; i <= new_complete_time; i = i + 3600 * 24) {
      const m = moment.unix(i);
      const date = m.format('YYYY/MM/DD');
      const index = _.findIndex(singulars, { date });
      if (index !== -1) {
        if (singulars[index].notWorking !== 1) {
          duration += 1;
        }
        continue;
      }

      const week = m.format('d');
      if (week % 6 !== 0) {
        duration += 1;
      }
    }
    return duration;
  }

  render() {
    const { 
      options: { states=[] },
      mode, 
      foldIssues, 
      issue,
      show, 
      locate, 
      mark, 
      fold
    } = this.props;

    const header = (
      <div className='ganttview-vtheader-series-header-item'>
        <div className='ganttview-vtheader-series-header-item-cell' style={ { width: '400px' } }>
          主题
        </div>
        <div className='ganttview-vtheader-series-header-item-cell' style={ { width: '60px' } }>
          NO
        </div>
        <div className='ganttview-vtheader-series-header-item-cell' style={ { width: '90px' } }>
          负责人
        </div>
        { mode == 'progress' &&
        <div className='ganttview-vtheader-series-header-item-cell' style={ { width: '80px' } }>
          进度
        </div> }
        { mode == 'status' &&
        <div className='ganttview-vtheader-series-header-item-cell' style={ { width: '80px' } }>
          状态
        </div> }
        <div className='ganttview-vtheader-series-header-item-cell' style={ { width: '90px' } }>
          开始时间
        </div>
        <div className='ganttview-vtheader-series-header-item-cell' style={ { width: '90px' } }>
          完成时间
        </div>
        <div className='ganttview-vtheader-series-header-item-cell' style={ { width: '90px' } }>
          工期(天)
        </div>
        <div className='ganttview-vtheader-series-header-item-cell' style={ { width: '50px' } }/>
      </div>
    );

    return (
      <div className='ganttview-vtheader-series-item' id={ issue.id } onClick={ (e) => { e.preventDefault(); mark(issue); } }>
        <div className='ganttview-vtheader-series-item-cell' style={ { textAlign: 'left', width: '400px' } }>
          <span style={ { paddingRight: '5px', paddingLeft: issue.parent && issue.parent.id ? '12px' : '0px', visibility: issue.hasSubtasks ? 'visible' : 'hidden', cursor: 'pointer' } }>
            { foldIssues.indexOf(issue.id) !== -1 ? <a href='#' onClick={ (e) => { e.preventDefault(); e.stopPropagation(); fold(issue.id) } }><i className='fa fa-plus-square-o'></i></a> : <a href='#' onClick={ (e) => { e.preventDefault(); e.stopPropagation(); fold(issue.id) } }><i className='fa fa-minus-square-o'></i></a> }
          </span>
          <a href='#' onClick={ (e) => { e.preventDefault(); e.stopPropagation(); show(issue.id) } } title={ issue.title }>
            <span style={ { marginLeft: '3px' } }>{ issue.title }</span>
          </a>
        </div>
        <div className='ganttview-vtheader-series-item-cell' style={ { width: '60px' } }>
          { issue.no }
        </div>
        <div className='ganttview-vtheader-series-item-cell' style={ { width: '90px' } }>
          { issue.assignee && issue.assignee.name || '-' }
        </div>
        { mode == 'progress' &&
        <div className='ganttview-vtheader-series-item-cell' style={ { width: '80px' } }>
          { issue.progress ? issue.progress + '%' : '0%' }
        </div> }
        { mode == 'status' &&
        <div className='ganttview-vtheader-series-item-cell' style={ { width: '80px' } }>
          { _.findIndex(states, { id: issue.state }) !== -1 ? <span className={ 'state-' + _.find(states, { id: issue.state }).category + '-label' }>{ _.find(states, { id: issue.state }).name }</span> : '-' }
        </div> }
        <div className='ganttview-vtheader-series-item-cell' style={ { width: '90px' } }>
          { issue.expect_start_time ? moment.unix(issue.expect_start_time).format('YYYY/MM/DD') : '-' }
        </div>
        <div className='ganttview-vtheader-series-item-cell' style={ { width: '90px' } }>
          { issue.expect_complete_time ? moment.unix(issue.expect_complete_time).format('YYYY/MM/DD') : '-' }
        </div>
        <div className='ganttview-vtheader-series-item-cell' style={ { width: '90px' } }>
          { issue.expect_complete_time && issue.expect_start_time ? this.getDuration(issue.expect_start_time, issue.expect_complete_time) : '-' }
        </div>
        <div className='ganttview-vtheader-series-item-cell' style={ { width: '50px' } }>
          <a href='#' onClick={ (e) => { e.preventDefault(); e.stopPropagation(); locate(issue.expect_start_time || issue.expect_complete_time || issue.created_at); } }>
            <i className='fa fa-dot-circle-o'></i>
          </a>
        </div>
      </div>);
  }
}
