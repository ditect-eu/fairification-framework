import React from "react";
import UploadForm1 from "./UploadForm1";
import UploadForm2 from "./UploadForm2";
import UploadForm3 from "./UploadForm3";

type MyProps = {
};
type UploadFormState = { currentStep: number,
                         formData: any,
                         open: boolean
                       };
export default class MainUploadForm extends React.Component<MyProps, UploadFormState> {

  constructor(props: any) {
    super(props)
    this._next = this._next.bind(this)
    this._prev = this._prev.bind(this)

    this.state = {
      currentStep: 1,
      formData: {},
      open: false
    }
  }

  submitForm = (e: any) => {
    let formData: any = e.formData; //Scoped variable as the state variable is not updated immediately.
    this.setState({
      formData: e.formData
    })
    const formDataWrapper = new FormData();
    const bearerToken = '';
    console.log(JSON.stringify(formData));
    let file: any = formData.DataSetLocation.File
    delete formData.DataSetLocation.File;
    if(formData.DataSetLocation["Is your dataset available online?"]
        === "No, I will upload the object from my local drive") {
        var byteString = atob(file.split(',')[1]);
        var mimeString = file.split(',')[0].split(':')[1].split(';')[0]
        var nameString = file.split(',')[0].split(';')[1].split('=')[1]
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        var blob = new Blob([ab], {type: mimeString});
        formDataWrapper.append('file', blob, nameString);
    }
    formDataWrapper.append('DataSet', new Blob([JSON.stringify(formData)], {
        type: 'application/json'
    }));

    fetch('/api/register-single-object', {
        method: 'POST',
        headers: {
            'Authorization': bearerToken,
            'Accept': '*/*',
        },
        body: formDataWrapper
    })
        .then(response => {
            if (response.ok) {
              window.scrollTo(0, 0)
              this.setState({
                open: true
              })
            } else {
                console.log("response not ok: " + JSON.stringify(response));
            }
        })
        .catch(error => {
            console.log("error: " + JSON.stringify(error));
        });
  }

  _next() {
    let currentStep = this.state.currentStep
    currentStep = currentStep >= 2? 3: currentStep + 1
    this.setState({
      currentStep: currentStep
    })
  }

  _prev() {
    let currentStep = this.state.currentStep
    currentStep = currentStep <= 1? 1: currentStep - 1
    this.setState({
      currentStep: currentStep
    })
  }

  _submit() {
  }

  get previousButton(){
    let currentStep = this.state.currentStep;
    if(currentStep !==1){
      return (
          <button
              className="btn btn-primary  m-5"
              type="button"
              onClick={this._prev}>
            Previous
          </button>
      )
    }
    return null;
  }

  get nextButton(){
    let currentStep = this.state.currentStep;
    if(currentStep <3){
      return (
          <button
              className="btn btn-primary m-5"
              type="button"
              onClick={this._next}>
            Next
          </button>
      )
    }
    return null;
  }

  get submitButton(){
    let currentStep = this.state.currentStep;
    if(currentStep == 3){
      return (
          <button
              className="btn btn-primary m-5"
              type="button"
              onClick={this._submit}>
            Submit
          </button>
      )
    }
    return null;
  }

  render() {
    return (
        <React.Fragment>
          <form onSubmit={this.submitForm}>
            <UploadForm1 {...this.state}
            />
            <UploadForm2 {...this.state}
            />
            <UploadForm3 {...this.state}
            />
          </form>
          <div className="d-flex justify-content-center">
            {this.previousButton}
            {this.nextButton}
            {this.submitButton}
          </div>
        </React.Fragment>
    )
  }
}