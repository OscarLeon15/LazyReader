
import React from 'react'
import 'react-dropzone-uploader/dist/styles.css'
import Dropzone from 'react-dropzone-uploader'
import axios from 'axios'
// import file from '../img/file.svg'
import ocrSpaceApi from 'ocr-space-api';

export default class MyUploader extends React.Component {

  constructor() {
    super();
    this.state = {
      file: null

    }
  }


  // specify upload params and url for your files
  getUploadParams = ({ meta }) => { return { url: 'https://httpbin.org/post' } }

  // called every time a file's `status` changes
  handleChangeStatus = ({ meta, file }, status) => {
    this.setState({
      file: file
    })
    // console.log(status, meta, file);
  }

  // receives array of files that are done uploading when submit button is clicked
  handleSubmit = (files, allFiles) => {
    console.log(files.map(f => f.meta))
    allFiles.forEach(f => f.remove())

    // e.preventDefault();
    let blah = new FormData();
    blah.append('theImage', this.state.file)

    axios.post('http://localhost:5000/testing', blah)
      // router.post(req, res, next, uplaodCloud.single('theImage') ,()=>{})

      .then(responseFromTheBackend => {

        console.log(responseFromTheBackend.data)

      let  options =  { 
          apikey: process.env.REACT_APP_OCR,
          language: 'eng', // Português
          imageFormat: 'image/png', // Image Type (Only png ou gif is acceptable at the moment i wrote this)
          isOverlayRequired: true
        };

        // Image file to upload
        let imageFilePath = responseFromTheBackend.data;
       
      
      // Run and wait the result
    
      ocrSpaceApi.parseImageFromLocalFile(imageFilePath, options)

          .then( (parsedResults) => {
            console.log(parsedResults)
            console.log('parsedText: \n', parsedResults.parsedText);
            console.log('ocrParsedResults: \n', parsedResults.ocrParsedResult);
          }).catch( (err) => {
            console.log('ERROR:', err);
          });
      
      })
  
      .catch(err => console.log("error from inside BLAH", err))
  }

  render() {
    return (
      <div className="container has-text-centered	">
        <h1 className="has-text-grey-dark	has-text-weight-semibold is-size-4">The best app to convert academic journals to audio.</h1>
        {/* <img src={file} alt="file icon" /> */}
        <Dropzone
          getUploadParams={this.getUploadParams}
          onChangeStatus={this.handleChangeStatus}
          onSubmit={this.handleSubmit}
          accept="image/*,audio/*,video/*"
        />
      </div>
    )
  }

}

