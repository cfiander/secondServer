const app = require('../src/app')
const helpers = require('./test-helpers')
const config = require('../src/config')

describe('Jobs Endpoints', function () {

    const { expectedAuthenticJobs, expectedGitHubJobs } = helpers.makeJobsFixtures()

    describe(`Getting contacts from /api/findcontacts`, () => {
        context(`Given no contacts`, () => {
            it(`responds with 200 and an empty list`, () => {
                return supertest(app)
                    .post('/api/findcontacts')
                    .expect(500)
            })
        })


        context('Given there are contacts matching the search', () => {
            it('responds with 200 and all of the jobs', () => {
                return supertest(app)
                    .post('/api/jobs')
                    .expect(200, expectedAuthenticJobs)
            })
        })
    })
})