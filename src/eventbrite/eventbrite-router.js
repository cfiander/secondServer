const express = require('express')
const eventbriteRouter = express.Router()
const config = require('../config')
const unirest = require('unirest')
const jsonBodyParser = express.json()

eventbriteRouter
  .route(`/`)
  .get((req, res, next) => {
    res.send({ url: `https://www.eventbrite.com/oauth/authorize?response_type=code&client_id=I6MVEHHYVS3LD42Z46&redirect_uri=https://warm-bastion-62347.herokuapp.com/api/eventbrite/access` })
  })

eventbriteRouter
  .route(`/access`)
  .get((req, res, next) => {
    const code = req.query.code
    unirest.post('https://www.eventbrite.com/oauth/token')
    .headers({"Content-Type": "application/x-www-form-urlencoded"})
    .send({grant_type:"authorization_code", client_id:'I6MVEHHYVS3LD42Z46', client_secret:'V5MDVXPPD7JY5HNODIESMFVP32R63FXOCQS3ONC276SNQQTYBQ', code: `${code}`, redirect_uri: 'https://warm-bastion-62347.herokuapp.com/api/eventbrite/token' })
    .end(function (response) {
      console.log(response.body);
      res.send('success')
      console.log(response.body.access_token)
    });
  })




eventbriteRouter
  .route(`/token`)
  .get((req, res, next) => {
    console.log('string')
    const token = req.access_token
    res.json(token).redirect('http://localhost:3000/eventbrite')
  })



module.exports = eventbriteRouter
