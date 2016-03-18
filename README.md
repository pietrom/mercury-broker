# mercury-boker
A lightweight *message broker* for JavaScript

## Simple usage
### Require module
    var mercury = require('mercury-broker');
### Event subscription    
    var unsubscribe = mercury.subscribe('an-event', function(evt, payload) {
        console.log('--', evt, payload);
    });
### Event publication
    broker.publish('an-event', 'Hello, World!');
    // Output: -- an-event Hello, World!
### Subscription removal
    unsubscribe();

[Try mercury-broker in yout browser](https://tonicdev.com/npm/mercury-broker) through [Tonic](tonicdev.com)
