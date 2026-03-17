import Array "mo:core/Array";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Set "mo:core/Set";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Company Snapshot
  // ----------------------------------------------------------------------------
  public type Snapshot = {
    id : Text;
    name : Text;
    revenue : Float;
    netIncome : Float;
    grossProfit : Float;
    totalAssets : Float;
    totalEquity : Float;
    currentAssets : Float;
    currentLiabilities : Float;
    inventory : Float;
    cogs : Float;
    ebit : Float;
    interestExpense : Float;
    marketCap : Float;
    bookValuePerShare : Float;
    eps : Float;
    sharePrice : Float;
    enterpriseValue : Float;
    ebitda : Float;
  };

  // User Profile
  // ----------------------------------------------------------------------------
  public type UserProfile = {
    name : Text;
  };

  // Persistent Storage
  // ----------------------------------------------------------------------------
  let bookmarks = Map.empty<Principal, Set.Set<Text>>();
  let snapshots = Map.empty<Principal, Map.Map<Text, Snapshot>>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Authorization & Authentication
  // ----------------------------------------------------------------------------
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Functions
  // ----------------------------------------------------------------------------
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Bookmarks
  // ----------------------------------------------------------------------------
  public shared ({ caller }) func addBookmark(ratioId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can add bookmarks");
    };
    let userBookmarks = switch (bookmarks.get(caller)) {
      case (null) {
        let newSet = Set.empty<Text>();
        bookmarks.add(caller, newSet);
        newSet;
      };
      case (?set) { set };
    };
    userBookmarks.add(ratioId);
  };

  public shared ({ caller }) func removeBookmark(ratioId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can remove bookmarks");
    };
    switch (bookmarks.get(caller)) {
      case (null) { Runtime.trap("No bookmarks found for user") };
      case (?userBookmarks) {
        userBookmarks.remove(ratioId);
      };
    };
  };

  public query ({ caller }) func getBookmarks() : async [Text] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view bookmarks");
    };
    switch (bookmarks.get(caller)) {
      case (null) { [] };
      case (?userBookmarks) { userBookmarks.toArray() };
    };
  };

  // Company Snapshots
  // ----------------------------------------------------------------------------
  public shared ({ caller }) func saveSnapshot(snapshot : Snapshot) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can save snapshots");
    };
    let userSnapshots = switch (snapshots.get(caller)) {
      case (null) {
        let newMap = Map.empty<Text, Snapshot>();
        snapshots.add(caller, newMap);
        newMap;
      };
      case (?map) { map };
    };
    userSnapshots.add(snapshot.id, snapshot);
  };

  public query ({ caller }) func getSnapshots() : async [Snapshot] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view snapshots");
    };
    switch (snapshots.get(caller)) {
      case (null) { [] };
      case (?userSnapshots) {
        userSnapshots.values().toArray();
      };
    };
  };

  public shared ({ caller }) func deleteSnapshot(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can delete snapshots");
    };
    switch (snapshots.get(caller)) {
      case (null) { Runtime.trap("No snapshots found for user") };
      case (?userSnapshots) {
        userSnapshots.remove(id);
      };
    };
  };
};
