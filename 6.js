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
    servo:  { driver: "servo",         pin: 5, connection: "edison" },
    buzzer: { driver: "direct-pin",    pin: 7, connection: "edison" },
    touch:  { driver: "button",        pin: 8, connection: "edison" },
    // analog sensors
    dial:   { driver: "analogSensor",  pin: 0, connection: "edison" },
    // i2c devices
    screen: { driver: "upm-jhd1313m1", connection: "edison" }
  },
  turnLock: function(val) {
    var that = this;
    var currentAngle = that.servo.currentAngle();
    var angle = val.fromScale(0, 1023).toScale(0,180) | 0;
    if (angle <= currentAngle - 3 || angle >= currentAngle + 3) {
      console.log("turning lock:", angle);
      that.servo.angle(angle);
    }
  },
  doorbell: function() {
    var that = this;
    that.buzzer.digitalWrite(1);
    that.writeMessage("Doorbell pressed", "green");
    setTimeout(function() {
      that.reset();
    }, 1000);
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
    this.buzzer.digitalWrite(0);
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

    that.dial.on('analogRead', function(val) {
      that.turnLock(val);
    });
 
    that.touch.on('push', function() {
      that.doorbell();
    }); 
  }
}).start();
