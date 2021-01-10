import React, { PropTypes, Component } from 'react';

const inlineAttachment = require('inlineAttachment2');
const SimpleMDE = require('SimpleMDE');

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
    disabled: PropTypes.bool,
    value: PropTypes.string.isRequired
  }

  componentDidMount() {
    const { 
      id, 
      uploadUrl, 
      onChange, 
      onBlur, 
      value, 
      disabled,
      placeholder 
    } = this.props;

    const DOM = document.getElementById(id);

    this.editor = new SimpleMDE({
      element: DOM,
      placeholder: placeholder,
      previewRender: (text) => this.editor.markdown(text),
      autoDownloadFontAwesome: false,
      showIcons: ['table'],
      hideIcons: ['side-by-side', 'fullscreen'],
      spellChecker: false,
      status: false
    }); 

    const self = this;
    this.editor.codemirror.on('change', function() {
      onChange(self.editor.value());
    });

    this.editor.codemirror.on('blur', function() {
      onBlur();
    });

    this.editor.value(value || '');

    const inlineAttachmentConfig = {
      allowedTypes: ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'],
      uploadUrl: uploadUrl 
    };
    inlineAttachment.editors.codemirror4.attach(this.editor.codemirror, inlineAttachmentConfig);
  }

  componentWillReceiveProps(nextProps) {
    this.editor.codemirror.options.readOnly = nextProps.disabled && true;
  }

  componentWillUnmount() {
    delete this.editor.codemirror;
    delete this.editor;
  }

  //componentDidUpdate(preProps) {
  //  if (preProps.id != this.props.id) {
  //    delete this.editor.codemirror;
  //    delete this.editor;
  //    const parentNode = document.getElementById(this.props.id + '-parent'); 
  //    parentNode.innerHTML = '<textarea id="' + this.props.id + '"></textarea>';
  //    this.create();
  //  }
  //}

  render() {
    const { id } = this.props;

    return (
      <div className='rich-text-editor markdown-body'>
        <textarea id={ id }></textarea>
      </div>
    );
  }
}

export default TextEditor;
