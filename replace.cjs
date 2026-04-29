const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');
content = content.replace(/#060606/g, '#080808');
content = content.replace(/SARTORIAL/g, 'SARTORIAL');
fs.writeFileSync('src/App.tsx', content);
