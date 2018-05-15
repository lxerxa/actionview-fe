import React, { PropTypes, Component } from 'react';
import { Button, Dropdown, MenuItem } from 'react-bootstrap'; 

export default class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = { open: false };
    this.onSelectMenu = this.onSelectMenu.bind(this);
  }

  static propTypes = {
    issueId: PropTypes.string.isRequired,
    issueNo: PropTypes.string.isRequired,
    hasRemove: PropTypes.bool,
    issueView: PropTypes.func,
    toTop: PropTypes.func,
    toBottom: PropTypes.func,
    removeFromSprint: PropTypes.func
  }

  onSelectMenu(eventKey) {
    const { issueId, issueNo, issueView, toTop, toBottom, removeFromSprint } = this.props;
    if (eventKey === 'issueView') {
      issueView(issueId);
    } else if (eventKey === 'toTop') {
      toTop(issueNo);
    } else if (eventKey === 'toBottom') {
      toBottom(issueNo);
    } else if (eventKey === 'removeFromSprint') {
      removeFromSprint(issueNo);
    }
  }

  render() {
    const { hasRemove } = this.props;

    return (
      <Dropdown 
        open
        style={ { position: 'fixed' } }
        onSelect={ this.onSelectMenu.bind(this) }>
        <Dropdown.Menu>
          <MenuItem eventKey='issueView'>查看</MenuItem>
          <MenuItem divider />
          <MenuItem eventKey='toTop'>移至顶部</MenuItem>
          <MenuItem eventKey='toBottom'>移至底部</MenuItem>
          { hasRemove && <MenuItem divider /> }
          { hasRemove && <MenuItem eventKey='removeFromSprint'>移出Sprint</MenuItem> }
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}

