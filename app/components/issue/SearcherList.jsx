import React, { PropTypes, Component } from 'react';
import { Button, DropdownButton, MenuItem, Form, FormControl, FormGroup, ControlLabel, Col } from 'react-bootstrap';
import { Link } from 'react-router';
import _ from 'lodash';

export default class SearcherList extends Component {
  constructor(props) {
    super(props);
    this.state = { searcherShow: false };
  }

  static propTypes = {
    searcherShow: PropTypes.bool,
    options: PropTypes.object,
    indexLoading: PropTypes.bool.isRequired
  }

  render() {
    const { indexLoading, searcherShow=false, options: { config: { types=[], states=[], priorities=[], resolutions=[] } = {}, users=[] } } = this.props;

    const aa = [{ name: '分配给我的', link: 'aa' }, { name: '分配给我的', link: 'bb' }, { name: '分配给我的2', link: 'bb' }, { name: '分配给我的3', link: 'cc' }, { name: '分配给我的4', link: 'cc' }];

    return (
      <Form horizontal style={ { marginTop: '10px', marginBottom: '15px' } } className={ !searcherShow && 'hide' }>
        <FormGroup controlId='formControlsLabel'>
          { _.map(aa, (val) => 
            <Col sm={ 3 }>
              <span className='searcher'>
                <Link to={ val.link }>
                  <span style={ { color: '#3b73af' } }>{ val.name }</span>
                </Link>
                <span className='remove-icon'>
                  <i className='fa fa-remove'></i>
                </span>
              </span>
            </Col>) }
        </FormGroup>
      </Form>
    );
  }
}
