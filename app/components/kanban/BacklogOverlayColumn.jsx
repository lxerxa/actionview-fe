import React, { PropTypes, Component } from 'react';
import update from 'react/lib/update';
import _ from 'lodash';
import Bucket from './BacklogBucket';

const $ = require('$');

export default class OverlayColumn extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    sprintNo: PropTypes.number.isRequired,
    columns: PropTypes.array.isRequired,
    isEmpty: PropTypes.bool.isRequired,
    moveSprintIssue: PropTypes.func.isRequired,
    draggedIssue: PropTypes.object,
    options: PropTypes.object.isRequired
  }

  render() {
    const { 
      isEmpty, 
      draggedIssue, 
      sprintNo, 
      columns, 
      options, 
      moveSprintIssue 
    } = this.props;

    let headerHeight = 120 + 50;
    if ($('#main-header').css('display') == 'none') {
      headerHeight = 28 + 50; 
    }
    const winHeight = $(window).height();
    const cellHeight = _.min([ winHeight - headerHeight - 10 - _.max([46 - $('.board-container').scrollTop(), 0]), $('.board-columns').height() ]); 

    return (
      <div className='board-zone-overlay-column' style={ { pointerEvents: isEmpty ? 'none' : 'auto' } }>
        <div className='board-zone-table'>
          <div className='board-zone-row'>
          { !isEmpty && 
            <Bucket 
              sprintNo={ sprintNo }
              draggedIssue={ draggedIssue }
              moveSprintIssue={ moveSprintIssue }
              columns={ columns }
              height={ cellHeight }/> }
          </div>
        </div>
      </div> );
  }
}
