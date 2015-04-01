"use strict";
 
var cylon = require("cylon");
 
cylon.robot({
  name: "doorbot",
  connections: {
    edison: { adaptor: "intel-iot" }
  },
  devices: {
    // digital sensors
    button: { driver: "button",        pin: 2, connection: "edison" },
    led:    { driver: "led",           pin: 3, connection: "edison" },
  },
  setup: function() {
    this.led.turnOff();
  },
  work: function() {
    var that = this;
    that.setup();

    that.button.on('push', function() {
      that.led.turnOn();
    });
 
    that.button.on('release', function() {
      that.led.turnOff();
    });
  }
}).start();
