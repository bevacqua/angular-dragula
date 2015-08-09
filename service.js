'use strict';

var dragula = require('dragula');
var dragulaKey = '$$dragula';
var replicateEvents = require('./replicate-events');

function dragulaService () {
  return {
    add: add,
    find: find,
    options: setOptions,
    destroy: destroy
  };
  function getOrCreateCtx (scope) {
    var ctx = scope[dragulaKey];
    if (!ctx) {
      ctx = scope[dragulaKey] = {
        bags: []
      };
    }
    return ctx;
  }
  function add (scope, name, drake, angular) {
    var bag = find(scope, name);
    if (bag) {
      throw new Error('Bag named: "' + name + '" already exists in same angular scope.');
    }
    var ctx = getOrCreateCtx(scope);
    bag = {
      name: name,
      drake: drake
    };
    ctx.bags.push(bag);
    replicateEvents(angular, bag, scope);
    return bag;
  }
  function find (scope, name) {
    var bags = getOrCreateCtx(scope).bags;
    for (var i = 0; i < bags.length; i++) {
      if (bags[i].name === name) {
        return bags[i];
      }
    }
  }
  function destroy (scope, name) {
    var bags = getOrCreateCtx(scope).bags;
    var bag = find(scope, name);
    var i = bags.indexOf(bag);
    bags.splice(i, 1);
    bag.drake.destroy();
  }
  function setOptions (scope, name, options, angular) {
    add(scope, name, dragula(options), angular);
  }
}

module.exports = dragulaService;
