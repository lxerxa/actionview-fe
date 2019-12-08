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
  }

  static propTypes = {
    collection: PropTypes.array.isRequired,
    options: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    indexLoading: PropTypes.bool.isRequired,
    sync: PropTypes.func.isRequired,
    set: PropTypes.func.isRequired,
    index: PropTypes.func.isRequired
  }

  componentWillMount() {
    const { index, options } = this.props;
    index(options.year);
    this.state.year = options.year; 
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

  render() {
    const { sync, collection, loading } = this.props;

    if (collection.length <= 0) {
      return (<div/>);
    }

    return (
      <div style={ { marginTop: '25px', height: '40px' } }>
        <div style={ { textAlign: 'center' } }>
          <Button><span style={ { padding: '0px 5px' } } title='上一年'><i className='fa fa-angle-left fa-lg'></i></span></Button>
          <span style={ { margin: '0px 15px', fontWeight: 600 } }>2019</span>
          <Button><span style={ { padding: '0px 5px' } }><i className='fa fa-angle-right fa-lg'></i></span></Button>
        </div> 
        <div>
          <FormGroup>
            <Col sm={ 4 } className='canlendarcontent'>
              <MonthCard
                loading={ loading }
                month={ 1 }
                dates={ _.filter(collection, { month: 1 }) }/> 
            </Col>
            <Col sm={ 4 } className='canlendarcontent'>
              <MonthCard
                loading={ loading }
                month={ 1 }
                dates={ _.filter(collection, { month: 1 }) }/> 
            </Col>
            <Col sm={ 4 } className='canlendarcontent'>
              <MonthCard
                loading={ loading }
                month={ 1 }
                dates={ _.filter(collection, { month: 1 }) }/> 
            </Col>
            <Col sm={ 4 } className='canlendarcontent'>
              <MonthCard
                loading={ loading }
                month={ 1 }
                dates={ _.filter(collection, { month: 1 }) }/> 
            </Col>
            <Col sm={ 4 } className='canlendarcontent'>
              <MonthCard
                loading={ loading }
                month={ 1 }
                dates={ _.filter(collection, { month: 1 }) }/> 
            </Col>
            <Col sm={ 4 } className='canlendarcontent'>
              <MonthCard
                loading={ loading }
                month={ 1 }
                dates={ _.filter(collection, { month: 1 }) }/> 
            </Col>
          </FormGroup>
        </div>
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
