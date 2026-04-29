const https = require('https');
const urls = [
  "https://images.pexels.com/photos/1813272/pexels-photo-1813272.jpeg",
  "https://images.pexels.com/photos/3998419/pexels-photo-3998419.jpeg",
  "https://images.pexels.com/photos/2080036/pexels-photo-2080036.jpeg",
  "https://images.pexels.com/photos/2079169/pexels-photo-2079169.jpeg",
  "https://images.pexels.com/photos/1319459/pexels-photo-1319459.jpeg",
  "https://images.pexels.com/photos/897262/pexels-photo-897262.jpeg"
];

urls.forEach(url => {
  https.get(url, (res) => {
    console.log(url, res.statusCode);
  }).on('error', (e) => {
    console.error(e);
  });
});
