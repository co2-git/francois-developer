#!/usr/bin/env node
// division-by-zero-test.js

var vows = require('vows'),
    assert = require('assert'),
    path = require('path'),
    main = require('lib-import').setPath(path.dirname(__dirname)),
    json = require('../package.json');

// Create a Test Suite
vows.describe('Library test').addBatch({
  'When getting help': {
    topic: function () {
      return main('lib/help');
    },

    'it should not return an error': function (err, help) {
      assert.isNull     (err);
    },

    'it should emit a "message" event': function (help) {
      assert.isArray      (help._vowsEmitedEvents.message);
      assert.isArray      (help._vowsEmitedEvents.message[0]);
      assert.isString     (help._vowsEmitedEvents.message[0][0]);
    },

    'it should emit a "done" event with an array of actions': function (help) {
      assert.isArray    (help._vowsEmitedEvents.done);
    }
  },

  'When getting version': {
    topic: function () {
      return main('lib/version');
    },

    'it should not return an error': function (err, version) {
      assert.isNull   (err);
    },

    'it should emit a "message" event with the version name in it': function (version) {
      assert.isArray        (version._vowsEmitedEvents.message);
      assert.isArray        (version._vowsEmitedEvents.message[0]);
      assert.strictEqual    (version._vowsEmitedEvents.message[0][0], json.version);
    },

    'it should emit a "done" event with the version name in it': function (version) {
      assert.isArray        (version._vowsEmitedEvents.done);
      assert.isArray        (version._vowsEmitedEvents.done[0]);
      assert.strictEqual    (version._vowsEmitedEvents.done[0][0], json.version);
    }
  },

  'When getting path': {
    topic: function () {
      return main('lib/path');
    },

    'it should not return an error': function (err, $path) {
      assert.isNull   (err);
    },

    'it should emit a "message" event with the path name in it': function ($path) {
      assert.isArray        ($path._vowsEmitedEvents.message);
      assert.isArray        ($path._vowsEmitedEvents.message[0]);
      assert.strictEqual    ($path._vowsEmitedEvents.message[0][0], path.dirname(__dirname));
    },

    'it should emit a "done" event with the path name in it': function ($path) {
      assert.isArray        ($path._vowsEmitedEvents.done);
      assert.isArray        ($path._vowsEmitedEvents.done[0]);
      assert.strictEqual    ($path._vowsEmitedEvents.done[0][0], path.dirname(__dirname));
    }
  }
})
// .run(function () {
//   console.log(arguments);
// }); // Run it
.export(module);