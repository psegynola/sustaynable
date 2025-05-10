const express = require('express')
const app = express()

const bodyParser = require('body-parser')
const {MongoClient} = require('mongodb')
const {isInvalidEmail, isEmptyPayload} = require('./validator.js')

const {DB_USER, DB_PASS, DEV} = process.env
const dbAddress = '127.0.0.1:27017'

const url = DEV ? `mongodb://${dbAddress}` : `mongodb://${DB_USER}:${DB_PASS}@${dbAddress}?authSource=company_db`

const client = new MongoClient(url)
const dbName = 'company_db'
const collName = 'employees'

app.use(bodyParser.json())
app.use('/', express.static(__dirname + '/dist'))

app.get('/get-profile', async function(req, res){

        //connect to MongoDB
        await client.connect()
        console.log('Connected to MongoDB')
    
        //initialize database and collection
        const db = client.db(dbName)
        const collection = db.collection(collName)

        //get the data from the database
        const result = await collection.findOne({id:1})
        console.log(result)
        client.close()

        response = {}

        if(result !== null){

        response ={
            name: result.name,
            email: result.email,
            interests: result.interests
        }
    }
    res.send(response)
})

app.post('/update-profile', async function(req, res) {
    const payload = req.body
    console.log(payload)

    if (isEmptyPayload(payload) || isInvalidEmail(payload)) {
        res.status(404).send({error: "empty payload. Could not update user profile data"})
    } else {

        //connect to MongoDB
        await client.connect()
        console.log('Connected to MongoDB')
    
        //initialize database and collection
        const db = client.db(dbName)
        const collection = db.collection(collName)
    
    
        //save the data to the database
        payload['id'] = 1;
        const updatedValues = { $set: payload}
        await collection.updateOne({id:1}, updatedValues, {upsert: true})
        client.close()


        

    res.send({info: "user profile data updated successfully"})
    }
})


const server = app.listen(3001, function(){
    console.log('Server is running on port 3001')
})

module.exports = {
    app,
    server
}