import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';

import injectTapEventPlugin from 'react-tap-event-plugin';
// import Mpj from './lib/mpj-converter';
// import file from './backup01.mpj';

injectTapEventPlugin();

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();


// TODO: testをきちんとした形で書く

// Mpj.decompressのテスト

// var rawFile = new XMLHttpRequest();
// rawFile.open("GET", file, true);
// rawFile.responseType = "arraybuffer";
// rawFile.onload = function (oEvent) {
//     if (rawFile.readyState === 4) {
//         if (rawFile.status === 200 || rawFile.status === 0) {
//             var allText = rawFile.response;
//             Mpj.decompress(allText)
//                 .then(value => console.log(value))
//                 .catch(err => console.log(err));
//         }
//     }
// }
// rawFile.send(null);