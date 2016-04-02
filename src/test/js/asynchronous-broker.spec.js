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
});
