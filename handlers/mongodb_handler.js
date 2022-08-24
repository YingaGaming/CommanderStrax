/* Copyright (C) 2019 | Xenorio - Management | All Rights Reserved
 * Unauthorized copying, distributing, and using of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Marcus Huber (Xenorio) <realxenorio@gmail.com>
 */

var MongoClient = require('mongodb').MongoClient;

const server = 'mongodb://127.0.0.1:27017/';

const db_name = 'YingaBot'


module.exports.createDB = (cb) => {
    MongoClient.connect(server + db_name, function(err, db) {
        if (err) return cb(false, err);
        console.log(`Database "${db_name}" created!`);
        db.close();
        if (cb) cb(true);
    });
}

module.exports.createCollection = (name, cb) => {
    MongoClient.connect(server, (err, db) => {
        if (err) return cb(false, err);

        var dbo = db.db(db_name);
        dbo.createCollection(name, function(err, res) {
            if (err) return cb(false, err);
            console.log(`Collection "${name}" created in DB "${db_name}"!`);
            db.close();
            if (cb) cb(true)
        });
    })
}


module.exports.insertObject = (collection, obj, cb) => {

    MongoClient.connect(server, (err, db) => {
        if (err) return cb(false, err);

        var dbo = db.db(db_name);

        dbo.collection(collection).insertOne(obj, (err, res) => {
            if (err) return cb(false, err);
            db.close()
            if (cb) cb(true)
        })
    })
}

module.exports.query = (collection, query, cb) => {
    MongoClient.connect(server, (err, db) => {
        if (err) return cb(false, err);

        var dbo = db.db(db_name);

        dbo.collection(collection).find(query).toArray(function(err, result) {
            if (err) return cb(false, err);
            db.close();
            if (cb) cb(result)
        });
    })
}

module.exports.update = (collection, query, newvals, cb) => {
    MongoClient.connect(server, (err, db) => {
        if (err) return cb(false, err);

        var dbo = db.db(db_name);

        obj = {
            $set: newvals
        }

        dbo.collection(collection).updateOne(query, obj, function(err, res) {
            if (err) return cb(false, err);
            db.close();
            if (cb) cb(true)
        });
    })
}

module.exports.delete = (collection, query, cb) => {
    MongoClient.connect(server, (err, db) => {
        if (err) return cb(false, err);

        var dbo = db.db(db_name);

        dbo.collection(collection).deleteOne(query, function(err, res) {
            if (err) return cb(false, err);
            db.close();
            if (cb) cb(true)
        });
    })
}
