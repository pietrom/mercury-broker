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
/*
  it('fail ever', function() {
    expect(false).toBe(true);
  });
  */
});
