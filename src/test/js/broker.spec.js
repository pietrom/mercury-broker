var broker = require('../../main/js/broker.js');

describe('broker', function() {
   it('can subscribe', function() {
      var timesCalled = 0;
      broker.subscribe('an-event', function() {
         timesCalled++;
      });
      broker.publish('an-event', {});
      broker.publish('an-event', {});
      broker.publish('an-event', {});
      expect(timesCalled).toBe(3);
   });

   it('can subscribe to all events', function() {
      var timesCalled = 0;
      broker.subscribeAll(function() {
         timesCalled++;
      });
      broker.publish('an-event-one', {});
      broker.publish('an-event-two', {});
      broker.publish('an-event-three', {});
      expect(timesCalled).toBe(3);
   });

   it('can unregister', function() {
      var timesCalled = 0;
      var unregister = broker.subscribe('an-event', function() {
         timesCalled++;
      });
      broker.publish('an-event', {});
      unregister();
      broker.publish('an-event', {});
      broker.publish('an-event', {});
      expect(timesCalled).toBe(1);
   });

   it('can provide paylod for events', function() {
      var delivered = null;
      broker.subscribe('an-event', function(evt, payload) {
         delivered = evt + ': ' + payload;
      });
      broker.publish('an-event', 'foobar');
      expect(delivered).toBe('an-event: foobar');
   });

   it('can register multiple subscribers', function() {
      var delivered0 = null;
      broker.subscribe('an-event', function(evt, payload) {
         delivered0 = evt + ': ' + payload;
      });
      var delivered1 = null;
      broker.subscribe('an-event', function(evt, payload) {
         delivered1 = payload + ' [' + evt + ']';
      });
      broker.publish('an-event', 'foobar');
      expect(delivered0).toBe('an-event: foobar');
      expect(delivered1).toBe('foobar [an-event]');
   });

   it('Synchronous subscriber\'s exception doesn\'t affect subsequent subscribers', function() {
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
      broker.publish('exceptional-event', {});
      expect(firstCalled).toBe(true);
      expect(thirdCalled).toBe(true);
   });
   it('can handle different events with different subscribers', function() {
      var delivered0 = null;
      broker.subscribe('an-event', function(evt, payload) {
         delivered0 = evt + ': ' + payload;
      });
      var delivered1 = null;
      broker.subscribe('another-event', function(evt, payload) {
         delivered1 = payload + ' [' + evt + ']';
      });
      broker.publish('an-event', 'foobar');
      expect(delivered0).toBe('an-event: foobar');
      expect(delivered1).toBe(null);
   });
   it('Subscriber can filter events providing predicates to be applied to payload', function() {
      var deliveredCount0 = 0;
      broker.subscribe('filtered-event', function() { deliveredCount0++; });
      var deliveredCount1 = 0;
      broker.subscribe('filtered-event', function() { deliveredCount1++; }, { filter: function(payload) {
         return payload.id % 3 === 0;
      }});
      for(var i = 0; i < 6; i++) {
         broker.publish('filtered-event', { id: i });
      }
      expect(deliveredCount0).toBe(6);
      expect(deliveredCount1).toBe(2);
   });
});
