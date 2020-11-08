/*
 * Project: COMP1320 Milestone 1
 * File Name: IOhandler.js
 * Description: Collection of functions for files input/output related operations
 * 
 * Created Date: 
 * Author: Octavio Villena
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
    const fileExtension = pathIn.slice(pathIn.length - 4, pathIn.length); // gets file extension
    const zipFilePath = path.join(__dirname, pathIn);
    const outFilePath = path.join(__dirname, pathOut);
    if (fileExtension != ".zip" || !fs.existsSync(zipFilePath)) { // error if extension is not '.zip' or if file doesnt exist
      reject("This is the wrong file type or the file does not exist");
    } else {
      fs.createReadStream(zipFilePath)
        .pipe(unzipper.Extract({ path: outFilePath }) // unzips the folder
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
    fs.readdir(dir, (err, files) => { // reads directory and returns array of file/folder names
      if (err) {
        reject(err);
      } else {
        let dirArray = [];
        files.forEach(element => { // loops through files array and creates new array of filepaths to png images
          if (element.includes(".png")) {
            dirArray.push(path.join(dir, element)); 
          }
        });
        resolve(dirArray);
      }
    })
  })
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

  const newPath = path.join(__dirname, "greyscaled"); // creates greyscaled folder if it doesnt exist already
  if (!fs.existsSync(newPath)) {
    fs.mkdirSync(newPath);
  }

  const sourcePath = pathIn;
  const destinationPath = path.join(newPath, pathOut); // string of the new file path
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(sourcePath)) { // error if the filepath is invalid
      reject("Filepath is invalid or file does not exist");
    } else {
      fs.createReadStream(sourcePath) // reads png image data to create array of pixel data
        .pipe(new PNG())
        .on("parsed", function () { 
          for (let y = 0; y < this.height; y++) {// loops through array of pixel data
            for (let x = 0; x < this.width; x++) {
              let idx = (this.width * y + x) << 2;
              let grey= 0.2126*(this.data[idx]) + 0.7152*(this.data[idx + 1]) + 0.0722*(this.data[idx + 2]); // formula to make pixel grey
              this.data[idx] =  grey; 
              this.data[idx + 1] = grey;
              this.data[idx + 2] = grey; //make pixels grey by applying formula each RGB value
            }
          }
          this.pack().pipe(fs.createWriteStream(destinationPath)); // write data to greyscaled folder
        })
      resolve("The image has been greyscaled")
    }

  })
};



// readDir(path.join(__dirname, "unzipped"))
//   .then(result => {
//     grayScale(result[2], "out.png")
//   })
//   .catch(err => console.log(err));


module.exports = {
  unzip,
  readDir,
  grayScale
};