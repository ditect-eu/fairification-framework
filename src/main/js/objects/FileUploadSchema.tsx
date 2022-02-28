import {JSONSchema7} from "json-schema";
export const FileUploadSchema: JSONSchema7 = {
  "title": "DiTECT Data Upload",
    "description": "Manual upload form for the DiTECT platform. For setting up an automated upload process, please visit https://github.com/ditect-eu/fairification-framework or contact t.hendriks@maastrichtuniversity.nl.",
    "type": "object",
    "required": [],
    "definitions": {
  "Dataset": {
    "title": "Dataset",
    "description": "Please provide the dataset to upload.",
    "type": "object",
    "properties": {
      "File": {
        "type": "string",
            "format": "data-url",
            "title": "the dataset to upload"
      }
    },
    "required": [
      "File"
    ],
  }
},
  "properties": {
  "DataSetLocation": {
    "title": "Dataset upload",
        "$ref": "#/definitions/Dataset"
  },
}
};