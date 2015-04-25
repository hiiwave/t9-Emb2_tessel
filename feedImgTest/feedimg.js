// var tessel = require('tessel');
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
var fs = require('fs');

var feed = {
  init : function() {
    feed.action();
    setInterval(function() {
      feed.ready? feed.action():0;
    }, 3000);
  },
  ready : true,
  imgSet : 1,
  postData : function(data) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://t9-dataserver.herokuapp.com/feedimg');
    // xhr.onload = sendSuccess;
    xhr.onreadystatechange = function (oEvent) {  
      if (xhr.readyState === 4) {  
        if (xhr.status === 200) {  
          console.log('Got response: ' + xhr.responseText);
          feed.ready = true;
          ++feed.imgSet;
        } else {  
          console.error("Error: ", xhr.statusText);  
          console.log("Retry later..");
          feed.ready = true;
        }  
      }
    };
    xhr.send(data); 
  },
  postDataByHttp : function(data) {
    // not work with heroku
    var http = require('http');
    var options = {
      host: 'https://t9-dataserver.herokuapp.com',
      path: '/feedimg',
      port: '24108',
      method: 'POST'
    };
    var sendcb = function (res) {
      var str = '';
      res.on('data', function (chunk) {
        str += chunk;
      });
      res.on('end', function() {
        console.log('Got response of POST /feedimg: ' + str);  
        feed.ready = true;
        ++feed.imgSet;
      });
    };
    var req = http.request(options, sendcb);
    req.on('error', function(err) {
      console.error(err);
      console.log('Retry later..');
      feed.ready = true;
    });
    req.write(data);
    req.end();  
  },
  action : function() {
    var fileName, fileType;
    switch(feed.imgSet % 2) {
      case 1:
        fileName = 'smile.jpg';
        fileType = 'image/jpg';
        break;
      default:
        fileName = 'sad.png';
        fileType = 'image/png';
    }
    try {
      fs.readFile(fileName, function (err, data) {
        if (err) throw err;
        var imgPacket = {
          raw: data,
          contentType: fileType
        };
        feed.postData(JSON.stringify(imgPacket));
        feed.ready = false;
      });
    } catch(e) {
      console.error(e);
    }     
  }
};
feed.init();