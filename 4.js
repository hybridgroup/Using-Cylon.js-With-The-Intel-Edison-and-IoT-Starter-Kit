"use strict";
 
var cylon = require("cylon");
 
cylon.api({
  host: "0.0.0.0",
  port: "3000",
  ssl: false
});
 
cylon.robot({
  name: "doorbot",
  connections: {
    edison: { adaptor: "intel-iot" }
  },
  devices: {
    // digital sensors
    button: { driver: "button",        pin: 2, connection: "edison" },
    led:    { driver: "led",           pin: 3, connection: "edison" },
    // i2c devices
    screen: { driver: "upm-jhd1313m1", connection: "edison" }
  },
  writeMessage: function(message, color) {
    var that = this;
    var str = message.toString();
    while (str.length < 16) {
      str = str + " ";
    }
    console.log(message);
    that.screen.setCursor(0,0);
    that.screen.write(str);
    switch(color)
    {
      case "red":
        that.screen.setColor(255, 0, 0);
        break;
      case "green":
        that.screen.setColor(0, 255, 0);
        break;
      case "blue":
        that.screen.setColor(0, 0, 255);
        break;
      default:
        that.screen.setColor(255, 255, 255);
        break;
    }
  },
  reset: function() {
    this.writeMessage("Doorbot ready");
    this.led.turnOff();
  },
  work: function() {
    var that = this;
    that.reset();

    that.button.on('push', function() {
      that.led.turnOn();
      that.writeMessage("Lights On", "blue");
    });
 
    that.button.on('release', function() {
      that.reset();
    });
  }
}).start();
