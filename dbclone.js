const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const dbName = 'ambassador';
const newDbName = "ambassador_stage";

// const url = "mongodb://yaacdev:yaacmydev@mongo1.youareaceo.com:27017,mongo2.youareaceo.com:27017,mongo3.youareaceo.com:27018/ambassador?replicaSet=mongo_youareaceo&authMechanism=SCRAM-SHA-1";
const url_l = `mongodb://127.0.0.1:27017/${newDbName}`;
const url = 'mongodb://yaacdev:yaacmydev@db-stage.youareaceo.com:27017/ambassador'

const client = new MongoClient(url, {
  useNewUrlParser: true,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 1000
});
const client_l = new MongoClient(url_l, {
  useNewUrlParser: true,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 1000
});


client.connect(function(err) {
  if(!err) {
    console.log("success connection parent");
  } else {
    console.log(err)
    return
  }

  client_l.connect((err) => {
    if(!err) {
      console.log("success connection client");
    } else {
      console.log(err)
      return
    }


    const db = client.db(dbName)
    const clone_db = client_l.db(newDbName)

    db.listCollections().toArray(function(err, colls) {
      colls.forEach(coll => {
        const collName = coll.name
        db.collection(collName).find({}).toArray((err, result) => {
          const c_collection = clone_db.collection(collName)
          if(typeof result !== null) {
            if(Array.isArray(result) && result.length > 0) {
              // c_collection.insertMany(result, (err, success) => {
              //   console.log(success);
              // })
              insertDocuments(c_collection, result, function() {
                // client_l.close()
              })
            }
          }
        })
      })
    })
    // client.close()
    // client_l.close()
  })
})

const insertDocuments = function(collection, result, callback) {
  collection.insertMany(result, (err, success) => {
    console.log(success);
    callback(result)
  })
}
