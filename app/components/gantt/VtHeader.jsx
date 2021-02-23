import React, { PropTypes, Component } from 'react';
import _ from 'lodash';

const moment = require('moment');

export default class VtHeader extends Component {
  constructor(props) {
    super(props);
    this.getDuration = this.getDuration.bind(this);
  }

  static propTypes = {
    collection: PropTypes.array.isRequired,
    foldIssues: PropTypes.array.isRequired,
    markedIssue: PropTypes.object.isRequired,
    options: PropTypes.object.isRequired,
    mode: PropTypes.string.isRequired,
    show: PropTypes.func.isRequired,
    locate: PropTypes.func.isRequired,
    mark: PropTypes.func.isRequired,
    fold: PropTypes.func.isRequired
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
      collection, 
      mode, 
      foldIssues, 
      markedIssue,
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
      <div className='ganttview-vtheader'>
        <div className='ganttview-vtheader-item'>
          <div className='ganttview-vtheader-series' style={ { width: '950px' } }>
            { header }
            { _.map(_.reject(collection, (v) => v.parent && foldIssues.indexOf(v.parent.id) != -1), (v, key) => (
            <div className='ganttview-vtheader-series-item' key={ key } id={ v.id } onClick={ (e) => { e.preventDefault(); mark(v); } }>
              <div className='ganttview-vtheader-series-item-cell' style={ { textAlign: 'left', width: '400px' } }>
                <span style={ { paddingRight: '5px', paddingLeft: v.parent && v.parent.id ? '12px' : '0px', visibility: v.hasSubtasks ? 'visible' : 'hidden', cursor: 'pointer' } }>
                  { foldIssues.indexOf(v.id) !== -1 ? <a href='#' onClick={ (e) => { e.preventDefault(); e.stopPropagation(); fold(v.id) } }><i className='fa fa-plus-square-o'></i></a> : <a href='#' onClick={ (e) => { e.preventDefault(); e.stopPropagation(); fold(v.id) } }><i className='fa fa-minus-square-o'></i></a> }
                </span>
                <a href='#' onClick={ (e) => { e.preventDefault(); e.stopPropagation(); show(v.id) } } title={ v.title }>
                  <span style={ { marginLeft: '3px' } }>{ v.title }</span>
                </a>
              </div>
              <div className='ganttview-vtheader-series-item-cell' style={ { width: '60px' } }>
                { v.no }
              </div>
              <div className='ganttview-vtheader-series-item-cell' style={ { width: '90px' } }>
                { v.assignee && v.assignee.name || '-' }
              </div>
              { mode == 'progress' &&
              <div className='ganttview-vtheader-series-item-cell' style={ { width: '80px' } }>
                { v.progress ? v.progress + '%' : '0%' }
              </div> }
              { mode == 'status' &&
              <div className='ganttview-vtheader-series-item-cell' style={ { width: '80px' } }>
                { _.findIndex(states, { id: v.state }) !== -1 ? <span className={ 'state-' + _.find(states, { id: v.state }).category + '-label' }>{ _.find(states, { id: v.state }).name }</span> : '-' }
              </div> }
              <div className='ganttview-vtheader-series-item-cell' style={ { width: '90px' } }>
                { v.expect_start_time ? moment.unix(v.expect_start_time).format('YYYY/MM/DD') : '-' }
              </div>
              <div className='ganttview-vtheader-series-item-cell' style={ { width: '90px' } }>
                { v.expect_complete_time ? moment.unix(v.expect_complete_time).format('YYYY/MM/DD') : '-' }
              </div>
              <div className='ganttview-vtheader-series-item-cell' style={ { width: '90px' } }>
                { v.expect_complete_time && v.expect_start_time ? this.getDuration(v.expect_start_time, v.expect_complete_time) : '-' }
              </div>
              <div className='ganttview-vtheader-series-item-cell' style={ { width: '50px' } }>
                <a href='#' onClick={ (e) => { e.preventDefault(); e.stopPropagation(); locate(v.expect_start_time || v.expect_complete_time || v.created_at); } }>
                  <i className='fa fa-dot-circle-o'></i>
                </a>
              </div>
            </div> ) ) }
          </div>
        </div>
      </div>);
  }
}
