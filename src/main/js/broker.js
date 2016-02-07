var broker = (function() {
  var subscribers = {};
  return {
    subscribe: function(event, subscriber) {
      if(!subscribers[event]) {
        subscribers[event] = [];
      }
      subscribers[event].push(subscriber);

      return function() {
        var index = subscribers[event].indexOf(subscriber);
        subscribers[event].splice(index, 1);
      };
    },
    publish: function(event, payload) {
      subscribers[event].forEach(function(sub) {
        sub(event, payload);
      });
    }
  };
})();
