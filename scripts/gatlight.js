/**
 * File ops.
 */
 const fs = require('fs');
 const path = require('path');
 
 const ANYTHING_PATTERN = "**/*";
 
 function PatternFilter(pattern, isDirectory) {
 
     return (candidate) => {
         //console.log(pattern, candidate)
         return true;
     }
 }
 
 function ExtensionFilter(extension) {
     return (candidate) => candidate.endsWith("." + extension)
 }
 
 function isDirectory(path) {
     return fs.lstatSync(path).isDirectory()
 }
 
 function createFilter(options) {
     options = options || {};
     return options.filter || (options.extension ? new ExtensionFilter(options.extension) : new PatternFilter(options.pattern || ANYTHING_PATTERN));
 }
 
 /**
  * clean files from a directory, by default recursing into (and removing) subdirectories.
  * @param directory
  * @param options
  */
 function clean (directory, options) {
 
     if (fs.existsSync(directory)) {
 
         options = options || {};
         let filter = createFilter(options);
         let recurse = options.recurse !== false;
 
         let _one = (dirPath, alsoRemoveDirectory) => {
 
             fs.readdirSync(dirPath).forEach(file => {
                 let p = path.join(dirPath, file);
 
                 if (isDirectory(p)) {
                     if (recurse && filter(file, true)) {
                         _one(p, true);
                     }
                 } else {
                     if (filter(file, false)) {
                         fs.unlinkSync(p);
                     }
                 }
             });
 
             if (alsoRemoveDirectory) {
                 fs.rmdirSync(dirPath)
             }
         };
 
         _one(directory);
 
         if (options.andRemove) {
             fs.rmdirSync(directory);
         }
     }
 
 }
 
 function rmdir(directory) {
     clean(directory, {andRemove:true});
 }
 
 function exists(file) {
     return fs.existsSync(file);
 }
 
 function copyDirectory (input, output, options) {
 
     options = options || {};
     let recurse = options.recurse !== false;
     let includeHidden = options.hidden === true;
 
     if (fs.existsSync(output)) {
         clean(output, { andRemove:true });
     }
 
     let filter = createFilter(options);
 
     let _one = (inputDir, outputDir) => {
 
         fs.mkdirSync(outputDir);
 
         fs.readdirSync(inputDir).forEach(file => {
 
             if (filter(file)) {
 
                 let inputPath = path.join(inputDir, file);
                 if (isDirectory(inputPath)) {
                     if (recurse) {
                         _one(inputPath, path.join(outputDir, file));
                     }
                 } else {
                     if (includeHidden === true || file.indexOf(".") !== 0) {
                         let outputPath = path.join(outputDir, file);
                         console.log("gatlight: copying : " + inputPath + " to " + outputPath);
                         try {
                             fs.copyFileSync(inputPath, outputPath);
                         } catch (e) {
                             console.log(e)
                         }
                     } else {
                         console.log("gatlight: excluding " + inputPath + " due to a dot")
                     }
                 }
             } else {
                 console.log("Filtered " + file + " from copy");
             }
 
         });
     };
 
     _one(input, output);
 
 
 }
 
 function copy (source, target, options) {
 
 
     options = options || {};
     let filter = createFilter(options);
 
     // for now this is just a straight single file copy
     console.log("gatlight: copying : " + source + " to " + target);
     fs.copyFileSync(source, target);
 }
 
 function copyAll (sourceDirectory, targetDirectory, options) {
 
     ls(sourceDirectory, options).forEach((f) => {
         fs.copyFileSync(sourceDirectory + "/" + f, targetDirectory + "/" + f);
     })
 }

function copyAllRecursively (sourceDirectory, targetDirectory, options) {

    options = options || {}
    let filter = createFilter(options);
    const entries = fs.readdirSync(sourceDirectory)
    entries.forEach((f) => {
        const src = `${sourceDirectory}/${f}`
        const target = `${targetDirectory}/${f}`
        if (isDirectory(src)) {
            mkdir(target, true)
            copyAllRecursively(src, target, options)
        } else {
            if (filter(f)) {
                fs.copyFileSync(src, target);
            }
        }
    })
}
 
 function mkdir(target, silently) {
 
     if (Array.isArray(target)) {
         target = target.join("/");
     }
 
     try {
         fs.mkdirSync(target);
     }
     catch (e) {
         if (!silently) {
             console.log("Could not make directory `" + target + "` - perhaps it exists already. Not failing.")
         }
     }
 }
 
 function mkdirs(target) {
     const components = target.split("/");
     const stub = components.slice(0,1);
     mkdir(stub, true);
     for (let i = 1; i < components.length; i++) {
         stub.push(components[i]);
         mkdir(stub.join("/"), true);
     }
 }
 
 /**
  * Make a directory and then clean it - because if it existed already it could have stuff in it.
  * @param target
  */
 function mkdirClean(target) {
     mkdir(target);
     clean(target);
 
 }
 
 function ls(directory, options) {
 
     options = options || {};
     let filter = createFilter(options);
 
     return fs.readdirSync(directory).filter(filter);
 }

 function lsDirectories(directory) {
     return ls(directory, {
         filter:(candidate) => isDirectory(`${directory}/${candidate}`)
     })
 }
 
 function lsAll(directories, options) {
 
     options = options || {};
     let filter = createFilter(options);
     let out = [];
     for (let i = 0; i < directories.length; i++) {
         out.push.apply(out, fs.readdirSync(directories[i]).filter(filter).map(f => [f,directories[i]]));
     }
 
     return out;
 
 }
 
 function read(fileName, options) {
     return fs.readFileSync(fileName, options);
 }
 
 function readString(fileName, encoding) {
     return read(fileName, encoding || "UTF-8");
 }
 
 function write(fileName, content) {
     fs.writeFileSync(fileName, content);
 }
 
 function remove(fileName, failOnError) {
     try {
         fs.unlinkSync(fileName);
     }
     catch (e) {
         if (failOnError) {
             throw e;
         }
     }
 }
 
 function uuid() {
     return ('xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
         let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
         return v.toString(16);
     }));
 }

 exports.copyDirectory = copyDirectory;
 exports.clean = clean;
 exports.copy = copy;
 exports.copyAll = copyAll;
 exports.copyAllRecursively = copyAllRecursively;
 exports.mkdir = mkdir;
 exports.mkdirs = mkdirs;
 exports.mkdirClean = mkdirClean;
 exports.rmdir = rmdir;
 exports.ls = ls;
 exports.lsDirectories = lsDirectories;
 exports.lsAll = lsAll;
 exports.suffixFilter = function(suffix) { return function(file) { return file.endsWith("." + suffix); } }
 exports.read = read;
 exports.readString = readString;
 exports.write = write;
 exports.remove = remove;
 exports.rm = remove;
 exports.uuid = uuid;
 exports.exists = exists;
 exports.isDirectory = isDirectory;

