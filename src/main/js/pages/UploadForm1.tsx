import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Fragment }  from 'react';
import { JSONSchema7 } from "json-schema";
import '../App.css';
import Form from "@rjsf/material-ui";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Alert} from "@material-ui/lab";
import {Snackbar} from "@material-ui/core";
import {FileUploadSchema} from "../objects/FileUploadSchema";

type MyProps = {currentStep: number,
    formData: any,
    open: boolean
};
type UploadFormState = { currentStep: number,
    formData: any,
    open: boolean
};
export default class UploadForm1 extends React.Component<MyProps, UploadFormState> {
    constructor(props: any) {
        super(props)

        this.state = {
            currentStep: 1,
            formData: {},
            open: false
        }
    }

    handleClose = () => {
        this.setState({
            open: false
        })
    };

    render() {
        if (this.props.currentStep !== 1) {
            return null
        }
        let validate = (formData: any, errors: any) => {
                if(formData.Title && formData.Title.length > 200) {
                    errors.Title.addError("Please provide a shorter title");
                }
                if (formData.ProjectName && formData.ProjectName.length > 100) {
                    errors.ProjectName.addError("Please provide a shorter project name");
                }
                if (formData.ProjectAcronym && formData.ProjectAcronym.length > 20) {
                    errors.ProjectAcronym.addError("Please provide a shorter project acronym");
                }
                if (formData.ProjectURL && formData.ProjectURL.length > 2000) {
                    errors.ProjectURL.addError("Please provide a shorter project URL");
                }
                if(formData.Description && formData.Description.length > 500) {
                    errors.Description.addError("Please provide a shorter description");
                }
                return errors;
            }

        let schema: JSONSchema7 = FileUploadSchema;

        let uiSchema = {
            "Keywords": {
                "ui:options": {
                    "orderable": false
                }
            },
            "Languages": {
                "ui:options": {
                    "orderable": false
                }
            },
            "fixedArrayOfConditionals": {
                "items": {
                    "Do you want to get rid of any?": {
                        "ui:widget": "radio"
                    }
                }
            }
        };

        let log = (type: any) => console.log.bind(console, type);

        let
            transformErrors = (errors: any) => {
                return errors.map((error: any) => {
                    if (error.name === "enum") {
                        error.message = ""
                    }
                    if (error.name === "required") {
                        error.message = "Please provide a value for this field"
                    }
                    if (error.name === "format" || error.name === "pattern") {
                        error.message = "Please provide the correct format for this field"
                    }
                    if (error.name === "pattern") {
                        error.message = "Please make sure the url starts with http:// or https://"
                    }
                    if (error.name === "oneOf") {
                        error.message = ""
                    }
                    return error;
                });
            }

        return <div className="App p-5">
            <Snackbar autoHideDuration={8000} onClose={this.handleClose}>
                <Alert onClose={this.handleClose} severity="success">
                    Upload was succesful. To speed up potential similar uploads the form is not cleared. Press 'Clear fields' to start from scratch.
                </Alert>
            </Snackbar>
            <Form schema={schema}
                  formData={this.state.formData}
                  className="col-md-6 offset-md-3"
                  uiSchema={uiSchema}
                  onError={log("errors")}
                  showErrorList={false}
                  validate={validate}
                  transformErrors={transformErrors}
                  liveValidate>
                <Fragment />
            </Form>
        </div>;
    }
}