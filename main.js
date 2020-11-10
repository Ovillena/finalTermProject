/*
 * Project: COMP1320 Milestone 1
 * File Name: main.js
 * Description: Calls the promise functions from IOhandler.js
 * 
 * Created Date: Nov 7, 2020
 * Author: Octavio Villena A01207939
 * 
 */

const IOhandler = require("./IOhandler"),
  zipFilePath = `${__dirname}/myfile.zip`,
  pathUnzipped = `${__dirname}/unzipped`,
  pathProcessed = `${__dirname}/grayscaled`;

const {unzip, readDir, grayScale} = require('./IOhandler');

unzip(zipFilePath,pathUnzipped) // unzips folder
  .then(() => readDir(pathUnzipped))
  .then(pathArray => {
      pathArray.forEach(element => {
        grayScale(element, pathProcessed) // grayscale each image in unzipped folder
      });
  })
  .catch(err => console.log(err)); // catches errors
