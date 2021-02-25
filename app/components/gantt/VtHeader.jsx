import React, { PropTypes, Component } from 'react';
import _ from 'lodash';

const VtHeaderItem = require('./VtHeaderItem');

export default class VtHeader extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    collection: PropTypes.array.isRequired,
    foldIssues: PropTypes.array.isRequired,
    options: PropTypes.object.isRequired,
    mode: PropTypes.string.isRequired,
    show: PropTypes.func.isRequired,
    locate: PropTypes.func.isRequired,
    mark: PropTypes.func.isRequired,
    fold: PropTypes.func.isRequired
  }

  render() {
    const { 
      options,
      collection, 
      mode, 
      foldIssues, 
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
            { _.map(_.reject(collection, (v) => v.parent && foldIssues.indexOf(v.parent.id) != -1), (v, key) =>
              <VtHeaderItem
                options={ options }
                mode={ mode }
                show={ show }
                locate={ locate }
                mark={ mark }
                fold={ fold }
                foldIssues={ foldIssues }
                issue={ v }
                key={ v.id } />
            ) }
          </div>
        </div>
      </div>);
  }
}
