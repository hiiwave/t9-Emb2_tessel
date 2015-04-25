var http = require('http');

function PacketGen(date, noise, temparature, humidity, lat, lng) {
  this.date = date;
  this.noise = noise;
  this.temparature = temparature;
  this.humidity = humidity;
  this.lat = lat;
  this.lng = lng;
};
function randU(min, max) {
  return min + (max - min) * Math.random();
};

var feed = {
  init : function() {
    setInterval(function() {
      feed.ready? feed.action():0;
    }, 1500);
  },
  ready : true,
  postData : function(data) {
    console.log("Post data..");
    var options = {
      hostname: 'https://t9-dataserver.herokuapp.com',
      port: 24108,
      path: '/feed',
      method: 'POST'
    };
    var callback = function(response) {
      console.log("I'm callback");
      var str = '';
      response.on('data', function (chunk) {
        str += chunk;
      });
      response.on('error', function (err) {
        console.error(err);
      })
      response.on('end', function () {
        console.log(str);
        feed.ready = true;
      });
    };
    var req = http.request(options, callback);
    console.log("HI");
    req.on('error', function (err) {
      console.error('Problem with request: ' + err.message);
    });
    req.write(data);
    req.end();
    console.log("..");

    // var sendSuccess = function () {
    //   console.log('Got response of POST /feed: ' + this.responseText);
    //   $('#pktCount').html(1 + parseInt($('#pktCount').html()));
    //   feed.ready = true;
    // };
    // var xhr = new XMLHttpRequest();
    // xhr.open('POST', 'https://t9-dataserver.herokuapp.com/feed');
    // xhr.onload = sendSuccess;
    // xhr.send(data); 
  },
  action : function() {
    var packet = new PacketGen(new Date(), randU(0, 0.5), randU(20, 25), randU(0.5, 0.7),
                             randU(25.0173, 25.0174), randU(121.5394, 121.5395) );
    feed.postData(JSON.stringify(packet));
    feed.ready = false;
  }
};
feed.init();