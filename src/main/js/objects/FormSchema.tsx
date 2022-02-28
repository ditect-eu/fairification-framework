import {JSONSchema7} from "json-schema";
export const FormSchema: JSONSchema7 = {
  "title": "DiTECT Data Upload",
    "description": "Manual upload form for the DiTECT platform. For setting up an automated upload process, please visit https://github.com/ditect-eu/fairification-framework or contact t.hendriks@maastrichtuniversity.nl.",
    "type": "object",
    "required": [],
    "definitions": {
  "license": {
    "type": "object",
        "properties": {
      "Under which license will the dataset be made available?": {
        "type": "string",
            "enum": ["CC BY",
          "CC BY-SA",
          "CC BY-NC",
          "CC BY-NC-SA",
          "CC BY-ND",
          "CC BY-NC-ND",
          "Other"]
            ,
            "default": "CC BY"
      }
    },
    "required": [
      "Under which license will the dataset be made available?"
    ],
        "dependencies": {
      "Under which license will the dataset be made available?": {
        "oneOf": [
          {
            "properties": {
              "Under which license will the dataset be made available?": {
                "enum": [
                  "Other"
                ]
              },
              "License URL": {
                "type": "string",
                "format": "uri",
                "pattern": "^http.?://",
                "title": "Please provide the URL to the license"
              }
            },
            "required": [
              "License URL"
            ]
          },
          {
            "properties": {
              "Under which license will the dataset be made available?": {
                "enum": [
                  "CC BY",
                  "CC BY-SA",
                  "CC BY-NC",
                  "CC BY-NC-SA",
                  "CC BY-ND",
                  "CC BY-NC-ND",]
              }
            }
          }
        ]
      }
    }
  },
  "creationdate": {
    "type": "object",
        "properties": {
      "Is the date of creation for the object available?": {
        "type": "string",
            "enum": ["I only know the year of creation",
          "I have the exact date available"
        ]
            ,
            "default": "I have the exact date available"
      }
    },
    "required": [
      "Is the date of creation for the object available?"
    ],
        "dependencies": {
      "Is the date of creation for the object available?": {
        "oneOf": [
          {
            "properties": {
              "Is the date of creation for the object available?": {
                "enum": [
                  "I have the exact date available"
                ]
              },
              "ExactDate": {
                "title": "Day of creation",
                "description": "The day on which work on the dataset was completed",
                "type": "object",
                "properties": {
                  "date": {
                    "type": "string",
                    "format": "date"
                  }
                },
                "required": [
                  "date"
                ],
              }
            },
            "required": [
              "ExactDate"
            ]
          },
          {
            "properties": {
              "Is the date of creation for the object available?": {
                "enum": [
                  "I only know the year of creation"
                ]
              },
              "yearOfCreation": {
                "title": "Year of creation",
                "type": "integer",
                "minimum": 1900,
                "maximum": 2100
              }
            },
            "required": [
              "yearOfCreation"
            ]
          }
        ]
      }
    }
  }
},
  "properties": {
  "Title": {
    "type": "string",
        "title": "Title",
        "description": "If applicable, please provide the title of your dataset.",
  },
  "Description": {
    "type": "string",
        "title": "Description",
        "description": "Please provide a short (500 character or around 100 words) description of the dataset."
  },
  "Creators": {
    "title": "Creators",
        "description": "Please provide the name(s) of the creator(s) of the dataset",
        "type": "array",
        "items": {
      "type": "string"
    }
  },
  "License": {
    "title": "License",
        "$ref": "#/definitions/license"
  },
  "DataSetDate": {
    "title": "Creation Date",
        "$ref": "#/definitions/creationdate"
  },
  "GeographicalLocations": {
    "title": "Geographical Location(s)",
    "description": "Please select all countries referenced in the knowledge object's contents.",
    "type": "array",
    "items":
        {
          "title": "Country",
          "type": "string",
          "default": "English",
          "enum": ["Afghanistan",
            "Albania",
            "Algeria",
            "Andorra",
            "Angola",
            "Antigua and Barbuda",
            "Argentina",
            "Armenia",
            "Australia",
            "Austria",
            "Azerbaijan",
            "Bahamas",
            "Bahrain",
            "Bangladesh",
            "Barbados",
            "Belarus",
            "Belgium",
            "Belize",
            "Benin",
            "Bhutan",
            "Bolivia",
            "Bosnia and Herzegovina",
            "Botswana",
            "Brazil",
            "Brunei",
            "Bulgaria",
            "Burkina Faso",
            "Burundi",
            "Côte d'Ivoire",
            "Cabo Verde",
            "Cambodia",
            "Cameroon",
            "Canada",
            "Central African Republic",
            "Chad",
            "Chile",
            "China",
            "Colombia",
            "Comoros",
            "Congo",
            "Costa Rica",
            "Croatia",
            "Cuba",
            "Cyprus",
            "Czechia",
            "Democratic Republic of the Congo",
            "Denmark",
            "Djibouti",
            "Dominica",
            "Dominican Republic",
            "Ecuador",
            "Egypt",
            "El Salvador",
            "Equatorial Guinea",
            "Eritrea",
            "Estonia",
            "Eswatini",
            "Ethiopia",
            "Fiji",
            "Finland",
            "France",
            "Gabon",
            "Gambia",
            "Georgia",
            "Germany",
            "Ghana",
            "Greece",
            "Grenada",
            "Guatemala",
            "Guinea",
            "Guinea-Bissau",
            "Guyana",
            "Haiti",
            "Holy See",
            "Honduras",
            "Hungary",
            "Iceland",
            "India",
            "Indonesia",
            "Iran",
            "Iraq",
            "Ireland",
            "Israel",
            "Italy",
            "Jamaica",
            "Japan",
            "Jordan",
            "Kazakhstan",
            "Kenya",
            "Kiribati",
            "Kuwait",
            "Kyrgyzstan",
            "Laos",
            "Latvia",
            "Lebanon",
            "Lesotho",
            "Liberia",
            "Libya",
            "Liechtenstein",
            "Lithuania",
            "Luxembourg",
            "Madagascar",
            "Malawi",
            "Malaysia",
            "Maldives",
            "Mali",
            "Malta",
            "Marshall Islands",
            "Mauritania",
            "Mauritius",
            "Mexico",
            "Micronesia",
            "Moldova",
            "Monaco",
            "Mongolia",
            "Montenegro",
            "Morocco",
            "Mozambique",
            "Myanmar (formerly Burma",
            "Namibia",
            "Nauru",
            "Nepal",
            "Netherlands",
            "New Zealand",
            "Nicaragua",
            "Niger",
            "Nigeria",
            "North Korea",
            "North Macedonia",
            "Norway",
            "Oman",
            "Pakistan",
            "Palau",
            "Palestine State",
            "Panama",
            "Papua New Guinea",
            "Paraguay",
            "Peru",
            "Philippines",
            "Poland",
            "Portugal",
            "Qatar",
            "Romania",
            "Russia",
            "Rwanda",
            "Saint Kitts and Nevis",
            "Saint Lucia",
            "Saint Vincent and the Grenadines",
            "Samoa",
            "San Marino",
            "Sao Tome and Principe",
            "Saudi Arabia",
            "Senegal",
            "Serbia",
            "Seychelles",
            "Sierra Leone",
            "Singapore",
            "Slovakia",
            "Slovenia",
            "Solomon Islands",
            "Somalia",
            "South Africa",
            "South Korea",
            "South Sudan",
            "Spain",
            "Sri Lanka",
            "Sudan",
            "Suriname",
            "Sweden",
            "Switzerland",
            "Syria",
            "Tajikistan",
            "Tanzania",
            "Thailand",
            "Timor-Leste",
            "Togo",
            "Tonga",
            "Trinidad and Tobago",
            "Tunisia",
            "Turkey",
            "Turkmenistan",
            "Tuvalu",
            "Uganda",
            "Ukraine",
            "United Arab Emirates",
            "United Kingdom",
            "United States of America",
            "Uruguay",
            "Uzbekistan",
            "Vanuatu",
            "Venezuela",
            "Vietnam",
            "Yemen",
            "Zambia",
            "Zimbabwe"]
        }
    },
    "boolean": {
      "type": "object",
      "title": "Boolean field",
      "properties": {
        "default": {
          "type": "boolean",
          "title": "checkbox (default)",
          "description": "This is the checkbox-description"
        },
        "radio": {
          "type": "boolean",
          "title": "radio buttons",
          "description": "This is the radio-description"
        },
        "select": {
          "type": "boolean",
          "title": "select box",
          "description": "This is the select-description"
        }
      }
    }
}
};