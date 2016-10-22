import React, { PropTypes, Component } from 'react';
import { Button, DropdownButton, MenuItem, Form, FormControl, FormGroup, ControlLabel, Col } from 'react-bootstrap';
import { Link } from 'react-router';
import _ from 'lodash';

const DelSearcherModal = require('./DelSearcherModal');

export default class SearcherList extends Component {
  constructor(props) {
    super(props);
    this.state = { delSearcherShow: false, data: {} };
    this.delSearcherModalClose = this.delSearcherModalClose.bind(this);
  }

  static propTypes = {
    searcherShow: PropTypes.bool,
    options: PropTypes.object,
    delSearcher: PropTypes.func,
    refresh: PropTypes.func,
    hide: PropTypes.func,
    sqlTxt: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    indexLoading: PropTypes.bool.isRequired
  }

  delSearcherModalClose() {
    this.setState({ delSearcherShow: false });
  }

  render() {
    const { indexLoading, loading, searcherShow=false, refresh, hide, options: { searchers=[] } = {}, delSearcher, sqlTxt } = this.props;

    //const aa = [{ name: '分配给我的', link: 'aa' }, { name: '分配给我的', link: 'bb' }, { name: '分配给我的2', link: 'bb' }, { name: '分配给我的3', link: 'cc' }, { name: '分配给我的4', link: 'cc' }];

    return (
      <Form horizontal style={ { marginTop: '10px', marginBottom: '15px' } } className={ !searcherShow && 'hide' }>
        <FormGroup controlId='formControlsLabel'>
          { searchers.length <= 0 ?
            <Col sm={ 12 }>
              <span className='searcher'>暂无过滤器显示。</span>
            </Col> :
            _.map(searchers, (val, i) => 
            <Col sm={ 3 } key={ i }>
              <span className='searcher'>
                <span onClick={ () => { hide(); refresh(val.query); } } style={ { cursor: 'pointer', color: '#3b73af' } }>{ val.name }</span>
                <span className='remove-icon' onClick={ () => { this.setState({ delSearcherShow: true, data: val }) } }>
                  <i className='fa fa-remove'></i>
                </span>
              </span>
            </Col>) }
        </FormGroup>
        { this.state.delSearcherShow && <DelSearcherModal show close={ this.delSearcherModalClose } del={ delSearcher } data={ this.state.data } loading={ loading } sqlTxt={ sqlTxt }/> }
      </Form>
    );
  }
}
