import React, { ReactText, PropTypes, Component } from 'react';
import { Modal, Button } from 'react-bootstrap';
import _ from 'lodash';

var mermaidAPI = require('mermaid').mermaidAPI;

export default class PreviewModal extends Component {
  constructor(props) {
    super(props);
    mermaidAPI.initialize({
      startOnLoad:false
    });
  }

  static propTypes = {
    collection: PropTypes.array.isRequired,
    close: PropTypes.func.isRequired
  }

  render() {

    const { collection, close } = this.props;

    const allSteps = [];
    const startSteps = [];
    const endSteps = [];
    const tmpSteps = [];

    const stepNum = collection.length;
    for (let i = 0; i < stepNum; i++) {
      allSteps.push(collection[i].id);
      if (!collection[i].actions || collection[i].actions.length <= 0)
      {
        endSteps.push(collection[i].id);
        continue;
      }

      _.map(collection[i].actions, function(v) {
        _.map(v.results, function(v2) {
          tmpSteps.push(v2.step);
        });
      });
    }

    _.map(_.xor(allSteps, tmpSteps), function(v) {
      startSteps.push(v);
    });

    const isolatedSteps = _.intersection(startSteps, endSteps);

    let graphTxt = 'graph LR;';
    for (let i = 0; i < stepNum; i++) {

      if (_.indexOf(isolatedSteps, collection[i].id) !== -1) {
        graphTxt += collection[i].name + '((' +  collection[i].name + '));';
        continue;
      }

      _.map(collection[i].actions, function(v) {
        _.map(v.results, function(v2) {
          if (_.indexOf(startSteps, collection[i].id) !== -1) {
            graphTxt += collection[i].name + '((' + collection[i].name + '))';
          } else {
            graphTxt += collection[i].name;
          }

          graphTxt += '--' + v.name + '-->';

          if (_.indexOf(endSteps, v2.step) !== -1) {
            graphTxt += v2.step + '((' + _.find(collection, { id: v2.step }).name + '));';
          } else {
            graphTxt += _.find(collection, { id: v2.step }).name + ';';
          }
        });
      });
    }

    return (
      <Modal { ...this.props } onHide={ close } backdrop='static' bsSize='large' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>工作流预览</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='mermaid' dangerouslySetInnerHTML={ { __html: mermaidAPI.render('xxx', graphTxt) } } />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={ close }>取消</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
