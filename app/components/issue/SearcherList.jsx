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

    return (
      <Form horizontal style={ { marginTop: '10px', marginBottom: '30px' } } className={ !searchShow && 'hide' }>
        <FormGroup controlId='formControlsLabel'>
          <Col sm={ 3 }>
            <span className='searcher'>
              <Link to='aa'>
                <span style={ { color: '#3b73af' } }>分配给我的</span>
              </Link>
              <span className='remove-icon'>
                <i className='fa fa-remove'></i>
              </span>
            </span>
          </Col>
        </FormGroup>
      </Form>
    );
  }
}
