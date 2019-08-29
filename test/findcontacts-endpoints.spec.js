const app = require('../src/app')
const helpers = require('./test-helpers')
const config = require('../src/config')

describe('Jobs Endpoints', function () {

    const testUsers = helpers.makeUsersArray()
    const validCreds = { username: testUsers[0].username, password: testUsers[0].password }

    const expectedContact = {
        value: 'darrell@thinkful.com',
        type: 'personal',
        confidence: 98,
        first_name: 'Darrell',
        last_name: 'Dan',
        position: 'Software Engineering',
        seniority: 'executive',
        department: 'executive',
        linkedin: null,
        twitter: null,
        phone_number: null
    }

    const badSearch = { search: { location: 'asdf', jobTitle: 'asdf' } };
    const badResponse = {
        listings:
        {
            listing: [],
            total: 0,
            perpage: 10,
            page: 1,
            pages: 0,
            last_update: '2019-08-26T19:06:16-05:00'
        },
        stat: 'ok'
    };
    const goodSearch = { search: { location: 'San Francisco', jobTitle: 'uniform teeth' } }
    const gitHubSearch = { search: { location: 'san diego', jobTitle: 'Senior Software Engineer' } }
    const emptySearch = { search: {} };

    describe.only(`Getting contacts from /api/findcontacts`, () => {
        context(`Given no contacts`, () => {
            it(`responds with 200 and an a nested empty list`, () => {
                return supertest(app)
                    .post('/api/jobs/authentic')
                    .set('Authorization', helpers.makeAuthHeader(validCreds))
                    .send(badSearch)
                    .expect(200, badResponse)
            })
        })

        context(`Given an empty search`, () => {
            it(`responds with a 400`, () => {
                return supertest(app)
                    .post('/api/jobs/authentic')
                    .set('Authorization', helpers.makeAuthHeader(validCreds))
                    .send(emptySearch)
                    .expect(400)
            })
        })

        context('Given there are authentic API jobs', () => {
            it('responds with 200 and all of the jobs', () => {
                return supertest(app)
                    .post('/api/jobs/authentic')
                    .set('Authorization', helpers.makeAuthHeader(validCreds))
                    .send(goodSearch)
                    .expect(200)
                    .expect(res => {
                        expect(res.body.listings.listing).to.eql(expectedAuthenticJobs)
                    })
            })
        })
    })
})


