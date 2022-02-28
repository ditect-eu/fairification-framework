import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { CSVReader } from 'react-papaparse'
import {TextField} from "@material-ui/core";
import axios from "axios";
const $rdf = require('rdflib')

type MyProps = {currentStep: number,
    formData: any,
    open: boolean
};
type UploadFormState = { currentStep: number,
    formData: any,
    ontologyData: any,
    open: boolean,
    csvFields: string[]
};
export default class UploadForm3 extends React.Component<MyProps, UploadFormState> {

    downloadOntology = (contextUrl: string, rdf_format: any) => {
        axios.defaults.headers.common['Accept'] = 'application/ld+json'
        axios.get('../ontologies/chmo.owl')
        .then(res => {
            if (typeof res.data !== 'object') {
                this.toJSONLD(res.data, contextUrl, rdf_format)
                .then((jsonld_rdf) => {
                    console.log('Ontology downloaded, and converted to JSON-LD RDF:');
                    console.log(jsonld_rdf);
                    this.setState({
                        ontologyData: {
                            '@context': contextUrl,
                            '@graph': jsonld_rdf
                        }
                    })
                })
            } else {
                this.setState({
                    ontologyData: res.data
                })
            }
        })
        .catch(error => {
            console.log(error)
        })
    }

    toJSONLD = (data: any, uri: any, rdf_format: any) => {
        return new Promise((resolve, reject) => {
            let store = $rdf.graph()
            let doc = $rdf.sym(uri);
            $rdf.parse(data, store, uri, rdf_format)
            $rdf.serialize(doc, store, uri, 'application/ld+json', (err: any, jsonldData: any) => {
                return resolve(JSON.parse(jsonldData)
                    .sort((a: any, b: any) => {
                        if (a['@type'] && b['@type'] && Array.isArray(a['@type']) && Array.isArray(b['@type'])){
                            return a['@type'][0] < b['@type'][0] ? 1 : -1
                        } else {
                            return a['@type'] < b['@type'] ? 1 : -1
                        }
                    })
                )
            })
        })
    }

    downloadSchemaOrg = () => {
        axios.defaults.headers.common['Accept'] = 'application/ld+json'
        axios.get("https://schema.org/version/latest/schemaorg-current-https.jsonld")
        .then(res => {
            console.log('ontology downloaded!')
            console.log(res.data)
        })
        .catch(error => {
            console.log(error)
        })
    }

    downloadChmo = () => {
        let rdf_format = 'application/rdf+xml';
        axios.defaults.headers.common['Accept'] = rdf_format;
        return axios.get("https://raw.githubusercontent.com/rsc-ontologies/rsc-cmo/master/chmo.owl")
        .then(res => {
            let data = res.data;
            let uri = "https://raw.githubusercontent.com/rsc-ontologies/rsc-cmo/master/chmo.owl";
            let store = $rdf.graph()
            let doc = $rdf.sym(uri);
            $rdf.parse(data, store, uri, rdf_format)
            $rdf.serialize(doc, store, uri, 'application/ld+json', (err: any, jsonldData: any) => {
                return JSON.parse(jsonldData)
                .sort((a: any, b: any) => {
                    if (a['@type'] && b['@type'] && Array.isArray(a['@type']) && Array.isArray(b['@type'])) {
                        return a['@type'][0] < b['@type'][0] ? 1 : -1
                    } else {
                        return a['@type'] < b['@type'] ? 1 : -1
                    }
                });
            })
        })
        .catch(error => {
            console.log('error: ' + error)
        });
    }

    render() {
        if (this.props.currentStep !== 3) {
            return null
        }

        const handleOnDrop = (data: any) => {;
            this.setState({
                csvFields: data[0].meta.fields
            });

            this.downloadOntology('https://schema.org/version/latest/schemaorg-current-https.jsonld', 'application/ld+json');
            this.downloadOntology('http://purl.obolibrary.org/obo/chmo.owl', 'application/rdf+xml');
            // this.downloadSchemaOrg()
            // this.downloadChmo().then((jsonld_rdf => {
            //     this.setState({
            //         ontologyData: {
            //             '@context': "http://purl.obolibrary.org/obo/chmo.owl",
            //             '@graph': jsonld_rdf
            //         }
            //     });
            // }));
        }

        const handleOnError = (err: any, file: any, inputElem: any, reason: any) => {
            console.log(err)
        }

        const handleOnRemoveFile = (data: any) => {
            this.setState({
                csvFields: []
            });
        }
        let renderedOutput: any = <div></div>;
        let ontologyOutput: any = <div></div>;
        if(this.state != null){
            console.log(this.state.ontologyData);
            renderedOutput = this.state.csvFields.map(item =>
                <div className='d-flex flex-wrap justify-content-center'>
                        <TextField
                            variant="outlined"
                            size='medium'
                            className='p-5'
                            label= 'Current Field Name'
                            placeholder={item}
                        />
                        <TextField
                            variant="outlined"
                            size='medium'
                            label= 'Suggested Ontological Term'
                            className='p-5'
                            placeholder={item}
                        />
                </div>)
        }

        return (
            <div>
                <div className='p-3 d-flex justify-content-center'>
                    <CSVReader
                        onDrop={handleOnDrop}
                        onError={handleOnError}
                        noDrag
                        config={{preview: 1, header: true}}
                        addRemoveButton
                        onRemoveFile={handleOnRemoveFile}>
                        <span>Click to upload.</span>
                    </CSVReader>
                </div>
                <div>
                    {ontologyOutput}
                    {renderedOutput}
                </div>
            </div>
        )
    }
}