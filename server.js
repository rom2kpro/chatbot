const APP_SECRET = '75a6128fd93452a887f81d224e67f30a';
const VALIDATION_TOKEN = 'trungdeptrai';
const PAGE_ACCESS_TOKEN = 'EAArRlZBmNGNgBAOKYurtCiZCjUDS91dmSluC5ehGBKbB58po1pUXpZBUZBB1iQLG7DlIIX12DyF6sCphZBmRZCNWWDZANoFsPZAScFqt0WMejj0JOc5LFku7VLZC513hKA23OtwzJxsFCRw5wGwDNLUF8ZChnm2HbMR9csfGtjMowAD81SodXTgYWnHfuAVf7miaYbpZACOaWZC7sHdC12SO1du6';

const http = require('http');
const bodyParser = require('body-parser');
const express = require('express');
const axios = require('axios')


const app = express();

app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(bodyParser.json())

const server = http.createServer(app);
const request = require("request");

app.get('/', (req, res) => {
  res.send("Home page. Server running okay.");
});

app.get('/webhook', function(req, res) { // Đây là path để validate tooken bên app facebook gửi qua
  if (req.query['hub.verify_token'] == VALIDATION_TOKEN) {
    res.send(req.query['hub.challenge']);
  }
  res.send('Error, wrong validation token');
});

app.post('/webhook', function(req, res) { // Phần sử lý tin nhắn của người dùng gửi đến
  var entries = req.body.entry;
  console.log(entries);
  for (var entry of entries) {
    var messaging = entry.messaging;
    for (var message of messaging) {
      console.log(message);
      var senderId = message.sender.id;
      if (message.message) {
        if (message.message.text) {
          var text = message.message.text;
          sendMessage(senderId, "Hello!! I'm a bot. Your message: " + text);
        }
      }
    } 
  }
  res.status(200).send("OK");
});

// Đây là function dùng api của facebook để gửi tin nhắn
function sendMessage(senderId, message) {

  axios.post(`https://graph.facebook.com/v11.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`, {
    recipient: {
      id: senderId
    },
    message: {
      text: message
    },
  }).then((response) => {
    console.log(response);
  }).catch((error) => {
    console.log(error);
  })
  // request({
  //   url: 'https://graph.facebook.com/v11.0/me/messages',
  //   qs: {
  //     access_token: PAGE_ACCESS_TOKEN,
  //   },
  //   method: 'POST',
  //   json: {
  //     recipient: {
  //       id: senderId
  //     },
  //     message: {
  //       text: message
  //     },
  //   }
  // }
// );
}

app.set('port', process.env.PORT || 5000);
app.set('ip', process.env.IP || "0.0.0.0");

server.listen(app.get('port'), app.get('ip'), function() {
  console.log("Chat bot server listening at %s:%d ", app.get('ip'), app.get('port'));
});