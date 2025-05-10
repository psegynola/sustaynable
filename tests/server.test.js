const {app, server} = require('./server.js')
const request = require('supertest')

test("test request with valid payload", async function() {
    const testPayload = {        
        name: "test name",
        email: "test.email@example.con",
        interests: "testing"
    }
    const response = await request(app)
        .post('/update-profile')
        .send(testPayload)

    console.log(response.body)
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty("info")
    expect(response.body.info).toBe("user profile data updated successfully")

    server.close()

    })


    test("test request with invalid payload", async function() {
        const testPayload = {}
        const response = await request(app)
            .post('/update-profile')
            .send(testPayload)
    
        console.log(response.body)
        expect(response.body).toHaveProperty("error")
        expect(response.body.error).toBe("empty payload. Could not update user profile data")
    
        server.close()
    
        })