import React, { PropTypes, Component } from 'react';
import E from 'wangeditor';

class TextEditor extends React.Component {
  constructor(props) {
    super(props);
    this.editor = null;
  }

  static propTypes = {
    id: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    uploadUrl: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    defaultValue: PropTypes.string,
    value: PropTypes.string.isRequired
  }

  componentDidMount() {
    const { 
      id, 
      uploadUrl, 
      onChange, 
      onBlur, 
      value, 
      placeholder 
    } = this.props;

    this.editor = new E('#' + id);

    this.editor.config.uploadImgAccept = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];
    this.editor.config.uploadImgServer = uploadUrl;
    this.editor.config.uploadImgMaxLength = 10;
    this.editor.config.uploadImgShowBase64 = false;
    this.editor.config.zIndex = 500;
    this.editor.config.showFullScreen = false; 
    this.editor.config.menus = [ 'head', 'bold', 'foreColor', 'backColor', 'justify', 'list', 'table', 'indent', 'image', 'quote', 'undo', 'redo' ];

    this.editor.config.onchange = (newHtml) => {
      onChange(newHtml);
    }

    this.editor.config.placeholder = placeholder;

    this.editor.config.uploadImgHooks = {
      customInsert: function(insertImgFn, result) {
        if (result.ecode !== 0) {
          console.log('upload file error.');
          return;
        }

        let images = [];
        if (Array.isArray(result.data)) {
          images = result.data;
        } else {
          images = [ result.data ];
        }

        images.forEach((v) => {
          insertImgFn(v.filename + '/thumbnail');
        });

        //insertImgFn('https://dimg03.c-ctrip.com/images/200h14000000w7lok0724_D_769_510_Q100.jpg');
        //console.log('customInsert', result);
      }
    }

    this.editor.config.onblur = function (newHtml) {
      onBlur(newHtml);
    }

    this.editor.create();

    if (value) {
      this.editor.txt.html('<p>' + value  + '</p>');
    }
  }

  componentWillReceiveProps(nextProps) {
    //this.editor.txt.html(nextProps.value);
  }

  componentWillUnmount() {
    this.editor.destroy();
  }

  preview() {
    console.log('aabb');
  }

  render() {
    const { id } = this.props;

    return (
      <div 
        id={ id } 
        className='rich-text-editor'
        style={ { marginTop: '7px' } }/>
    );
  }
}

export default TextEditor;
