const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const faker = require('faker')

// Connection URL
const url = 'mongodb://127.0.0.1:27017';

// Database Name
const dbName = 'opscale';
const newDbName = "opscale_clone";

// Create a new MongoClient
const client = new MongoClient(url, { useNewUrlParser: true });


// Use connect method to connect to the Server
client.connect(function(err) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  const db = client.db(dbName);

  // for(let i = 0; i < 20; i++) {
  //   const collection = db.collection('opscale')
  //   let obj = {
  //     name: faker.name.findName(),
  //     email: faker.internet.email(),
  //     card: faker.helpers.createCard(),
  //     obj: {
  //       name: faker.name.findName(),
  //       email: faker.internet.email(),
  //       card: faker.helpers.createCard()
  //     }
  //   }
  //   collection.insertOne(obj, (err, result) => {
  //     assert.equal(err, null)
  //     assert.equal(1, result.result.n)
  //   })
  // }

  const clone_db = client.db(newDbName)
  db.listCollections().toArray(function(err, colls) {
    colls.forEach(coll => {
      const collName = coll.name
      db.collection(collName).find({}).toArray((err, result) => {
        const c_collection = clone_db.collection(collName)
        c_collection.insertMany(result, (err, success) => {
          console.log(success);
        })
      })
    })
    // client.close();
  })
});
