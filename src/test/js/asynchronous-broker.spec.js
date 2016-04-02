var broker = require('../../main/js/broker.js');

describe('Asynchronous message delivery', function() {
   it('Asynchronous publishing should not block publisher', function(done) {
      var called = false;
      broker.subscribe('an-event', function() {
         called = true;
      });
      broker.publish('an-event', {}, {
         async: true
      });
      expect(called).toBe(false);
      setTimeout(function() {
         expect(called).toBe(true);
         done();
      }, 5);
   });

   it('Events can be published specifying delay in millis', function(done) {
      var called = false;
      broker.subscribe('an-event', function() {
         called = true;
      });
      broker.publish('an-event', {}, {
         delay: 1800
      });
      expect(called).toBe(false);
      setTimeout(function() {
         expect(called).toBe(false);
      }, 500);
      setTimeout(function() {
         expect(called).toBe(false);
      }, 1500);
      setTimeout(function() {
         expect(called).toBe(true);
         done();
      }, 2000);
   });

   it('Can publish events perdiodically', function(done) {
      var counter = 0;
      broker.subscribe('periodic-event', function() {
         counter++;
      });
      var stop = broker.publish('periodic-event', {}, { interval: 200 });
      setTimeout(function() { expect(counter).toBe(0); }, 100);
      setTimeout(function() { expect(counter).toBe(1); }, 300);
      setTimeout(function() { expect(counter).toBe(2); }, 500);
      setTimeout(function() { expect(counter).toBe(4); stop(); }, 900);
      setTimeout(function() { expect(counter).toBe(4); done(); }, 1100);
   });

   it('Payload of periodically published events can be generated through provided \'generator\' function', function(done) {
      var generatorCounter = 100;
      var generator = function(seed) {
         seed.id = generatorCounter;
         seed.text = seed.text + ' (' + generatorCounter + ')';
         generatorCounter++;
         return seed;
      }
      var payloads = [];
      broker.subscribe('payload-generator-event', function(event, payload) {
         payloads.push(payload);
      });
      var stop = broker.publish('payload-generator-event', { text: 'Payload text' }, { interval: 100, generator: generator });
      setTimeout(function() {
         stop();
         expect(payloads.length).toBe(3);
         expect(payloads[0].id).toBe(100);
         expect(payloads[1].id).toBe(101);
         expect(payloads[2].id).toBe(102);
         expect(payloads[0].text).toBe('Payload text (100)');
         expect(payloads[1].text).toBe('Payload text (101)');
         expect(payloads[2].text).toBe('Payload text (102)');
         done();
      }, 350);
   });

   it('Asynchronous subscriber\'s exception doesn\'t affect subsequent subscribers', function(done) {
      var firstCalled = false;
      broker.subscribe('exceptional-event', function() {
         firstCalled = true;
      });
      broker.subscribe('exceptional-event', function() {
         throw 'Error in second subscriber';
      });
      var thirdCalled = false;
      broker.subscribe('exceptional-event', function() {
         thirdCalled = true;
      });
      broker.publish('exceptional-event', {}, { async: true });
      setTimeout(function() {
         expect(firstCalled).toBe(true);
         expect(thirdCalled).toBe(true);
         done();
      }, 50);
   });
});
