import React, { PropTypes, Component } from 'react';
import { Form, FormGroup, Col, Button } from 'react-bootstrap';
import { notify } from 'react-notify-toast';
import _ from 'lodash';

const img = require('../../assets/images/loading.gif');

const SyncNotify = require('./SyncNotify');
const ConfigSetModal = require('./ConfigSetModal');
const MonthCard = require('./MonthCard');

export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      year: '',
      selectedDay: '',
      setModalShow: false, 
      syncNotifyShow: false 
    };
    this.switch = this.switch.bind(this);
    this.arrange = this.arrange.bind(this);
  }

  static propTypes = {
    collection: PropTypes.array.isRequired,
    options: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    indexLoading: PropTypes.bool.isRequired,
    sync: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired,
    index: PropTypes.func.isRequired
  }

  async componentWillMount() {
    const { index } = this.props;
    await index();
    const { options } = this.props;
    this.setState({ year: options.year }); 
  }

  switch(year) {
    const { index } = this.props;
    if (year != this.state.year) {
      index(year);
      this.setState({ year });
    }
  }

  sync() {
    this.setState({ year: this.state.year, syncNotifyShow: true });
  }

  selectDay(day) {
    this.setState({ selectedDay: day, setModalShow: true });
  }

  arrange() {
    const { collection } = this.props;

    const data = [];
    let tmp = [];
    for (let i = 1; i <= 12; i++) {
      const dates = _.filter(collection, { month : i });
      if (dates.length > 0) {
        tmp.push(dates);
      }
      if (i % 3 === 0) {
        data.push(tmp);
        tmp = [];
      }
    }
    return data;
  }

  render() {
    const { options, sync, indexLoading, collection, update, loading } = this.props;

    let data = [];
    if (collection.length > 0) {
      data = this.arrange();
    }

    return (
      <div style={ { marginTop: '25px', height: '40px' } }>
        { this.state.year &&
        <div style={ { textAlign: 'center', marginBottom: '15px' } }>
          <Button title='上一年' onClick={ () => { this.switch(this.state.year - 1) } }>
            <span style={ { padding: '0px 5px' } }><i className='fa fa-angle-left fa-lg'></i></span>
          </Button>
          <span style={ { margin: '0px 15px', fontWeight: 600 } }>{ this.state.year }</span>
          <Button title='下一年' onClick={ () => { this.switch(_.add(this.state.year, 1)) } }><span style={ { padding: '0px 5px' } }>
            <i className='fa fa-angle-right fa-lg'></i></span>
          </Button>
          { options.year && this.state.year >= options.year && 
          <Button bsStyle='link' style={ { float: 'right' } } onClick={ () => { this.setState({ syncNotifyShow: true }) } }>
            日历同步
          </Button> }
        </div> } 
        { indexLoading && 
        <div style={ { textAlign: 'center', paddingTop: '50px' } }>
         <img src={ img } className='loading'/> 
        </div> }
        { !indexLoading && data.length > 0 &&
        <Form horizontal> 
          { _.map(data, (qdata, q) =>
            <FormGroup>
              { _.map(qdata, (mdata, k) =>
                <Col sm={ 4 } className='canlendarcontent'>
                  <MonthCard
                    select={ this.selectDay.bind(this) }
                    month={ _.add(q * 3, _.add(k, 1)) }
                    today={ options.date || '' }
                    dates={ mdata }/>
                </Col> ) }
            </FormGroup> ) }
        </Form> }
        { this.state.setModalShow &&
        <ConfigSetModal
          show
          close={ () => { this.setState({ setModalShow: false }) } }
          day={ this.state.selectedDay }
          loading={ loading }
          update={ update }/> }
        { this.state.syncNotifyShow &&
        <SyncNotify
          show
          close={ () => { this.setState({ syncNotifyShow: false }) } }
          year={ this.state.year }
          sync={ sync }/> }
      </div>
    );
  }
}
