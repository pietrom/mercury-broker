var Jasmine = require('jasmine');
var jasmine = new Jasmine();
var reporters = require('jasmine-reporters');
var consoleReporter = new reporters.TerminalReporter({ verbosity: 3, color: true });

jasmine.loadConfigFile('spec/support/jasmine.json');
jasmine.addReporter(consoleReporter);
jasmine.execute();
