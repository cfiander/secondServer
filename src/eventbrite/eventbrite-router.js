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
  .route(`/categoriesbyID`)
  .post(jsonBodyParser, (req, res, next) => {
    const { id } = req.body.category
    const token = userToken
    unirest.get(`https://www.eventbriteapi.com/v3/categories/${id}/`)
      .headers({ 'Authorization': `Bearer ${token}` })
      .end(function (response) {
        res.send(response.body)
      });
  })

eventbriteRouter
  .route(`/events`)
  .post(jsonBodyParser, (req, res, next) => {
    const token = userToken
    console.log(req.body.search, 'new event string')

    if (!req.body.query  || !req.body.location) {
      throw error({message: 'Query and location are both required fields'})
    }
    if (req.body.category === '' && req.body.subcategory === '') {
      const { query, location } = req.body.search
      console.log(query, location, 'special string')
      unirest.get(`https://www.eventbriteapi.com/v3/events/search/?q=${query}&location.address=${location}&location.within=10km&expand=venue`)
        .headers({ 'Authorization': `Bearer ${token}` })
        .end(function (response) {
          res.send(response.body)
        });
    }
    if (req.body.category && req.body.subcategory === '') {
      const { query, location, category } = req.body.search
      console.log(query, location, category, 'another string')
      unirest.get(`https://www.eventbriteapi.com/v3/events/search/?q=${query}&location.address=${location}&location.within=10km&expand=venue&category=${category}`)
        .headers({ 'Authorization': `Bearer ${token}` })
        .end(function (response) {
          res.send(response.body)
        });
    } else {
    const { query, location, category, subcategory } = req.body.search
    console.log(query, location, category, subcategory, 'another string')
    unirest.get(`https://www.eventbriteapi.com/v3/events/search/?q=${query}&location.address=${location}&location.within=10km&expand=venue&category=${category}&subcategory=${subcategory}`)
      .headers({ 'Authorization': `Bearer ${token}` })
      .end(function (response) {
        res.send(response.body)
      });
    }
  })

// eventbriteRouter
//   .route(`/categories`)
//   .get((req, res, next) => {
//     const token = userToken
//     unirest.get('https://www.eventbriteapi.com/v3/categories/')
//       .headers({ 'Authorization': `Bearer ${token}` })
//       .end(function (response) {
//         res.send(response.body)
//       });
//   })

// eventbriteRouter
//   .route(`/locations`)
//   .post(jsonBodyParser, (req, res, next) => {
//     const token = userToken
//     console.log(req.body.location)
//     const { address } = req.body.location
//     unirest.get(`https://www.eventbriteapi.com/v3/events/search?location.address=${address}&location.within=10km&expand=venue&q=javascript`)
//       .headers({ 'Authorization': `Bearer ${token}` })
//       .send({ continuation: "" })
//       .end(function (response) {
//         res.send(response.body)
//       });
//   })

// eventbriteRouter
//   .route(`/subcategories`)
//   .get((req, res, next) => {
//     const token = userToken
//     unirest.get('https://www.eventbriteapi.com/v3/subcategories?continuation=eyJwYWdlIjogMn0')
//       .headers({ 'Authorization': `Bearer ${token}` })
//       .end(function (response) {
//         res.send(response.body)
//       });
//   }











module.exports = eventbriteRouter
