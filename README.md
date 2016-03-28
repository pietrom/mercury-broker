# mercury-broker
A lightweight *message broker* for JavaScript

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
    }, toUpper);
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
        }, [ toUpper, addPrefix ]);
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
         console.log(called); // **false**
         setTimeout(function() {
           console.log(called); // **false**
         }, 500);
         console.log(called); // **false**
         setTimeout(function() {
           console.log(called); // **false**
         }, 1500);
         console.log(called); // **false**
         setTimeout(function() {
           console.log(called); // **true**
         }, 2500);
### Periodic event publishing
         hg.subscribe('periodic-event', function() {
            called = true;
         });
         // Publishes 'periodic-event' every 0.2s
         hg.publish('periodic-event', {}, {
           timeout: 200
         });
[Try hg-broker in your browser](https://tonicdev.com/npm/mercury-broker) through [Tonic](tonicdev.com)
