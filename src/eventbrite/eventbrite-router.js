const express = require('express')
const eventbriteRouter = express.Router()
const config = require('../config')
const unirest = require('unirest')
const jsonBodyParser = express.json()

let userToken;

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
      .headers({ "Content-Type": "application/x-www-form-urlencoded" })
      .send({ grant_type: "authorization_code", client_id: 'I6MVEHHYVS3LD42Z46', client_secret: 'V5MDVXPPD7JY5HNODIESMFVP32R63FXOCQS3ONC276SNQQTYBQ', code: `${code}`, redirect_uri: 'https://warm-bastion-62347.herokuapp.com/api/eventbrite/token' })
      .end(function (response) {
        userToken = response.body.access_token
        res.redirect('http://localhost:3000/eventbritesearch')
      });
  })

eventbriteRouter
  .route(`/categories`)
  .get((req, res, next) => {
    const token = userToken
    unirest.get('https://www.eventbriteapi.com/v3/categories/')
      .headers({ 'Authorization': `Bearer ${token}` })
      .end(function (response) {
        res.send(response.body)
      });
  })

eventbriteRouter
  .route(`/categoriesbyID`)
  .post((req, res, next) => {
    const {id} = req.body.category
    const token = userToken
    unirest.get(`https://www.eventbriteapi.com/v3/categories/${id}/`)
      .headers({ 'Authorization': `Bearer ${token}` })
      .end(function (response) {
        res.send(response.body)
      });
  })

eventbriteRouter
  .route(`/locations`)
  .post((req, res, next) => {
    const token = userToken
    const { location } = req.body.location
    unirest.get(`https://www.eventbriteapi.com/v3/events/search?${location}.address=vancovuer&location.within=10km&expand=venue`)
      .headers({ 'Authorization': `Bearer ${token}` })
      .send({ continuation: "" })
      .end(function (response) {
        res.send(response.body)
      });
  })

eventbriteRouter
  .route(`/subcategories`)
  .get((req, res, next) => {
    const token = userToken
    unirest.get('https://www.eventbriteapi.com/v3/subcategories?continuation=eyJwYWdlIjogMn0')
      .headers({ 'Authorization': `Bearer ${token}` })
      .end(function (response) {
        res.send(response.body)
      });
  })

// eventbriteRouter
//   .route(`/subcategories`)
//   .get((req, res, next) => {
//     const token = userToken
//     unirest.get('https://www.eventbriteapi.com/v3/subcategories?continuation=eyJwYWdlIjogMn0')
//       .headers({ 'Authorization': `Bearer ${token}` })
//       .end(function (response) {
//         res.send(response.body)
//       });
//   })

eventbriteRouter
  .route(`/events`)
  .get((req, res, next) => {
    const token = userToken
    unirest.get('https://www.eventbriteapi.com/v3/events/search/?q=javascript')
      .headers({ 'Authorization': `Bearer ${token}` })
      .end(function (response) {
        res.send(response.body)
      });
  })











module.exports = eventbriteRouter
