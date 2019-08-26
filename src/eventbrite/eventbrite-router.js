const express = require('express')
const eventbriteRouter = express.Router()
const config = require('../config')
const unirest = require('unirest')
const jsonBodyParser = express.json()

eventbriteRouter
  .route(`/`)
    .get((req, res, next) => { 
      res.send({url: `https://www.eventbrite.com/oauth/authorize?response_type=code&client_id=I6MVEHHYVS3LD42Z46&redirect_uri=https://warm-bastion-62347.herokuapp.com/api/eventbrite/access`})
    })
    .route(`/access`)
    .post((req, res, next) => { 
      console.log(req, 'a string')
    })


module.exports = eventbriteRouter
