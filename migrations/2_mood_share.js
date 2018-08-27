/* global artifacts:false */

var DataStoreLibrary = artifacts.require("./DataStoreLibrary.sol");

var MoodShare = artifacts.require("./MoodShare.sol");

module.exports = function(deployer) {
  var moodshare;
  deployer.deploy(DataStoreLibrary)
    .then(function(library) {
      deployer.link(DataStoreLibrary, MoodShare);
      return deployer.deploy(MoodShare)
    }).then(function(instance) {
      moodshare = instance;
      // Frowning face with open mouth
      return moodshare.adminMoodNameAdd("😦");
    }).then(function() {
      // Frowning face
      return moodshare.adminMoodNameAdd("🙁");
    }).then(function() {
      // Neutral face
      return moodshare.adminMoodNameAdd("😐");
    }).then(function() {
      // Smiling face
      return moodshare.adminMoodNameAdd("🙂");
    }).then(function() {
      // Smiling face with open mouth
      return moodshare.adminMoodNameAdd("😃");
    });
};
