/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

import {MongoClient, ObjectID} from 'mongodb';

let itemsCollection;

MongoClient.connect('mongodb://127.0.0.1:27017/relay', (error, db) => {
  if (error) {
    console.error(error);
    process.exit(-1);
  }
  itemsCollection = db.collection('items');
  itemsCollection.find().toArray((error, result) => {
    if (error) {
      console.error(error);
      process.exit(-1);
    } else {
      if (!result.length) {
        console.log('inserting initial data');
        itemsCollection.insert([
          {name: 'foo', likes: 0},
          {name: 'bar', likes: 0}
        ]);
      }
    }
  });
});


export class Item extends Object {}


function itemsFromData(data) {
  const item = new Item();
  item.id = data._id.toString();
  item.name = data.name;
  item.likes = data.likes;
  return item;
}

export function getItems() {
  return new Promise((resolve, reject) => {
    itemsCollection.find().toArray((error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result.map(itemsFromData));
      }
    });
  });
}

export function getItem(id) {
  return new Promise((resolve, reject) => {
    itemsCollection.findOne({_id: new ObjectID(id)}, (error, data) => {
      if (error) {
        reject(error);
      } else {
        resolve(itemsFromData(data));
      }
    });
  });
}

export function likeItem(id) {
  return new Promise((resolve, reject) => {
    itemsCollection.update({_id: new ObjectID(id)}, {$inc: {likes: 1}}, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}
