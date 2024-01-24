const fs = require('fs');
const path = require('path');

let componentPath = path.join(__dirname,'../components' );
let cpoyPath = path.join(__dirname, '../build/components');

let componentDir =  fs.readdirSync(componentPath);

if(!fs.existsSync(cpoyPath)) {
  fs.mkdirSync(cpoyPath, { recursive:true })
}

componentDir.forEach(fileNameItem => {
  let tempPath = path.join(componentPath, fileNameItem)
  let tempFileData = fs.readFileSync(tempPath);

  fs.writeFileSync(path.join(cpoyPath,fileNameItem), tempFileData);
    
})