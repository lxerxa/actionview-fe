import React, { PropTypes, Component } from 'react';
import { OverlayTrigger, Popover, Grid, Row, Col, ControlLabel } from 'react-bootstrap';
import _ from 'lodash';

const moment = require('moment');

export default class Blocks extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    cellWidth: PropTypes.number.isRequired,
    blockHeight: PropTypes.number.isRequired,
    collection: PropTypes.array.isRequired,
    range: PropTypes.array.isRequired,
    foldIssues: PropTypes.array.isRequired,
    options: PropTypes.object.isRequired,
    mode: PropTypes.string.isRequired
  }

  render() {
    const { 
      cellWidth,
      blockHeight,
      collection, 
      range, 
      foldIssues, 
      options:{ states=[] },
      mode
    } = this.props;

    const origin = range[0];
    const stateColors = { new : '#ccc', inprogress: '#3db9d3', completed: '#3c9445' };

    return (
      <div className='ganttview-blocks'>
      { _.map(_.reject(collection, (v) => v.parent && foldIssues.indexOf(v.parent.id) != -1), (v, key) => {
        const popover=(
          <Popover id='popover-trigger-hover' style={ { maxWidth: '350px', padding: '15px 0px' } }>
            <Grid>
              <Row>
                <Col sm={ 4 } componentClass={ ControlLabel } style={ { textAlign: 'right' } }>主题</Col>
                <Col sm={ 8 }><div style={ { textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' } }>{ v.title }</div></Col>
              </Row>
              <Row>
                <Col sm={ 4 } componentClass={ ControlLabel } style={ { textAlign: 'right' } }>开始时间</Col>
                <Col sm={ 8 }>{ v.expect_start_time ? moment.unix(v.expect_start_time).format('YYYY/MM/DD') : <span style={ { fontStyle: 'italic', color: '#aaa' } }>未指定</span> }</Col>
              </Row>
              <Row>
                <Col sm={ 4 } componentClass={ ControlLabel } style={ { textAlign: 'right' } }>结束时间</Col>
                <Col sm={ 8 }>{ v.expect_complete_time ? moment.unix(v.expect_complete_time).format('YYYY/MM/DD') : <span style={ { fontStyle: 'italic', color: '#aaa' } }>未指定</span> }</Col>
              </Row>
              { mode == 'progress' &&
              <Row>
                <Col sm={ 4 } componentClass={ ControlLabel } style={ { textAlign: 'right' } }>进度</Col>
                <Col sm={ 8 }>{ v.progress ? v.progress + '%' : '0%' }</Col>
              </Row> }
              { mode == 'status' &&
              <Row>
                <Col sm={ 4 } componentClass={ ControlLabel } style={ { textAlign: 'right' } }>状态</Col>
                <Col sm={ 8 }>{ _.findIndex(states, { id: v.state }) != -1 ? <span className={ 'state-' + _.find(states, { id: v.state }).category + '-label' }>{ _.find(states, { id: v.state }).name }</span>: '-' }</Col>
              </Row> }
            </Grid>
          </Popover>);

        const start = moment.unix(v.expect_start_time || v.expect_complete_time || v.created_at).startOf('day').format('X');
        const end = moment.unix(v.expect_complete_time || v.expect_start_time || v.created_at).startOf('day').format('X');
        const size = (end - start) / 3600 / 24 + 1;
        const offset = (start - origin) / 3600 / 24;

        const width = size * cellWidth - 3;

        let backgroundColor = '#ccc';
        if (mode == 'progress') {
          if ((!v.expect_start_time || !v.expect_complete_time) && (!v.progress || v.progress < 100)) {
            backgroundColor = '#555';
          } else {
            backgroundColor = v.hasSubtasks ? '#65c16f' : '#3db9d3';
          }
        } else if (mode == 'status') {
          const stateInd = _.findIndex(states, { id: v.state });
          if (stateInd !== -1) {
            const category = states[stateInd].category;
            if ((!v.expect_start_time || !v.expect_complete_time) && category !== 'completed') {
              backgroundColor = '#555';
            } else {
              backgroundColor = stateColors[category];
            }
          }
        }

        const progressBGColor = v.hasSubtasks ? '#3c9445' : '#2898b0';

        return (
          <div className='ganttview-block-container' key={ v.id }>
            <OverlayTrigger trigger={ [ 'hover', 'focus' ] } rootClose placement='top' overlay={ popover }>
              { v.hasSubtasks && foldIssues.indexOf(v.id) === -1 ?
              <div className='ganttview-block-parent'
                id={ v.id }
                style={ { width: width + 'px', marginLeft: (offset * cellWidth + 1) + 'px' } }>
                <div className='ganttview-block-parent-left'/>
                <div className='ganttview-block-parent-right'/>
              </div>
              :
              <div
                className={ 'ganttview-block ' + (v.hasSubtasks ? '' : 'ganttview-block-movable') }
                id={ v.id }
                style={ { width: width + 'px', height: blockHeight + 'px', marginLeft: (offset * cellWidth + 1) + 'px', backgroundColor } }>
                { mode == 'progress' &&
                <div
                  className='ganttview-block-progress'
                  style={ { height: blockHeight + 'px', width: (width * _.min([ _.max([ v.progress || 0, 0 ]), 100 ]) / 100) + 'px', backgroundColor: progressBGColor } }/> }
              </div> }
            </OverlayTrigger>
          </div> ) } ) }
      </div> );
  }
}
