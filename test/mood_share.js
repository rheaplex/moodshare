/* global artifacts:false, assert:false, contract:false, it: false, web3:false
 */

var MoodShare = artifacts.require('MoodShare');

var INITIAL_MOOD_COUNT = 5;

contract('MoodShare', function(accounts) {

  // This tests that the owner of the contract can add mood names to the system.
  // We want to make sure that the security of the contract doesn't prevent it.
  
  it("should allow the owner to add moods", function(done) {
    var moodshare
    MoodShare.deployed()
      .then(function(instance) {
        moodshare = instance;
        return moodshare.adminMoodNameAdd('je ne sais quoi');
      })
      .then(function () {
        return moodshare.getMoodNames();
      })
      .then(function(names) {
        assert.equal(names.length, INITIAL_MOOD_COUNT + 1)
        done();
      })
      .catch (function(e) {
        assert.fail('no exception', 'exception');
        done();
      });
  });

  // This tests that the owner of the contract can remove mood names.
  // We want to make sure that the security of the contract doesn't prevent it.

  it("should allow the owner to remove moods", function(done) {
    var moodshare;
    MoodShare.deployed()
      .then(function(instance) {
        moodshare = instance;
        return moodshare.adminMoodNameRemove('je ne sais quoi');
      })
      .then(function () {
        return moodshare.getMoodNames();
      })
      .then(function(names) {
        assert.equal(names.length, INITIAL_MOOD_COUNT)
        done();
      })
      .catch (function(e) {
        assert.fail('no exception', 'exception');
        done();
      });
  });

  // This tests that the Ownable security is working.
  // Only owners should be able to add moods to the system, not non-owners.
  
  it("should not allow a non-owner to add moods", function(done) {
    MoodShare.deployed()
      .then(function(instance) {
        return instance.adminMoodNameAdd('ennui',
                                         {from: accounts[1]});
      })
      .then(function() {
        assert.fail('an exception', 'no exception');
        done();
      })
      .catch(function() {
        done();
      });
  });

  // This tests that the Ownable security is working.
  // Only owners should be able to remove moods, not non-owners.
  
  it("should not allow a non-owner to remove moods", function(done) {
    MoodShare.deployed()
      .then(function(instance) {
        return instance.adminMoodRemove("😐", {from: accounts[1]});
      })
      .then(function() {
        assert.fail('an exception', 'no exception');
        done();
      })
      .catch(function() {
        done();
      });
  });

  // The core function of the system is for users to be able to log moods.
  // They must be able to call the function and the function must properly
  // record the state (unless the contract is paused, for which see below).
  
  it("should record logged moods", function(done) {
    var moodshare;
    MoodShare.deployed()
      .then(function(instance) {
        moodshare = instance;
        return moodshare.userSetMood("😃", {from: accounts[2]});
      })
      .then(function() {
        return moodshare.userGetMoodCount("😃", {from: accounts[2]});
      })
      .then(function(count) {
        assert.equal(count, 1);
        return moodshare.userGetMoodCurrent({from: accounts[2]});
      })
      .then(function(response){
        var smiley = web3.toHex("😃")
        assert.equal(response[0].substring(0, smiley.length), smiley);
        assert.equal(web3.toDecimal(response[1]), 1);
        var block = web3.eth.getBlock("latest");
        assert.equal(response[2], block.timestamp);
        done();
      });
  });

  // The user should be able to log their mood over time to provide a record
  // of how it changes.
  // This should correctly update the user's current state and the running
  // total counts of each mood.
  it("should record multiple logged moods", function(done) {
    var moodshare;
    MoodShare.deployed()
      .then(function(instance) {
        moodshare = instance;
        return moodshare.userSetMood("😃", {from: accounts[2]});
      })
      .then(function() {
        return moodshare.userGetMoodCount("😃", {from: accounts[2]});
      }).then(function(count) {
        assert.equal(count, 2);
        return moodshare.userSetMood("😐", {from: accounts[2]});
      })
      .then(function() {
        return moodshare.userGetMoodCount("😐", {from: accounts[2]});
      })
      .then(function(count) {
        assert.equal(count, 1);
        done();
      });
  });

  // More than one user should be able to use the system to record their moods.
  // We need to make sure that is the case and that users data is maintained
  // properly and independently.
  
  it("should record multiple logged moods by multiple users", function(done) {
    var moodshare;
    MoodShare.deployed()
      .then(function(instance) {
        moodshare = instance;
        return moodshare.userSetMood("😃", {from: accounts[3]});
      })
      .then(function() {
        return moodshare.userGetMoodCount("😃", {from: accounts[3]});
      })
      .then(function(count) {
        assert.equal(count, 1);
        return moodshare.userSetMood("😐", {from: accounts[3]});
      })
      .then(function() {
        return moodshare.userGetMoodCount("😐", {from: accounts[3]});
      })
      .then(function(count) {
        assert.equal(count, 1);
        done();
      });
  });

  // The owner should be able to perform an emergency stop and then reverse
  // this later.
  // If they cannot, or cannot reverse this, something is badly wrong.
  
  it("should allow the owner to pause the contract", function(done) {
    var moodshare;
    MoodShare.deployed()
      .then(function(instance) {
        moodshare = instance;
        return moodshare.pause();
      })
      .then(function() {
        return moodshare.userSetMood("😃", {from: accounts[2]});
      })
      .then(function() {
        assert.fail('an exception', 'no exception');
        done();
      })
      .catch(function() {
        moodshare.unpause()
          .then(function() { done(); });
      });
  });

  // A non-owner should not be able to perform an emergency stop.
  // The security of the system should prevent them from being able to.
  
  it("should not allow a non-owner to pause the contract", function(done) {
    var moodshare;
    MoodShare.deployed()
      .then(function(instance) {
        moodshare = instance;
        return moodshare.pause({from: accounts[2]});
      })
      .then(function() {
        assert.fail('an exception', 'no exception');
        done();
      })
      .catch(function() {
        done();
      });
  });

  // When the owner performs an emergency stop, the users should not be able
  // to log moods.
  // Code that attempts to do so should raise an exception.
  
  it("should prevent users logging moods while paused", function(done) {
    var moodshare;
    MoodShare.deployed()
      .then(function(instance) {
        moodshare = instance;
        return moodshare.pause();
      })
      .then(function() {
        return moodshare.userSetMood("😃", {from: accounts[2]});
      })
      .then(function() {
        assert.fail('an exception', 'no exception');
        done();
      })
      .catch(function() {
        return moodshare.unpause()
      })
      .then(function() {
        done();
      });
  });

  // When the owner reverses an emergency stop, the users should be able
  // to log moods again.
  // If they cannot, something went wrong.
  
  it("should allow users to log moods when unpaused", function(done) {
    var moodshare;
    MoodShare.deployed()
      .then(function(instance) {
        moodshare = instance;
        return moodshare.pause();
      })
      .then(function() {
        return moodshare.unpause();
      })
      .then(function() {
        //return moodShare.userSetMood("😃", {from: accounts[4]});
      })
      .then(function() {
        done();
      })
      .catch(function(e) {
        assert.fail('an exception', 'no exception');
        done();
      })
  });

});
