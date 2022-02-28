import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import MainUploadForm from "./pages/MainUploadForm"

function App() {
    return   <Router>
                <Route path="/" component={MainUploadForm} />
            </Router>
}

export default App;
