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
});
