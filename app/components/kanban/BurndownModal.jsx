import React, { PropTypes, Component } from 'react';
import { Modal, ButtonGroup, Button } from 'react-bootstrap';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Checkbox, CheckboxGroup } from 'react-checkbox-group';
import { notify } from 'react-notify-toast';
import _ from 'lodash';

const img = require('../../assets/images/loading.gif');

const series = [
  { name: '参考值', stroke: '#999', data: [] },
  { name: '剩余值', stroke: '#d04437', data: [] }
];

export default class PreviewModal extends Component {
  constructor(props) {
    super(props);
    this.state = { display: [], mode: 'issueCount' };
    this.handleCancel = this.handleCancel.bind(this);
  }

  static propTypes = {
    close: PropTypes.func.isRequired,
    getSprintLog: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    data: PropTypes.object.isRequired,
    no: PropTypes.number.isRequired
  }

  handleCancel() {
    const { close } = this.props;
    close();
  }

  diplayChanged(newValue) {
    this.setState({ display: newValue });
  }

  async componentWillMount() {
    const { no, getSprintLog } = this.props;
    const ecode = await getSprintLog(no);
    if (ecode !== 0) {
      notify.show('获取数据失败。', 'error', 2000);
    }
  }

  render() {
    const { no, data, loading } = this.props;

    let newData = {};
    if (!_.isEmpty(data)) {
      if (this.state.mode === 'storyPoints') {
        newData = data.story_points;
      } else {
        newData = data.issue_count;
      }

      if (_.indexOf(this.state.display, 'notWorkingShow') === -1) {
        series[0].data = _.map(_.reject(newData.guideline || [], (v) => { return v.notWorking === 1 }), (v) => { return { category: v.day, value: v.value } });
        series[1].data = _.map(_.reject(newData.remaining || [], (v) => { return v.notWorking == 1 }), (v) => { return { category: v.day, value: v.value } });
      } else {
        series[0].data = _.map(newData.guideline || [], (v) => { return { category: v.day, value: v.value } });
        series[1].data = _.map(newData.remaining || [], (v) => { return { category: v.day, value: v.value } });
      }
    }

    return (
      <Modal { ...this.props } onHide={ this.handleCancel } backdrop='static' bsSize='large' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>燃尽图{ ' - ' + 'Sprint ' + no }</Modal.Title>
        </Modal.Header>
        { loading &&
        <Modal.Body style={ { height: '420px', overflow: 'auto' } }>
          <div style={ { textAlign: 'center', marginTop: '120px' } }>
            <img src={ img } className='loading'/>
          </div>
        </Modal.Body> }
        { !loading &&
        <Modal.Body style={ { height: '420px', overflow: 'auto' } }>
          <ButtonGroup style={ { float: 'right', marginRight: '110px' } }>
            <Button title='问题数' style={ { backgroundColor: this.state.mode == 'issueCount' && '#eee' } } onClick={ ()=>{ this.setState({ mode: 'issueCount' }) } }>问题数</Button>
            <Button title='故事点' style={ { backgroundColor: this.state.mode == 'storyPoints' && '#eee' } } onClick={ ()=>{ this.setState({ mode: 'storyPoints' }) } }>故事点</Button>
          </ButtonGroup> 
          <CheckboxGroup style={ { float: 'right', marginTop: '8px', marginRight: '10px' } } name='notifications' value={ this.state.display } onChange={ this.diplayChanged.bind(this) }>
            <Checkbox value='notWorkingShow'/>
            <span style={ { marginLeft: '3px' } }>显示非工作日</span>
          </CheckboxGroup>
          <LineChart width={ 760 } height={ 340 } style={ { marginTop: '45px' } }>
            <XAxis dataKey='category' type='category' allowDuplicatedCategory={ false } />
            <YAxis dataKey='value'/>
            <CartesianGrid strokeDasharray='3 3'/>
            <Tooltip/>
            <Legend />
            { series.map(s => (
              <Line dataKey='value' data={ s.data } stroke={ s.stroke } name={ s.name } key={ s.name } />
            )) }
          </LineChart>
        </Modal.Body> }
        <Modal.Footer>
          <Button onClick={ this.handleCancel }>关闭</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
