const fs = require('fs');
const { FileTransportOptions } = require('winston/lib/winston/transports');

let root = './public/views/'

fs.readdir('./public/views', (err, files) => {
    if(err){
        console.log(err)
        return
    } else {
        files.forEach(fileName => {
            replaceInFIle(fileName);
        });
    }
})

function replaceInFIle(fileName) {
    let path = root + fileName;
    fs.readFile(path, 'utf8', (err, file) => {
        if(err){
            console.log(err)
        } else {
            file = file.replace(/&lt;/g, '<');
            file = file.replace(/&gt;/g, '>');
            file = file.replace(/&quot;/g, '"');
            file = file.replace(/&#x27;/g, "'");
    
            fs.writeFile(path, file, 'utf8', (err2) => {
                err2 ? console.log(err2) : false;
            });
        }
    });
}