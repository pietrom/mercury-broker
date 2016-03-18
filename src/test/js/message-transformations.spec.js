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
});
