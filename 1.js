"use strict";
 
var cylon = require("cylon");
 
cylon.robot({
  name: "doorbot",
  connections: {
    edison: { adaptor: "intel-iot" }
  },
  devices: {
    led: { driver: "led", pin: 4, connection: "edison" }
  },
  work: function() {
    var that = this;
 
    setInterval(function() {
      that.led.toggle()
    }, 1000);
  }
}).start();
