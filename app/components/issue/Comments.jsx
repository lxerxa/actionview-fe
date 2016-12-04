import React, { PropTypes, Component } from 'react';
import { Button, Form, FormControl, FormGroup, ControlLabel, Col, Panel } from 'react-bootstrap';
import _ from 'lodash';

const $ = require('$')
const img = require('../../assets/images/loading.gif');
const moment = require('moment');

export default class Comments extends Component {
  constructor(props) {
    super(props);
    this.state = { addCommentsShow: false, comments:  '' };
  }

  static propTypes = {
    issueId: PropTypes.string,
    indexLoading: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    indexComments: PropTypes.func.isRequired,
    addComments: PropTypes.func.isRequired,
    users: PropTypes.array.isRequired,
    collection: PropTypes.array.isRequired
  }

  showCommentsInputor() {
    this.setState({ addCommentsShow: true });
  }

  async addComments() {
    const { issueId, addComments } = this.props;
    const ecode = await addComments(issueId, { comments: this.state.comments }); 
    if (ecode === 0) {
      this.setState({ addCommentsShow: false, comments: '' });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.indexLoading) {
      this.setState({ addCommentsShow: false });
    }
  }

  componentDidUpdate() {
    const { users } = this.props;
    $('.comments-inputor textarea').atwho({
      at: '@',
      insertTpl: '${atwho-at}${name}',
      data: users
    });
  }

  render() {
    const { issueId, indexComments, collection, indexLoading, loading } = this.props;

    return (
      <Form horizontal>
        <FormGroup>
          <Col sm={ 12 }>
            <div style={ { margin: '5px', textAlign: 'right' } }>
              <Button bsStyle='link' disabled={ loading || indexLoading } onClick={ this.showCommentsInputor.bind(this) }><i className='fa fa-comment-o' title='添加备注'></i></Button>
              <Button bsStyle='link' disabled={ loading || indexLoading } onClick={ () => { indexComments(issueId) } }><i className='fa fa-refresh' title='刷新'></i></Button>
            </div>
          </Col>
          <Col sm={ 12 } className={ this.state.addCommentsShow || 'hide' }>
            <div className='comments-inputor'>
              <textarea style={ { height: '150px', width: '100%', borderColor: '#ccc' } } onChange={ (e) => { this.setState({ comments: e.target.value }) } } value={ this.state.comments }/>
            </div>
            <div style={ { textAlign: 'right', marginBottom: '10px' } }>
              <img src={ img } className={ loading ? 'loading' : 'hide' } />
              <Button style={ { marginRight: '10px' } } onClick={ this.addComments.bind(this) } disabled={ loading || _.isEmpty(_.trim(this.state.comments)) }>添加</Button>
              <Button style={ { marginRight: '5px' } } onClick={ () => { this.setState({ addCommentsShow: false }) } } disabled={ loading }>取消</Button>
            </div>
          </Col>
          <Col sm={ 12 }>
          { indexLoading && <div style={ { width: '100%', textAlign: 'center', marginTop: '10px' } }><img src={ img } className='loading' /></div> }
          { collection.length <= 0 && !indexLoading ?
            <div style={ { width: '100%', textAlign: 'left', marginTop: '10px', marginLeft: '10px' } }>暂无备注。</div>
            :
            _.map(collection, (val, i) => {
              const header = ( <div style={ { fontSize: '12px' } }>
                <span>{ (val.creator && val.creator.name) + '添加备注 - ' + (val.created_at && moment.unix(val.created_at).format('YYYY/MM/DD HH:mm')) }</span>
                <span style={ { marginRight: '5px', float: 'right' } }><i className='fa fa-trash' title='删除'></i></span>
                <span style={ { marginRight: '8px', float: 'right' } }><i className='fa fa-pencil' title='编辑'></i></span>
              </div> ); 

              return (
                <Panel header={ header } key={ i } style={ { margin: '5px' } }>
                  { val.contents || '-' }
                </Panel>) } ) }
          </Col>
        </FormGroup>
      </Form>
    );
  }
}
