var EventEmitter = require('events').EventEmitter;


var Mu = function() {
    EventEmitter.call(this);
    this.queue = [];
    this.dospotify = null;
    return this;
}

var p = Mu.prototype = Object.create(EventEmitter.prototype);


p.add = function(t) {
    this.queue.push(t);
};

p.getQueue = function(t) {
    return this.queue;
};

p.isEmpty = function(t) {
    return this.queue.length == 0;
};

p.isMany = function(t) {
    return this.queue.length > 1;
};

p.playNext = function() {
    this.queue.shift();
    if (this.queue.length > 1) {
        dospotify.play(this.queue[0]);
    }
};

p.init = function(dspf) {
    this.dospotify = dspf;
    return this;
};

exports.instance = new Mu();
