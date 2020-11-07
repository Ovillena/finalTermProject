/*
 * Project: COMP1320 Milestone 1
 * File Name: IOhandler.js
 * Description: Collection of functions for files input/output related operations
 * 
 * Created Date: 
 * Author: 
 * 
 */

const { rejects } = require('assert');
const { resolve } = require('path');

const unzipper = require('unzipper'),
  fs = require("fs"),
  PNG = require('pngjs').PNG,
  path = require('path');


/**
 * Description: decompress file from given pathIn, write to given pathOut 
 *  
 * @param {string} pathIn 
 * @param {string} pathOut 
 * @return {promise}
 */
const unzip = (pathIn, pathOut) => {
  return new Promise((resolve, reject) => {
    const fileExtension = pathIn.slice(pathIn.length - 4, pathIn.length);
    const zipFilePath = path.join(__dirname, pathIn);
    const outFilePath = path.join(__dirname, pathOut);
    if (fileExtension != ".zip" || !pathIn.includes(".zip")) {
      reject("This is the wrong file type or the file does not exist");
    } else {
      fs.createReadStream(zipFilePath)
        .pipe(unzipper.Extract({ path: outFilePath })
        )
      resolve("Unzipping was successful");
    }
  })
};

// unzip("myfile.zip", "unzipped")
//   .then(message => console.log(message))
//   .catch(err => console.log(err));

/**
 * Description: read all the png files from given directory and return Promise containing array of each png file path 
 * 
 * @param {string} path 
 * @return {promise}
 */
const readDir = dir => {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (err, files) => {
      if (err) {
        reject(err);
      } else {
        let dirArray = [];
        files.forEach(element => {
          if (element.includes(".png")) {
            dirArray.push(path.join(__dirname, element));
          }
        }); //finish loop to create new array of png files, get file paths ***********************
        resolve(dirArray);
      }
    })
  })
};

readDir(path.join(__dirname, "unzipped"))
  .then(result => console.log(result))
  .catch(err => console.log(err));


/**
 * Description: Read in png file by given pathIn, 
 * convert to grayscale and write to given pathOut
 * 
 * @param {string} filePath 
 * @param {string} pathProcessed 
 * @return {promise}
 */
const grayScale = (pathIn, pathOut) => {

};

module.exports = {
  unzip,
  readDir,
  grayScale
};