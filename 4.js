"use strict";
 
var cylon = require("cylon");
 
cylon.api({
  host: "0.0.0.0",
  port: "3000"
});
 
cylon.robot({
  name: "doorbot",
  connections: {
    edison: { adaptor: "intel-iot" }
  },
  devices: {
    led:    { driver: "led",    pin: 4, connection: "edison" },
    touch:  { driver: "button", pin: 8, connection: "edison" },
    screen: { driver: "upm-jhd1313m1",  connection: "edison" }
  },
  writeMessage: function(message) {
    var that = this;
    console.log(message);
    that.screen.clear();
    that.screen.home();
    that.screen.setCursor(0,0);
    that.screen.write(message.toString());
  },
  work: function() {
    var that = this;
 
    that.writeMessage("ready!");
 
    that.touch.on('push', function() {
      that.writeMessage("led is on!");
      that.led.turnOn();
    });
 
    that.touch.on('release', function() {
      that.writeMessage("led is off!");
      that.led.turnOff();
    });
  }
}).start();
