/*
 * Project: COMP1320 Milestone 1
 * File Name: IOhandler.js
 * Description: Collection of functions for files input/output related operations
 *
 * Created Date: Nov 8, 2020
 * Author: Octavio Villena A01207939
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
  const filePathIn = path.normalize(pathIn); // normalize paths for windows
  const filePathOut = path.normalize(pathOut);
  return new Promise((resolve, reject) => {
    const fileExt = filePathIn.slice(filePathIn.length - 4, filePathIn.length); // gets file ext
    if (fileExt !== '.zip' || !fs.existsSync(filePathIn)) { // error if extension is not '.zip' or if file doesnt exist
      reject('This is the wrong file type or the file does not exist');
    } else {
      fs.createReadStream(filePathIn)
        .pipe(unzipper.Extract({ path: filePathOut })) // unzips the folder to extraction path
        .on('error', reject)
        .on('finish', resolve)
      console.log('Extraction opertaion complete');
    }
  });
};

/**
 * Description: read all the png files from given directory 
 * and return Promise containing array of each png file path 
 *
 * @param {string} path
 * @return {promise}
 */
const readDir = (dir) => {
  const thisFilePath = path.normalize(dir);
  return new Promise((resolve, reject) => {
    fs.readdir(thisFilePath, (err, files) => { // reads dir and returns array of file/folder names
      if (err) {
        reject(err);
      } else {
        const dirArray = [];
        files.forEach((element) => { // loops through files array, makes new array of png filepaths
          if (element.includes('.png')) {
            dirArray.push(path.join(thisFilePath, element));
          }
        });
        resolve(dirArray);
      }
    });
  });
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
  const sourcePath = (pathIn);
  const thisPathOut = path.normalize(pathOut); // normalize path for windows
  // creates greyscaled folder if it doesnt exist already
  if (!fs.existsSync(thisPathOut)) {
    fs.mkdirSync(thisPathOut);
  }
  const destPath = path.join(thisPathOut, path.basename(sourcePath)); // string of the new file path
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(sourcePath)) { // error if the filepath is invalid
      reject('Filepath is invalid or file does not exist');
    } else {
      fs.createReadStream(sourcePath) // reads png image data to create array of pixel data
        .pipe(new PNG({ filterType: 4 }))
        .on('parsed', function () {
          for (let i = 0; i < this.data.length; i++) { // loops through array of pixel data
            const grey = 0.2126 * (this.data[i]) + 0.7152 * (this.data[i + 1]) + 0.0722 * (this.data[i + 2]);
            // formula to make pixel grey
            this.data[i] = grey;
            this.data[i + 1] = grey;
            this.data[i + 2] = grey; // make pixels grey by applying formula each RGB value
            i += 3;
          }
          this.pack().pipe(fs.createWriteStream(destPath)); // write data to greyscaled folder
        });
      resolve('The image has been greyscaled');
    }
  });
};

module.exports = {
  unzip,
  readDir,
  grayScale,
};
