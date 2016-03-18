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
});
