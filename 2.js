"use strict";
 
var cylon = require("cylon");
 
cylon.robot({
  name: "doorbot",
  connections: {
    edison: { adaptor: "intel-iot" }
  },
  devices: {
    led:    { driver: "led",    pin: 4, connection: "edison" },
    touch:  { driver: "button", pin: 8, connection: "edison" }
  },
  work: function() {
    var that = this;
 
    that.touch.on('push', function() {
      that.led.turnOn();
    });
 
    that.touch.on('release', function() {
      that.led.turnOff();
    });
  }
}).start();
