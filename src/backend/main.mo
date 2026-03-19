import Time "mo:core/Time";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";
import Int "mo:core/Int";

actor {
  type VoiceSetting = {
    #male;
    #female;
  };

  type AccentSetting = {
    #us;
    #uk;
    #african;
  };

  type SpeedSetting = {
    #slow;
    #normal;
    #fast;
  };

  type HistoryEntry = {
    id : Nat;
    inputText : Text;
    voice : VoiceSetting;
    accent : AccentSetting;
    speed : SpeedSetting;
    timestamp : Time.Time;
  };

  module HistoryEntry {
    public func compare(entry1 : HistoryEntry, entry2 : HistoryEntry) : Order.Order {
      Int.compare(entry2.timestamp, entry1.timestamp);
    };
  };

  var nextId = 0;
  let entries = Map.empty<Nat, HistoryEntry>();

  public shared ({ caller }) func addHistoryEntry(inputText : Text, voice : VoiceSetting, accent : AccentSetting, speed : SpeedSetting) : async Nat {
    let id = nextId;
    let entry : HistoryEntry = {
      id;
      inputText;
      voice;
      accent;
      speed;
      timestamp = Time.now();
    };
    entries.add(id, entry);
    nextId += 1;
    id;
  };

  public query ({ caller }) func getAllEntries() : async [HistoryEntry] {
    let entriesArray = entries.values().toArray();
    entriesArray.sort();
  };

  public shared ({ caller }) func deleteEntry(id : Nat) : async () {
    if (not entries.containsKey(id)) {
      Runtime.trap("Entry does not exist");
    };
    entries.remove(id);
  };

  public query ({ caller }) func getEntry(id : Nat) : async HistoryEntry {
    switch (entries.get(id)) {
      case (?entry) { entry };
      case (null) { Runtime.trap("Entry does not exist") };
    };
  };
};
