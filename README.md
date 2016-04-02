# mercury-broker
A lightweight *message broker* for JavaScript

## Main features
- Publish/subscriber semantics, with both synchronous and asynchronous event publishing
- Message payload transformation
- Delayed message delivery
- Periodically message publishing
- Content based event filtering

## You should use mercury-broker because...
- It's very *light* and very simple
- It's a fully opensource solution
- It has no external dependency: no [left-pad](http://blog.npmjs.org/post/141577284765/kik-left-pad-and-npm) risk
- It's available both as npm module and as bower module

## Basic usage
### Require (npm) module
    var hg = require('mercury-broker');
### Including (bower) module
    <script src="/bower_components/mercury-broker/src/main/js/broker.js"><script>
    <script>
        // Global [window.]hg variable is now available
    </script>
### Event subscription    
    var unsubscribe = hg.subscribe('an-event', function(evt, payload) {
        console.log('--', evt, payload);
    });
### Event publication
    broker.publish('an-event', 'Hello, World!');
    // Output: -- an-event Hello, World!
### Subscription removal
    unsubscribe();

## Advanced usage
### Payload transformation
    function toUpper(str) {
        return str.toUpperCase();
    }
    hg.subscribe('an-event', function(evt, payload) {
        console.log(payload);
    }, { transformations: [toUpper]});
    hg.publish('an-event', 'Hello, World!');
    // Output: HELLO, WORLD!
### Multiple payload transformations
        function toUpper(str) {
            return str.toUpperCase();
        }
        function addPrefix(str) {
            return '::' + str;
        }
        hg.subscribe('an-event', function(evt, payload) {
            console.log(payload);
        }, { transformations: [ toUpper, addPrefix ] });
        hg.publish('an-event', 'Hello, World!');
        // Output: ::HELLO, WORLD!
### Asynchronous event delivering
        hg.subscribe('an-event', function() {
          called = true;
        });
        // Non-blocking event publishing: publisher doesn't wait for
        //  subscribers' processing
        hg.publish('an-event', {}, {
          async: true
        });
        console.log(called); // **false**
        setTimeout(function() {
          console.log(called); // **true**
        }, 5);
### Delayed (asynchronous) event delivering
         hg.subscribe('an-event', function() {
            called = true;
         });
         // Delayed event publishing
         hg.publish('an-event', {}, {
           delay: 2000
         });
         console.log(called); // false
         setTimeout(function() {
           console.log(called); // false
         }, 500);
         console.log(called); // false
         setTimeout(function() {
           console.log(called); // false
         }, 1500);
         console.log(called); // false
         setTimeout(function() {
           console.log(called); // true
         }, 2500);
### Periodic event publishing
         hg.subscribe('periodic-event', function() {
            called = true;
         });
         // Publishes 'periodic-event' every 0.2s
         hg.publish('periodic-event', {}, {
           interval: 200
         });

### Periodic event publishing with payload generator function
         hg.subscribe('periodic-event', function(event, payload) {
            console.log(payload.id, payload.text);
         });
         var counter = 0;
         hg.publish('periodic-event', { text: 'Seed text' }, {
           interval: 200,
           generator: function(seed) {
             seed.id = counter;
             seed.text = seed.text + ' - ' + counter;
             counter++;
             return seed;
           }
         });
         // Output is
         // 0 Seed text - 0
         // 1 Seed text - 1
         // 2 Seed text - 2
         // 3 Seed text - 3
         // ...
### Content-based event filtering
         hg.subscribe('an-event', function(event, payload) {
            console.log(payload.it);
         }, { filter: function(payload) { return payload.id % 3 === 0; }});
         // Consumes only events whose payload has id that is multiple of three
         for(var i = 0; i < 10; i++) {
            hg.publish('an-event', { id: i });
         }
         // Output is
         // 0
         // 3
         // 6
         // 9

[Try hg-broker in your browser](https://tonicdev.com/npm/mercury-broker) through [Tonic](tonicdev.com)
