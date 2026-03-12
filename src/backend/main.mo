import Float "mo:core/Float";
import Int "mo:core/Int";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";

actor {
  type Position = {
    x : Float;
    y : Float;
    z : Float;
  };

  type DroneState = {
    position : Position;
    batteryLevel : Nat;
    altitude : Float;
    speed : Float;
    heading : Float;
    flightMode : Text;
    status : Text;
    signalStrength : Nat;
    altitudeLimit : Float;
  };

  type LogEntry = {
    timestamp : Int;
    message : Text;
  };

  var position : Position = { x = 0.0; y = 0.0; z = 0.0 };
  var batteryLevel : Nat = 100;
  var altitude : Float = 0.0;
  var speed : Float = 0.0;
  var heading : Float = 0.0;
  var flightMode : Text = "Manual";
  var status : Text = "idle";
  var signalStrength : Nat = 100;
  var altitudeLimit : Float = 120.0;

  var missionLog : [LogEntry] = [];

  func logEvent(message : Text) {
    let entry : LogEntry = {
      timestamp = Time.now();
      message;
    };
    missionLog := Array.append(missionLog, [entry]);
  };

  func updateState(newPosition : Position, newAltitude : Float) {
    position := newPosition;
    altitude := newAltitude;
    logEvent("State updated");
  };

  public shared ({ caller }) func takeoff() : async DroneState {
    if (status == "flying") {
      Runtime.trap("Drone is already flying");
    };

    status := "flying";
    altitude := 1.0;
    logEvent("Drone took off");

    getDroneStateInternal();
  };

  public shared ({ caller }) func land() : async DroneState {
    if (status != "flying") {
      Runtime.trap("Drone is not flying");
    };

    status := "landing";
    logEvent("Landing initiated");
    getDroneStateInternal();
  };

  public shared ({ caller }) func emergencyStop() : async DroneState {
    status := "emergency";
    altitude := 0.0;
    speed := 0.0;
    logEvent("Emergency stop activated");
    getDroneStateInternal();
  };

  public shared ({ caller }) func returnToHome() : async DroneState {
    if (status != "flying") {
      Runtime.trap("Drone is not flying");
    };

    status := "returning";
    logEvent("Returning to home position");
    getDroneStateInternal();
  };

  public shared ({ caller }) func moveForward(distance : Float) : async DroneState {
    if (status != "flying") {
      Runtime.trap("Drone is not flying");
    };

    position := { position with y = position.y + distance };
    logEvent("Moved forward by " # distance.toText() # " meters");
    getDroneStateInternal();
  };

  public shared ({ caller }) func moveBackward(distance : Float) : async DroneState {
    if (status != "flying") {
      Runtime.trap("Drone is not flying");
    };

    position := { position with y = position.y - distance };
    logEvent("Moved backward by " # distance.toText() # " meters");
    getDroneStateInternal();
  };

  public shared ({ caller }) func moveLeft(distance : Float) : async DroneState {
    if (status != "flying") {
      Runtime.trap("Drone is not flying");
    };

    position := { position with x = position.x - distance };
    logEvent("Moved left by " # distance.toText() # " meters");
    getDroneStateInternal();
  };

  public shared ({ caller }) func moveRight(distance : Float) : async DroneState {
    if (status != "flying") {
      Runtime.trap("Drone is not flying");
    };

    position := { position with x = position.x + distance };
    logEvent("Moved right by " # distance.toText() # " meters");
    getDroneStateInternal();
  };

  public shared ({ caller }) func ascend(amount : Float) : async DroneState {
    if (status != "flying") {
      Runtime.trap("Drone is not flying");
    };

    if (altitude + amount > altitudeLimit) {
      Runtime.trap("Altitude limit exceeded");
    };

    altitude += amount;
    logEvent("Ascended by " # amount.toText() # " meters");
    getDroneStateInternal();
  };

  public shared ({ caller }) func descend(amount : Float) : async DroneState {
    if (status != "flying") {
      Runtime.trap("Drone is not flying");
    };

    if (altitude - amount < 0.0) {
      Runtime.trap("Altitude cannot be negative");
    };

    altitude -= amount;
    logEvent("Descended by " # amount.toText() # " meters");
    getDroneStateInternal();
  };

  public shared ({ caller }) func setFlightMode(mode : Text) : async DroneState {
    flightMode := mode;
    logEvent("Flight mode set to " # mode);
    getDroneStateInternal();
  };

  public shared ({ caller }) func setSpeed(newSpeed : Float) : async DroneState {
    if (newSpeed < 1.0 or newSpeed > 20.0) {
      Runtime.trap("Invalid speed value");
    };

    speed := newSpeed;
    logEvent("Speed set to " # newSpeed.toText() # " m/s");
    getDroneStateInternal();
  };

  public shared ({ caller }) func setAltitudeLimit(limit : Float) : async DroneState {
    if (limit < 1.0 or limit > 500.0) {
      Runtime.trap("Invalid altitude limit");
    };

    altitudeLimit := limit;
    logEvent("Altitude limit set to " # limit.toText() # " meters");
    getDroneStateInternal();
  };

  public shared ({ caller }) func captureSnapshot() : async DroneState {
    logEvent("Snapshot captured");
    getDroneStateInternal();
  };

  public query ({ caller }) func getDroneState() : async DroneState {
    getDroneStateInternal();
  };

  public query ({ caller }) func getMissionLog() : async [LogEntry] {
    missionLog
  };

  public shared ({ caller }) func simulateTick() : async () {
    switch (status) {
      case ("flying") {
        if (batteryLevel > 0) { batteryLevel -= 1 };
        if (batteryLevel <= 10 and status != "landing") {
          status := "landing";
          logEvent("Low battery - initiating landing");
        };
      };
      case ("landing") {
        if (altitude > 0.0) {
          altitude -= 0.5;
          if (altitude <= 0.0) {
            altitude := 0.0;
            status := "idle";
            logEvent("Drone has landed");
          };
        };
      };
      case ("returning") {
        if (position.x != 0.0 or position.y != 0.0) {
          position := { x = 0.0; y = 0.0; z = position.z };
          logEvent("Drone returned to home position");
        };
        status := "landing";
      };
      case ("emergency") {
        if (altitude > 0.0) {
          altitude := 0.0;
          speed := 0.0;
          status := "idle";
          logEvent("Emergency landing complete");
        };
      };
      case (_) {};
    };
  };

  func getDroneStateInternal() : DroneState {
    {
      position;
      batteryLevel;
      altitude;
      speed;
      heading;
      flightMode;
      status;
      signalStrength;
      altitudeLimit;
    };
  };
};
