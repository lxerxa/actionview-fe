import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import { Table, Button, Form, FormControl, FormGroup, ControlLabel, Col, Panel } from 'react-bootstrap';
import _ from 'lodash';

const img = require('../../../assets/images/loading.gif');
const getAgoAt = require('../../share/AgoAt');

export default class GitCommits extends Component {
  constructor(props) {
    super(props);
    this.state = { ecode: 0 };
  }

  static propTypes = {
    issue_id: PropTypes.string,
    currentTime: PropTypes.number.isRequired,
    currentUser: PropTypes.object.isRequired,
    indexLoading: PropTypes.bool.isRequired,
    indexGitCommits: PropTypes.func.isRequired,
    sortGitCommits: PropTypes.func.isRequired,
    collection: PropTypes.array.isRequired
  }

  render() {
    const { issue_id, currentTime, currentUser, indexGitCommits, sortGitCommits, collection, indexLoading } = this.props;

    return (
      <Form horizontal>
        <FormGroup>
          <Col sm={ 12 } className={ indexLoading && 'hide' } style={ { marginTop: '15px', marginBottom: '10px' } }>
            <div>
              <span className='comments-button' title='刷新' style={ { marginRight: '10px', float: 'right' } } onClick={ () => { indexGitCommits(issue_id, this.state.sort) } }><i className='fa fa-refresh'></i> 刷新</span>
              <span className='comments-button' title='排序' style={ { marginRight: '10px', float: 'right' } } onClick={ () => { sortGitCommits() } }><i className='fa fa-sort'></i> 排序</span>
            </div>
          </Col>
          <Col sm={ 12 }>
          { indexLoading && <div style={ { width: '100%', textAlign: 'center', marginTop: '15px' } }><img src={ img } className='loading' /></div> }
          { collection.length <= 0 && !indexLoading ?
            <div style={ { width: '100%', textAlign: 'left', marginTop: '10px', marginLeft: '10px' } }>暂无数据。</div>
            :
            _.map(collection, (val, i) => {
              const header = ( <div style={ { fontSize: '12px' } }>
                <span dangerouslySetInnerHTML= { { __html: '<a title="' + (val.author && (val.author.name + '(' + val.author.email + ')')) + '">' + (val.author && val.author.id === currentUser.id ? '我' : val.author.name) + '</a> 提交代码 - ' + getAgoAt(val.committed_at, currentTime) } } />
              </div> ); 

              return (
                <Panel header={ header } key={ i } style={ { margin: '5px' } }>
                  <Table condensed hover responsive>
                    <tr>
                      <td style={ { width: '125px' } }>
                        <div style={ { textAlign: 'right', fontWeight: 600, paddingRight: '10px' } }>
                          Repository 
                        </div>
                      </td>
                      <td>
                        <div style={ { whiteSpace: 'pre-wrap', wordWrap: 'break-word' } }>
                          <a href={ val.repo.homepage } target='_blank'>{ val.repo.name }</a>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td style={ { width: '125px' } }>
                        <div style={ { textAlign: 'right', fontWeight: 600, paddingRight: '15px' } }>
                          Branch
                        </div>
                      </td>
                      <td>
                        <div style={ { whiteSpace: 'pre-wrap', wordWrap: 'break-word' } }>
                          <a href={ val.repo.homepage + '/tree/' + val.branch } target='_blank'>{ val.branch }</a>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td style={ { width: '125px' } }>
                        <div style={ { textAlign: 'right', fontWeight: 600, paddingRight: '15px' } }>
                          Sha
                        </div>
                      </td>
                      <td>
                        <div style={ { whiteSpace: 'pre-wrap', wordWrap: 'break-word' } }>
                          <a href={ val.repo.homepage + '/commit/' + val.sha } target='_blank'>{ val.sha }</a>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td style={ { width: '125px', verticalAlign: 'top' } }>
                        <div style={ { textAlign: 'right', fontWeight: 600, paddingRight: '15px' } }>
                          Message 
                        </div>
                      </td>
                      <td>
                        <div style={ { whiteSpace: 'pre-wrap', wordWrap: 'break-word' } }>
                          { val.message }
                        </div>
                      </td>
                    </tr>
                    { val.added && val.added.length > 0 &&
                    <tr>
                      <td style={ { width: '125px', verticalAlign: 'top' } }>
                        <div style={ { textAlign: 'right', fontWeight: 600, paddingRight: '15px' } }>
                          Added 
                        </div>
                      </td>
                      <td>
                        <ul className='list-unstyled clearfix' style={ { marginBottom: '0px' } }>
                        { _.map(val.added, (v, i) => 
                          <li style={ { whiteSpace: 'pre-wrap', wordWrap: 'break-word' } } key={ i }>
                            <a href={ val.repo.homepage + '/blob/' + val.sha + '/' + v } target='_blank'>{ v }</a>
                          </li> ) }
                        </ul>
                      </td>
                    </tr> }
                    { val.modified && val.modified.length > 0 &&
                    <tr>
                      <td style={ { width: '125px', verticalAlign: 'top' } }>
                        <div style={ { textAlign: 'right', fontWeight: 600, paddingRight: '15px' } }>
                          Modified 
                        </div>
                      </td>
                      <td>
                        <ul className='list-unstyled clearfix' style={ { marginBottom: '0px' } }>
                        { _.map(val.modified, (v, i) => 
                          <li style={ { whiteSpace: 'pre-wrap', wordWrap: 'break-word' } } key={ i }>
                            <a href={ val.repo.homepage + '/blob/' + val.sha + '/' + v } target='_blank'>{ v }</a>
                          </li> ) }
                        </ul>
                      </td>
                    </tr> }
                    { val.removed && val.removed.length > 0 &&
                    <tr>
                      <td style={ { width: '125px' } }>
                        <div style={ { textAlign: 'right', fontWeight: 600, paddingRight: '15px' } }>
                          Removed
                        </div>
                      </td>
                      <td>
                        <ul className='list-unstyled clearfix' style={ { marginBottom: '0px' } }>
                        { _.map(val.removed, (v, i) => 
                          <li style={ { whiteSpace: 'pre-wrap', wordWrap: 'break-word' } } key={ i }>
                            <span style={ { textDecoration: 'line-through' } }>{ v }</span>
                          </li> ) }
                        </ul>
                      </td>
                    </tr> }
                  </Table>
                </Panel>) } ) }
          </Col>
        </FormGroup>
      </Form>
    );
  }
}
