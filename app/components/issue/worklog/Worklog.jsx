import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import { Button, Form, FormControl, FormGroup, ControlLabel, Col, Panel, Label, Table, Checkbox } from 'react-bootstrap';
import _ from 'lodash';
import { getAgoAt } from '../../share/Funcs';

const img = require('../../../assets/images/loading.gif');
const moment = require('moment');

const AddWorklogModal = require('./AddWorklogModal');
const DelWorklogModal = require('./DelWorklogModal');

export default class Worklog extends Component {
  constructor(props) {
    super(props);
    this.state = { ecode: 0 };
    this.m2t = this.m2t.bind(this);
    this.t2m = this.t2m.bind(this);

    this.state.displayTimeFormat = window.localStorage && window.localStorage.getItem('worklogs-displayTimeFormat') || 'relative';
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    currentTime: PropTypes.number.isRequired,
    currentUser: PropTypes.object.isRequired,
    permissions: PropTypes.array.isRequired,
    issue: PropTypes.object.isRequired,
    options: PropTypes.object.isRequired,
    original_estimate: PropTypes.string,
    indexLoading: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    indexWorklog: PropTypes.func.isRequired,
    sort: PropTypes.string.isRequired,
    sortWorklog: PropTypes.func.isRequired,
    addWorklog: PropTypes.func.isRequired,
    editWorklog: PropTypes.func.isRequired,
    delWorklog: PropTypes.func.isRequired,
    collection: PropTypes.array.isRequired
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.indexLoading) {
      this.setState({ addWorklogShow: false });
    }
  }

  showEditWorklog(val) {
    this.setState({ addWorklogShow: true, selectedWorklog: val });
  }

  showAddWorklog() {
    this.setState({ addWorklogShow: true, selectedWorklog: {} });
  }

  showDelWorklog(val) {
    this.setState({ delWorklogShow: true, selectedWorklog: val });
  }

  t2m(val) {
    const { options={} } = this.props;
    const w2d = options.w2d || 5;
    const d2h = options.d2h || 8; 

    let total = 0;
    const tmp = val.split(' ');
    _.map (tmp, (v) => {
      const t = v.substr(0, v.length - 1);
      const u = v.substr(-1);
      if (u == 'w' || u == 'W') {
        total = _.add(total, t * w2d * d2h * 60);
      } else if (u == 'd' || u == 'D') {
        total = _.add(total, t * d2h * 60);
      } else if (u == 'h' || u == 'H') {
        total = _.add(total, t * 60);
      } else {
        total = _.add(total, t);
      }
    });

    return total;
  }

  m2t(val) {
    const { options={} } = this.props;
    const w2d = options.w2d || 5;
    const d2h = options.d2h || 8;

    const w2m = w2d * d2h * 60;
    const d2m = d2h * 60;
    const h2m = 60;

    const newTT = [];
    let new_remain_min = _.ceil(val);
    if (new_remain_min >= 0) {
      const new_weeknum = _.floor(new_remain_min / w2m);
      if (new_weeknum > 0) {
        newTT.push(new_weeknum + 'w');
      }
    }

    new_remain_min = new_remain_min % w2m;
    if (new_remain_min >= 0) {
      const new_daynum = _.floor(new_remain_min / d2m);
      if (new_daynum > 0){
        newTT.push(new_daynum + 'd');
      }
    }

    new_remain_min = new_remain_min % d2m;
    if (new_remain_min >= 0) {
      const new_hournum = _.floor(new_remain_min / h2m);
      if (new_hournum > 0) {
        newTT.push(new_hournum + 'h');
      }
    }

    new_remain_min = new_remain_min % h2m;
    if (new_remain_min > 0) {
      newTT.push(new_remain_min + 'm');
    }

    if (newTT.length <= 0) {
      newTT.push('0');
    }

    return newTT.join(' ');
  }

  swapTime() {
    if (this.state.displayTimeFormat == 'relative') {
      if (window.localStorage) {
        window.localStorage.setItem('worklogs-displayTimeFormat', 'absolute');
      }
      this.setState({ displayTimeFormat: 'absolute' });
    } else {
      if (window.localStorage) {
        window.localStorage.setItem('worklogs-displayTimeFormat', 'relative');
      }
      this.setState({ displayTimeFormat: 'relative' });
    }
  }

  render() {
    const { 
      i18n, 
      permissions, 
      currentTime, 
      currentUser, 
      issue, 
      indexWorklog, 
      sort,
      sortWorklog, 
      collection, 
      indexLoading, 
      loading, 
      addWorklog, 
      editWorklog, 
      delWorklog, 
      original_estimate='' } = this.props;

    let leave_estimate_m = undefined;
    if (original_estimate) {
      leave_estimate_m = this.t2m(original_estimate);  
    }

    if (sort === 'desc') {
      collection.reverse();
    }

    let spend_m = 0;
    _.map(collection, (v) => {
      spend_m = _.add(spend_m, this.t2m(v.spend));
      if (v.adjust_type == 1 && v.spend && leave_estimate_m !== undefined) {
        const spend_m = this.t2m(v.spend);
        leave_estimate_m = (leave_estimate_m - spend_m) > 0 ? (leave_estimate_m - spend_m) : 0;
      } else if (v.adjust_type == 3 && v.leave_estimate) {
        leave_estimate_m = this.t2m(v.leave_estimate);
      } else if (v.adjust_type == 4 && v.cut && leave_estimate_m !== undefined) {
        const cut_m = this.t2m(v.cut);
        leave_estimate_m = (leave_estimate_m - cut_m) > 0 ? (leave_estimate_m - cut_m) : 0;
      }
      _.extend(v, { leave_estimate_m });
      return v;
    });

    const last = _.last(collection);

    if (sort === 'desc') {
      collection.reverse();
    }
    //const rCollection = [];
    //_.map(collection, (val) => {
    //  rCollection.unshift(val);
    //});
   
    return (
      <Form horizontal style={ { padding: '0px 5px' } }>
        <FormGroup>
          <Col sm={ 12 } className={ indexLoading && 'hide' } style={ { marginTop: '15px', marginBottom: '10px' } }>
            <div>
              <span className='comments-button' title='Refresh' style={ { marginRight: '10px', float: 'right' } } disabled={ loading } onClick={ () => { indexWorklog(issue.id, this.state.sort) } }><i className='fa fa-refresh'></i> Refresh</span>
              <span className='comments-button' title='Sort' style={ { marginRight: '10px', float: 'right' } } onClick={ () => { sortWorklog() } }><i className='fa fa-sort'></i> Sort</span>
              { permissions.indexOf('add_worklog') !== -1 &&
              <span className='comments-button' title='添加' style={ { marginRight: '10px', float: 'right' } } disabled={ loading } onClick={ this.showAddWorklog.bind(this) }><i className='fa fa-plus'></i> 添加</span> }
              <span style={ { marginRight: '20px', float: 'right' } }>
                <Checkbox
                  style={ { paddingTop: '0px', minHeight: '18px' } }
                  checked={ this.state.displayTimeFormat == 'absolute' ? true : false }
                  onClick={ this.swapTime.bind(this) }>
                  Show absolute date
                </Checkbox>
              </span>
            </div>
          </Col>
          <Col sm={ 12 } className={ indexLoading && 'hide' }>
            <Table condensed hover responsive style={ { width: '96%', marginLeft: '10px', marginTop: '5px' } }>
              <thead>
                <tr>
                  <th>Original estimated time</th>
                  <th>Total spent time</th>
                  <th>Remaining time</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={ { fontWeight: 'bold' } }>{ original_estimate || '-' }</td>
                  <td style={ { color: '#ff4500', fontWeight: 'bold' } }>{ spend_m > 0 ? this.m2t(spend_m) : '0' }</td>
                  <td style={ { color: '#32cd32', fontWeight: 'bold' } }>{ collection.length <= 0 ? (original_estimate || '-') : (last.leave_estimate_m === undefined ? '-' : this.m2t(last.leave_estimate_m)) }</td>
                </tr>
              </tbody>
            </Table> 
          </Col>
          <Col sm={ 12 }>
          { indexLoading && <div style={ { width: '100%', textAlign: 'center', marginTop: '15px' } }><img src={ img } className='loading' /></div> }
          { collection.length <= 0 && !indexLoading ?
            <div style={ { width: '100%', textAlign: 'left', marginTop: '10px', marginLeft: '10px' } }>暂无工作记录。</div>
            :
            _.map(collection, (val, i) => {
              const header = ( <div style={ { fontSize: '12px' } }>
                <span dangerouslySetInnerHTML={ { __html: '<a title="' + (val.recorder && (val.recorder.name + '(' + val.recorder.email + ')')) + '">' + (val.recorder.id === currentUser.id ? '我' : val.recorder.name) + '</a> - ' + (this.state.displayTimeFormat == 'absolute' ? moment.unix(val.recorded_at).format('YYYY/MM/DD HH:mm:ss') : getAgoAt(val.recorded_at, currentTime)) + (val.edited_flag == 1 ? '<span style="color:red"> - Edited</span>' : '') } } />
                { ((val.recorder && currentUser.id === val.recorder.id && permissions.indexOf('delete_self_worklog') !== -1) 
                  || permissions.indexOf('delete_worklog') !== -1) &&  
                <span className='comments-button comments-edit-button' style={ { marginLeft: '7px', float: 'right' } } onClick={ this.showDelWorklog.bind(this, val) }><i className='fa fa-trash' title='Delete'></i></span> }
                { ((val.recorder && currentUser.id === val.recorder.id && permissions.indexOf('edit_self_worklog') !== -1) 
                  || permissions.indexOf('edit_worklog') !== -1) &&  
                <span className='comments-button comments-edit-button' style={ { marginLeft: '7px', float: 'right' } } onClick={ this.showEditWorklog.bind(this, val) }><i className='fa fa-pencil' title='Edit'></i></span> }
              </div> ); 
              let comments = val.comments ? _.escape(val.comments) : '-';
              comments = comments.replace(/(\r\n)|(\n)/g, '<br/>'); 

              return (
                <Panel header={ header } key={ i } style={ { margin: '5px' } }>
                  <Table condensed hover responsive>
                    <thead>
                      <tr>
                        <th>Start date</th>
                        <th>Spent time</th>
                        <th>Remaining time</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{ moment.unix(val.started_at).format('YYYY/MM/DD HH:mm:ss') }</td>
                        <td>{ val.spend || '-' }</td>
                        <td>{ val.leave_estimate_m === undefined ? '-' : this.m2t(val.leave_estimate_m) }</td>
                      </tr>
                    </tbody>
                  </Table>
                  <div style={ { marginLeft: '5px', lineHeight: '24px' } }>
                    <span style={ { width: '10%', float: 'left', fontWeight: 'bold' } }>Comments：</span>
                    <span style={ { width: '90%', float: 'left', whiteSpace: 'pre-wrap', wordWrap: 'break-word' } } dangerouslySetInnerHTML={ { __html: comments } }/>
                  </div>
                </Panel>) }) }
          </Col>
        </FormGroup>
        { this.state.addWorklogShow &&
          <AddWorklogModal show
            issue={ issue }
            close={ () => { this.setState({ addWorklogShow: false }) } }
            data={ this.state.selectedWorklog }
            loading = { loading }
            add={ addWorklog }
            edit={ editWorklog }
            i18n={ i18n }/> }
        { this.state.delWorklogShow &&
          <DelWorklogModal show
            issue={ issue }
            close={ () => { this.setState({ delWorklogShow: false }) } }
            data={ this.state.selectedWorklog }
            loading = { loading }
            del={ delWorklog }
            i18n={ i18n }/> }
      </Form>
    );
  }
}
