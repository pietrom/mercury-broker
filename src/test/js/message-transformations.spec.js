var hg = require('../../main/js/broker.js');

describe('broker', function() {
   it('can provide paylod transformation contextually to subscription', function() {
      var result = null;
      hg.subscribe('an-event', function(evt, payload) {
         result = evt + ': ' + payload;
      }, function(data) {
         return data.toUpperCase();
      });
      hg.publish('an-event', 'Hello, World!');
      expect(result).toBe('an-event: HELLO, WORLD!');
   });

   it('can provide multiple paylod transformation to be applied in sequence', function() {
      var result = null;
      hg.subscribe('an-event', function(evt, payload) {
         result = evt + ': ' + payload;
      }, [function(data) {
         return data.toUpperCase();
      }, function(data) {
         return data + '?!';
      }]);
      hg.publish('an-event', 'Hello, World!');
      expect(result).toBe('an-event: HELLO, WORLD!?!');
   });

   it('payload transformations can\'t have cross-subscriber side effects', function() {
      var result0 = null;
      hg.subscribe('cross-event', function(evt, payload) {
         result0 = payload.text;
      }, function(data) {
         data.text = data.text.toUpperCase();
         return data;
      });

      var result1 = null;
      hg.subscribe('cross-event', function(evt, payload) {
         result1 = payload.text;
      });

      hg.publish('cross-event', { text: 'Hello, World!' });
      expect(result0).toBe('HELLO, WORLD!');
      expect(result1).toBe('Hello, World!');
   });
});
