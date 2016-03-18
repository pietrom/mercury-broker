var subscribers = {};

function identity(data) {
   return data;
};

var broker = {
  subscribe: function(event, subscriber, transformation) {
    if(!subscribers[event]) {
      subscribers[event] = [];
    }
    subscribers[event].push({sub: subscriber, trans: transformation || identity});

    return function() {
      var index = subscribers[event].indexOf(subscriber);
      subscribers[event].splice(index, 1);
    };
  },
  publish: function(event, payload) {
    subscribers[event].forEach(function(sub) {
      sub.sub(event, sub.trans(payload));
    });
  }
};

module.exports = broker;
