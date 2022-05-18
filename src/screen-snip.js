const fs = require('fs');
const tesseract = require('node-tesseract-ocr');

const config = {
  lang: 'kor',
  oem: 1,
  psm: 3,
};

// const img = 'https://tesseract.projectnaptha.com/img/eng_bw.png';
// const img = '../images/english_example.jpg';
// const img = '../images/example.jpg'
const img = '../images/example3.png';

screenSnip = () => {
  // const exampleImg = require('../images/example.jpg');
  tesseract
    .recognize(img, config)
    .then((text) => {
      console.log('Result:', text);
    })
    .catch((error) => {
      console.log(error);
    });
};

screenSnip();
