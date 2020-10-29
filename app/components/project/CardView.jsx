import React, { PropTypes, Component } from 'react';
import { Label } from 'react-bootstrap';
import { findDOMNode } from 'react-dom';
import { AreaChart, Area } from 'recharts';

const xydata = [
  {
    name: 'Page A', uv: 4000, pv: 2400, amt: 2400
  },
  {
    name: 'Page B', uv: 3000, pv: 1398, amt: 2210
  },
  {
    name: 'Page A', uv: 4000, pv: 2400, amt: 2400
  },
  {
    name: 'Page B', uv: 3000, pv: 1398, amt: 2210
  },
  {
    name: 'Page A', uv: 4000, pv: 2400, amt: 2400
  },
  {
    name: 'Page B', uv: 3000, pv: 1398, amt: 2210
  },
  {
    name: 'Page C', uv: 2000, pv: 9800, amt: 2290
  },
  {
    name: 'Page D', uv: 2780, pv: 3908, amt: 2000
  },
  {
    name: 'Page E', uv: 1890, pv: 4800, amt: 2181
  },
  {
    name: 'Page F', uv: 2390, pv: 3800, amt: 2500
  },
  {
    name: 'Page G', uv: 3490, pv: 4300, amt: 2100
  }
];

export default class CardView extends Component {
  constructor(props) {
    super(props);
    this.state = { chartWidth: 0 };
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    model: PropTypes.object.isRequired,
    entry: PropTypes.func.isRequired,
    edit: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
    repopen: PropTypes.func.isRequired,
    createIndex: PropTypes.func.isRequired
  }

  componentDidMount() {
    this.setState({ chartWidth: findDOMNode(this).clientWidth });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ chartWidth: findDOMNode(this).clientWidth });
  }

  render() {
    const {
      user,
      model,
      entry,
      edit,
      closeNotify,
      reopen,
      createIndex
    } = this.props;

    return (
      <div className='col-lg-3 col-md-4 col-sm-6 col-xs-12 cardContainer'>
        <div className='card'>
          { model.status !== 'active' && <div className='status'><Label>已关闭</Label></div> }
          <div className='content'>
            <div className='title'>
              { model.status == 'active'
                ? <p className='name'><a href='#' title={ model.name } onClick={ (e) => { e.preventDefault(); entry(model.key); } }>{ model.key + ' - ' + model.name }</a></p>
                : <p className='name'>{ model.key + ' - ' + model.name }</p> }
            </div>
            <AreaChart
              width={ this.state.chartWidth }
              height={ 80 }
              data={ xydata }
              style={ { margin: '35px auto' } }>
              <Area type='monotone' dataKey='pv' stroke='#8884d8' fill='#8884d8' strokeWidth={ 1 } />
            </AreaChart>
            <div style={ { position: 'absolute', top: '125px', display: 'inline-block', width: '100%', textAlign: 'center', color: '#aaa', fontSize: '12px' } }>
               <div style={ { width: '33.33%', display: 'inline-block' } }>全部<br/><a href='#'>20</a></div>
               <div style={ { width: '33.33%', display: 'inline-block' } }>未解决<br/><a href='#'>20</a></div>
               <div style={ { width: '33.33%', display: 'inline-block' } }>分配给我<br/><a href='#'>20</a></div>
            </div>
          </div>
          <div className='leader'>
            <span>负责人: { model.principal.name }</span>
          </div>
          { model.principal.id === user.id &&
            <div className='btns'>
              { model.status == 'active' &&
                <span style={ { marginLeft: '3px' } } title='编辑' onClick={ edit } className='comments-button'><i className='fa fa-pencil' aria-hidden='true'></i></span> }
              { model.status == 'active' &&
                <span style={ { marginLeft: '3px' } } title='重建索引' onClick={ createIndex } className='comments-button'><i className='fa fa-refresh' aria-hidden='true'></i></span> }
              { model.status === 'active'
                ? <span style={ { marginLeft: '3px' } } title='关闭' onClick={ closeNotify } className='comments-button'><i className='fa fa-toggle-off' aria-hidden='true'></i></span>
                : <span style={ { marginLeft: '3px' } } title='重新打开' onClick={ reopen } className='comments-button'><i className='fa fa-toggle-on' aria-hidden='true'></i></span> }
            </div> }
        </div>
      </div>
    )
  }
}
