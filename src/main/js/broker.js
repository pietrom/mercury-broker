(function() {
   var subscribers = {};

   function identity(data) {
      return data;
   };

   var broker = {
      subscribe: function(event, subscriber, transformations) {
         if (!subscribers[event]) {
            subscribers[event] = [];
         }
         var trans = [identity];
         if (transformations) {
            switch (typeof(transformations)) {
               case 'function':
                  {
                     trans = [transformations];
                     break;
                  }
               case 'object':
                  {
                     if (transformations.length) {
                        trans = transformations;
                     }
                     break;
                  }
            }
         }
         subscribers[event].push({
            sub: subscriber,
            trans: trans
         });

         return function() {
            var index = subscribers[event].indexOf(subscriber);
            subscribers[event].splice(index, 1);
         };
      },
      publish: function(event, payload, options) {
         var publishEvent = function() {
            subscribers[event].forEach(function(sub) {
               var executeSubscriber = function() {
                  var clonedPayload = JSON.parse(JSON.stringify(payload));
                  sub.sub(event, sub.trans.reduce(function(data, fn) {
                     return fn(data);
                  }, clonedPayload));
               };
               var isAsync = options && (options.async || options.delay);
               if (isAsync) {
                  var delay = options.delay || 0;
                  setTimeout(executeSubscriber, delay);
               } else {
                  try {
                     executeSubscriber();
                  } catch(err) {
                     console.log('Error during synchronous subscriber execution', err);
                  }
               }
            });
         };

         if (options && options.interval) {
            var task = setInterval(publishEvent, options.interval);
            return function() {
               clearInterval(task);
            };
         } else {
            publishEvent();
         }
      }
   };

   if (typeof(module) != 'undefined' && module.exports) {
      module.exports = broker;
   } else if (window) {
      window.hg = broker;
   }
})();
