var Alexa = require('alexa-sdk');
var https = require('https');

exports.handler = function(event, context, callback){
    var alexa = Alexa.handler(event, context);
    alexa.registerHandlers(handlers);
};

var handlers = {
    'LaunchRequest': function () {
        this.emit('HelloWorldIntent');
    },

    'HelloWorldIntent': function () {
        this.emit(':tell', 'Hello World!');
    }
};

var requestOptions = {
  method: 'GET',
  port: 443,
  hostname: 'www.reddit.com',
  path: '/r/PHP/.json',
  headers: {
    'User-Agent': 'alexa-reddit-skill (v0.0.1)'
  }
}
var req = https.request(requestOptions, (res) => {
  if (res.statusCode != 200) {
    console.log(res.statusCode);
    console.log(res.headers);
    throw 'Invalid response from reddit';
  }

  var jsonString = '';

  res.on('data', (d) => {
    console.log('Got ' + d.length + ' bytes');
    jsonString += d;
  })

  res.on('end', () => {
    console.log('Done retrieving data, ' + jsonString.length + ' bytes received');
    var posts = JSON.parse(jsonString);
    console.log('Parsing JSON complete');
    // console.log(posts);
  });
});

console.log('Starting request...');
req.end();
