import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

class SampleCollection extends Mongo.Collection {

}

export const Sample = new SampleCollection('Sample', { idGeneration: 'MONGO' });

Sample.deny({
  insert() {
    return true;
  },
  update() {
    return true;
  },
  remove() {
    return true;
  },
});

Sample.Schema = new SimpleSchema({
  network_id: {
    type: Mongo.ObjectID
  },
  collection_name: {
    type: String
  },
  doc_id: {
    type: Mongo.ObjectID
  },
  thing_to_update: {
    type: String
  }
});

Sample.attachSchema(Sample.Schema);

Meteor.startup(() => {

  // Test: Meteor 1.4.1.1
  // Each case below, I run 'meteor reset;meteor' to clear the db state
  //
  // The error is:
  // Exception in Mongo write: TypeError: Cannot read property 'indexOf' of undefined at Function.MongoConnection._isCannotChangeIdError (packages/mongo/mongo_driver.js:636:7)
  //
  // Note that workaround is to findOne() -> Insert / Update

  //
  // Attempt 1: Upsert statement that worked in Meteor 1.3.X, now fails  in mongo_driver.js:636
  //
  Sample.upsert({
      network_id: new Mongo.ObjectID('44915733af80844fa1cef07a'),
      collection_name: 'blah',
      doc_id: new Mongo.ObjectID('44915733af80844fa1cef07b')
    },
    {
      $set: { thing_to_update: 'item1' }
    });

  //
  // Attempt 2: Update style -- same error
  //
  // Sample.update(
  //   {
  //     network_id: new Mongo.ObjectID('44915733af80844fa1cef07a'),
  //     collection_name: 'blah',
  //     doc_id: new Mongo.ObjectID('44915733af80844fa1cef07b')
  //   },
  //   {
  //     $set: { thing_to_update: 'item1' }
  //   },
  //   { upsert: true }
  // );

  //
  // Attempt 3: Update style with $setOnInsert -- Just playing around now; same failure
  //
  // Sample.update(
  //   {
  //     network_id: new Mongo.ObjectID('44915733af80844fa1cef07a'),
  //     collection_name: 'blah',
  //     doc_id: new Mongo.ObjectID('44915733af80844fa1cef07b')
  //   },
  //   {
  //     $set: { thing_to_update: 'item1' },
  //     $setOnInsert: {
  //       network_id: new Mongo.ObjectID('44915733af80844fa1cef07a'),
  //       collection_name: 'blah',
  //       doc_id: new Mongo.ObjectID('44915733af80844fa1cef07b')
  //     }
  //   },
  //   { upsert: true }
  // );

  //
  // Attempt 4: Upsert with explicit set; same failure
  //
  // Sample.upsert({
  //     network_id: new Mongo.ObjectID('44915733af80844fa1cef07a'),
  //     collection_name: 'blah',
  //     doc_id: new Mongo.ObjectID('44915733af80844fa1cef07b')
  //   },
  //   {
  //     $set: {
  //       network_id: new Mongo.ObjectID('44915733af80844fa1cef07a'),
  //       collection_name: 'blah',
  //       doc_id: new Mongo.ObjectID('44915733af80844fa1cef07b'),
  //       thing_to_update: 'item1'
  //     }
  //   });
});
