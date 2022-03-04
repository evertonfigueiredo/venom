// Supports ES6
// import { create, Whatsapp } from 'venom-bot';
const express = require("express");
const venom = require("venom-bot");
const http = require("http");
const app = express();
const port = process.env.PORT || 8000;
const server = http.createServer(app);
const { body, validationResult } = require("express-validator");
const { response } = require("express");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

venom
  .create({
    session: "session-name", //name of session
    multidevice: true, // for version not multidevice use false.(default: true)
    // headless: false // Para abrir uma aba
  })
  .then((client) => start(client))
  .catch((erro) => {
    console.log(erro);
  });

function start(client) {
  client.onMessage((message) => {
    if (message.body === "Hi" && message.isGroupMsg === false) {
      client
        .sendText(message.from, "Welcome Venom 🕷")
        .then((result) => {
          console.log("Result: ", result); //return object success
        })
        .catch((erro) => {
          console.error("Error when sending: ", erro); //return object error
        });
    }


  });

  app.post("/send", [
    body("number").notEmpty(),
    body("message").notEmpty(),
  ], async(req,res)=>{
      const errors = validationResult(req).formatWith(({
          msg
      })=>{
          return msg;
      });

      if (!errors.isEmpty()) {
          return res.status(422).json({
              status: false,
              message: errors.mapped()
          });
      }

      const number = req.body.number;
      const message = req.body.message;

      client.sendText(number, message).then(response =>{
          res.status(200).json({
              status: true,
              message: 'Mensagem enviada',
              response: response
          });
      }).catch(err =>{
          res.status(500).json({
              status: false,
              message: 'Mensagem não enviada',
              response: err.text
          });
      });
  });

  server.listen(port, function(){
      console.log('App running on : ' + port);
  })
}
