import React, { PropTypes, Component } from 'react';
import { FormGroup, Col, Button, Label, Table, Panel } from 'react-bootstrap';
import { notify } from 'react-notify-toast';
import _ from 'lodash';

const img = require('../../assets/images/loading.gif');

const SyncNotify = require('./SyncNotify');
const MonthCard = require('./MonthCard');

export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      year: '',
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

  arrange() {
    const { collection } = this.props;

    const data = []; 
    for (let i = 1; i <= 12; i++) {
      const dates = _.filter(collection, { month : i });
      if (dates.length > 0) {
        data.push(dates);
      }
    }
    return data;
  }

  render() {
    const { options, sync, indexLoading, collection, loading } = this.props;

    let data = [];
    if (collection.length > 0) {
      data = this.arrange();
    }

    return (
      <div style={ { marginTop: '25px', height: '40px' } }>
        { this.state.year &&
        <div style={ { textAlign: 'center' } }>
          <Button title='上一年' onClick={ () => { this.switch(this.state.year - 1) } }>
            <span style={ { padding: '0px 5px' } }><i className='fa fa-angle-left fa-lg'></i></span>
          </Button>
          <span style={ { margin: '0px 15px', fontWeight: 600 } }>{ this.state.year }</span>
          <Button title='下一年' onClick={ () => { this.switch(_.add(this.state.year, 1)) } }><span style={ { padding: '0px 5px' } }>
            <i className='fa fa-angle-right fa-lg'></i></span>
          </Button>
        </div> } 
        { indexLoading && 
        <div style={ { textAlign: 'center', paddingTop: '50px' } }>
         <img src={ img } className='loading'/> 
        </div> }
        { !indexLoading && data.length > 0 &&
        <div>
          <FormGroup>
            { _.map(data, (val, key) => 
              <Col sm={ 4 } className='canlendarcontent'>
                <MonthCard
                  loading={ loading }
                  month={ _.add(key, 1) }
                  today={ options.date || '' }
                  dates={ val }/> 
              </Col> ) }
          </FormGroup>
        </div> }
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
