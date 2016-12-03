import React, { PropTypes, Component } from 'react';
import { Button, Form, FormControl, FormGroup, ControlLabel, Col } from 'react-bootstrap';
import _ from 'lodash';

const $ = require('$')

export default class Comments extends Component {
  constructor(props) {
    super(props);
    this.state = { addCommentsShow: false };
  }

  static propTypes = {
    collection: PropTypes.array.isRequired
  }

  showCommentsInputor() {
    this.setState({ addCommentsShow: true });
  }

  componentDidUpdate() {
    $('.comments-inputor textarea').atwho({
      at: '@',
      data: ['one', 'two', 'three']
    });
  }

  render() {
    const { collection } = this.props;

    return (
      <Form horizontal>
        <FormGroup>
          <Col sm={ 12 }>
            <div style={ { margin: '5px', textAlign: 'right' } }>
              <Button bsStyle='link' onClick={ this.showCommentsInputor.bind(this) }><i className='fa fa-comment-o'></i></Button>
              <Button bsStyle='link'><i className='fa fa-arrow-down'></i></Button>
              <Button bsStyle='link'><i className='fa fa-refresh'></i></Button>
            </div>
          </Col>
          <Col sm={ 12 } className={ this.state.addCommentsShow || 'hide' }>
            <div className='comments-inputor'>
              <textarea style={ { height: '150px', width: '100%', borderColor: '#ccc' } }/>
            </div>
            <div style={ { textAlign: 'right' } }>
              <Button style={ { marginRight: '10px' } }>添加</Button>
              <Button style={ { marginRight: '5px' } } onClick={ () => { this.setState({ addCommentsShow: false }) } }>取消</Button>
            </div>
          </Col>
        </FormGroup>
      </Form>
    );
  }
}
