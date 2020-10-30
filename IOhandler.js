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
  const fileExtension = pathIn.slice(pathIn.length - 4, pathIn.length);
  console.log(fileExtension);
  let zipFilePath = path.join(__dirname, pathIn);
  let outFilePath = path.join(__dirname, pathOut);
  return new Promise((reject, resolve) => {
    if (fileExtension != ".zip" || !pathIn.includes(".zip")) {
      reject(console.log("file does not exist"));
    } else {
      resolve(fs.createReadStream(zipFilePath)
        .pipe(unzipper.Extract({ path: outFilePath }) //unzipping works but comes up with some kind of error
        )) //perhaps coded promise incorrectly
    }

  })

};

unzip("myfile.zip", "unzipped")
  .then()
  .catch();

/**
 * Description: read all the png files from given directory and return Promise containing array of each png file path 
 * 
 * @param {string} path 
 * @return {promise}
 */
const readDir = dir => {

};

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