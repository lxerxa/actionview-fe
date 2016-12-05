import React, { PropTypes, Component } from 'react';
import { Button, Form, FormControl, FormGroup, ControlLabel, Col, Panel, Label } from 'react-bootstrap';
import _ from 'lodash';

const $ = require('$')
const img = require('../../assets/images/loading.gif');
const moment = require('moment');

export default class Comments extends Component {
  constructor(props) {
    super(props);
    this.state = { addCommentsShow: false, contents:  '', atWho: [] };
    this.addAtWho = this.addAtWho.bind(this);
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
    const { issueId, addComments, users } = this.props;
    const newAtWho = [];
    _.map(_.uniq(this.state.atWho), (val) => {
      const user = _.find(users, { id: val });
      if (this.state.contents.indexOf('@' + user.name) !== -1) {
        newAtWho.push(val);
      }
    });
    const ecode = await addComments(issueId, { contents: this.state.contents, atWho: _.map(newAtWho, (v) => _.find(users, { id: v }) ) }); 
    if (ecode === 0) {
      this.setState({ addCommentsShow: false, contents: '', atWho: [] });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.indexLoading) {
      this.setState({ addCommentsShow: false, contents: '', atWho: [] });
    }
  }

  addAtWho(user) {
    this.state.atWho.push(user.id);
  }

  componentDidUpdate() {
    const { users } = this.props;
    const self = this;
    $('.comments-inputor textarea').atwho({
      at: '@',
      searchKey: 'nameAndEmail',
      displayTpl: '<li>${nameAndEmail}</li>',
      insertTpl: '${nameAndEmail}',
      callbacks: {
        beforeInsert: function(value, $li) {
          const user = _.find(users, { nameAndEmail: value });
          if (user) {
            self.state.atWho.push(user.id);
          }
          return '@' + user.name;
        }
      },
      data: users
    });
    $('.comments-inputor textarea').on('inserted.atwho', function(event, flag, query) {
      self.setState({ contents: event.target.value });
    });
  }

  render() {
    const { issueId, indexComments, collection, indexLoading, loading } = this.props;

    return (
      <Form horizontal>
        <FormGroup>
          <Col sm={ 12 } className={ indexLoading && 'hide' }>
            <div style={ { margin: '5px', textAlign: 'right' } }>
              <Button bsStyle='link' disabled={ loading } onClick={ this.showCommentsInputor.bind(this) }><i className='fa fa-comment-o'></i> 添加备注</Button>
              <Button bsStyle='link' disabled={ loading } onClick={ () => { indexComments(issueId) } }><i className='fa fa-refresh'></i> 刷新</Button>
            </div>
          </Col>
          <Col sm={ 12 } className={ this.state.addCommentsShow || 'hide' }>
            <div className='comments-inputor'>
              <textarea style={ { height: '150px', width: '100%', borderColor: '#ccc', borderRadius: '4px' } } onChange={ (e) => { this.setState({ contents: e.target.value }) } } value={ this.state.contents }/>
            </div>
            <div style={ { textAlign: 'right', marginBottom: '10px' } }>
              <img src={ img } className={ loading ? 'loading' : 'hide' } />
              <Button style={ { marginRight: '10px', marginLeft: '10px' } } onClick={ this.addComments.bind(this) } disabled={ loading || _.isEmpty(_.trim(this.state.contents)) }>添加</Button>
              <Button style={ { marginRight: '5px' } } onClick={ () => { this.setState({ addCommentsShow: false }) } } disabled={ loading }>取消</Button>
            </div>
          </Col>
          <Col sm={ 12 }>
          { indexLoading && <div style={ { width: '100%', textAlign: 'center', marginTop: '15px' } }><img src={ img } className='loading' /></div> }
          { collection.length <= 0 && !indexLoading ?
            <div style={ { width: '100%', textAlign: 'left', marginTop: '10px', marginLeft: '10px' } }>暂无备注。</div>
            :
            _.map(collection, (val, i) => {
              const header = ( <div style={ { fontSize: '12px' } }>
                <span>{ (val.creator && val.creator.name) + '添加备注 - ' + (val.created_at && moment.unix(val.created_at).format('YYYY/MM/DD HH:mm')) }</span>
                <span style={ { marginRight: '5px', float: 'right', cursor: 'pointer' } }><i className='fa fa-trash' title='删除'></i></span>
                <span style={ { marginRight: '8px', float: 'right', cursor: 'pointer' } }><i className='fa fa-pencil' title='编辑'></i></span>
              </div> ); 
              let contents = val.contents || '-';
              _.map(val.atWho || [], (v) => {
                contents = contents.replace(eval('/@' + v.name + '/'), '<a title="' + v.nameAndEmail + '">@' + v.name + '</a>');
              });
              contents = contents.replace(/(\r\n)|(\n)/g, '<br/>'); 

              return (
                <Panel header={ header } key={ i } style={ { margin: '5px' } }>
                  <span dangerouslySetInnerHTML={ { __html: contents } }/>
                </Panel>) } ) }
          </Col>
        </FormGroup>
      </Form>
    );
  }
}
