(function() {
   var subscribers = {};

   function identity(data) {
      return data;
   };
   
   function executeSubscriber(sub, event, payload, options) {
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
   }

   function publishEvent(event, payload, options) {
         [].concat(subscribers[event] || []).concat(subscribers['*'] || []).forEach(function(sub) {
         var isAsync = options && (options.async || options.delay);
         if (isAsync) {
            var delay = options.delay || 0;
            setTimeout(function(){ executeSubscriber(sub, event, payload, options) }, delay);
         } else {
            executeSubscriber(sub, event, payload, options);
         }
      });
   }

   var broker = {
      subscribe: function(event, subscriber, options) {
         if (!subscribers[event]) {
            subscribers[event] = [];
         }
         var trans = [identity];
         if (options && options.transformations) {
            var transformations = options.transformations;
            switch (typeof(transformations)) {
               case 'function': {
                  trans = [transformations];
                  break;
               }
               case 'object': {
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
      subscribeAll: function(subscriber, options) {
         return broker.subscribe('*', subscriber, options)
      },
      publish: function(event, payload, options) {
         if (options && options.interval) {
            var task = setInterval(function() { publishEvent(event, payload, options); }, options.interval);
            return function() {
               clearInterval(task);
            };
         } else {
            publishEvent(event, payload, options);
         }
      }
   };

   if (typeof(module) != 'undefined' && module.exports) {
      module.exports = broker;
   } else if (window) {
      window.hg = broker;
   }
})();
