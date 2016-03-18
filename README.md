# hg-boker
A lightweight *message broker* for JavaScript

## Simple usage
### Require module
    var hg = require('mercury-broker');
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
        function toUpper(str) {
            return '::' + str;
        }
        hg.subscribe('an-event', function(evt, payload) {
            console.log(payload);
        }, [ toUpper, addPrefix ]);
        hg.publish('an-event', 'Hello, World!');
        // Output: ::HELLO, WORLD!

[Try hg-broker in your browser](https://tonicdev.com/npm/hg-broker) through [Tonic](tonicdev.com)
