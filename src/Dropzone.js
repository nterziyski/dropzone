import React, {useEffect, useState} from 'react';
import {useDropzone} from 'react-dropzone';
import { css, cx } from 'emotion'

const thumbsContainer = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 16
};

const thumb = {
  display: 'inline-flex',
  borderRadius: 2,
  border: '1px solid #eaeaea',
  marginBottom: 8,
  marginRight: 8,
  width: 300,
  height: 300,
  padding: 4,
  boxSizing: 'border-box'
};

const thumbInner = {
  display: 'flex',
  minWidth: 0,
  overflow: 'hidden'
};

const img = {
  display: 'block',
  width: 'auto',
  height: '100%'
};

const imgWrapper = css`
  display: inline-flex;
  border-radius: 2px;
  border: 1px solid gray;
  margin-bottom: 8px;
  margin-right: 8px;
  width: 300px;
  height: 300px;
  padding: 4px;
  box-sizing: border-box;
  &.is-selected {
    border-color: blue;
  }
`

function MyDropzone() {
  const [files, setFiles] = useState([]);
  const {getRootProps, getInputProps} = useDropzone({
    accept: 'image/*',
    onDrop: acceptedFiles => {
      setFiles(acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file),
        isSelected: false,
      })));
    }
  });

  const toggleSelected = index => {
    const localFilesCopy = files
    const selectedFile = localFilesCopy[index]
    selectedFile.isSelected = !selectedFile.isSelected
    localFilesCopy[index] = selectedFile
    setFiles([...localFilesCopy])
  }

  const thumbs = files.map(({ name, isSelected, preview }, index) => (
    <div className={cx(imgWrapper, { 'is-selected': isSelected })} key={name} onClick={() => toggleSelected(index)}>
      <div style={thumbInner}>
        <img
          src={preview}
          style={img}
        />
      </div>
    </div>
  ));

  useEffect(() => () => {
    // Make sure to revoke the data uris to avoid memory leaks
    files.forEach(file => URL.revokeObjectURL(file.preview));
  }, [files]);

  return (
    <>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
      <aside style={thumbsContainer}>
        {thumbs}
      </aside>
    </>
  )
}

export default MyDropzone
