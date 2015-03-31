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
    servo:  { driver: "servo",        pin: 3, connection: "edison" },
    led:    { driver: "led",          pin: 4, connection: "edison" },
    buzzer: { driver: "direct-pin",   pin: 7, connection: "edison" },
    touch:  { driver: "button",       pin: 8, connection: "edison" },
    // analog sensors
    dial:   { driver: "analogSensor", pin: 0, connection: "edison" },
    // i2c devices
    screen: { driver: "upm-jhd1313m1", connection: "edison" }
  },
  doorbell: function() {
    var that = this;
    that.buzzer.digitalWrite(1);
    that.writeMessage("anybody home?", "green");
    setTimeout(function() {
      that.writeMessage("ready!");
      that.buzzer.digitalWrite(0);
    }, 1000);
  },
  turnLock: function(val) {
    var that = this;
    var angle = val.fromScale(0, 1023).toScale(0,180) | 0;
    console.log("turning lock:", angle);
    that.servo.angle(angle);
  },
  writeMessage: function(message, color) {
    var that = this;
    console.log(message);
    that.screen.clear();
    that.screen.home();
    that.screen.setCursor(0,0);
    that.screen.write(message.toString());
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
  work: function() {
    var that = this;
 
    that.writeMessage("ready!");
 
    that.dial.on('analogRead', function(val) {
      that.turnLock(val);
    });
 
    that.touch.on('push', function() {
      that.doorbell();
    });
  }
}).start();
