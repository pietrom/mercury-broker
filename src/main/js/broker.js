(function() {
   var subscribers = {};

   function identity(data) {
      return data;
   };

   var broker = {
      subscribe: function(event, subscriber, options) {
         if (!subscribers[event]) {
            subscribers[event] = [];
         }
         var trans = [identity];
         if (options && options.transformations) {
            var transformations = options.transformations;
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
            trans: trans,
            options: options
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
                  try {
                     var computedPayload = JSON.parse(JSON.stringify(payload));
                     if(options && options.generator) {
                        computedPayload = options.generator(computedPayload);
                     }
                     computedPayload = sub.trans.reduce(function(data, fn) {
                        return fn(data);
                     }, computedPayload);
                     if(!sub.options || !sub.options.filter || sub.options.filter(computedPayload)) {
                        sub.sub(event, computedPayload);
                     }
                  } catch(err) {
                     console.log('Error during subscriber execution', err);
                  }

               };
               var isAsync = options && (options.async || options.delay);
               if (isAsync) {
                  var delay = options.delay || 0;
                  setTimeout(executeSubscriber, delay);
               } else {
                  executeSubscriber();
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
