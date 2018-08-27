pragma solidity ^0.4.22;

import 'openzeppelin-solidity/contracts/lifecycle/Pausable.sol';

import './DataStoreLibrary.sol';

/** @title MoodShare */
/** @dev A version of the mood tracking contract using a library implementing the Unstructured Storage pattern. */ 
contract MoodShare is Pausable {

    // Constants
    
    // Storage keys for users' current moods.
    bytes32 constant private CURRENT_MOOD_NAME = 'current-mood-name';
    bytes32 constant private CURRENT_MOOD_TIMESTAMP = 'current-mood-timestamp';

    // Events
    
    event UserMoodLogged(address user, bytes32 mood, uint256 count);

    event AdminMoodAdded(bytes32 moodName);
    event AdminMoodRemoved(bytes32 moodName);

    // Storage
    
    DataStoreLibrary.Data data;

    // We need to return this array, so it cannot be a string array
    bytes32[] private moodNames;

    // Modifiers

    // Make sure the mood is in moodNames
    modifier knownMood (bytes32 moodName) {
        uint256 index;
        bool found;
        (index, found) = getMoodIndex(moodName);
        require(found);
        _;
    }

    // Functions

    // User functions
    
    /** @dev set the user's current mood and update their mood totals.
      * @param moodName The mood to set for the user.
      */
    function userSetMood (bytes32 moodName)
        public
        whenNotPaused()
        knownMood(moodName)
    {
        uint256 count = DataStoreLibrary.getUintData(
            data,
            msg.sender,
            moodName
        );
        count++;
        DataStoreLibrary.setUintData(data, msg.sender, moodName, count);
        DataStoreLibrary.setBytesData(
            data,
            msg.sender,
            CURRENT_MOOD_NAME,
            moodName
        );
        DataStoreLibrary.setUintData(
            data,
            msg.sender,
            CURRENT_MOOD_TIMESTAMP,
            block.timestamp
        );
        emit UserMoodLogged(msg.sender, moodName, count);
    }

    /** @dev Get the user's total count for this mood.
      * @param moodName The mood to get for the user.
      * @return The count of total number of times user has logged this mood.
      */
    function userGetMoodCount (bytes32 moodName) public view
        whenNotPaused()
        returns (uint256 count)
    {
        count = DataStoreLibrary.getUintData(data, msg.sender, moodName);
    }

    /** @dev Get the count of the user's currently set mood.
      * @return The user's current mood, the number of times the user has logged their current mood, and the UNIX time of the block it was last updated in.
      */
    function userGetMoodCurrent () public view
        whenNotPaused()
        returns (bytes32 moodName, uint256 moodCount, uint256 moodUpdatedAt)
    {
        moodName = DataStoreLibrary.getBytesData(
            data,
            msg.sender,
            CURRENT_MOOD_NAME
        );
        moodCount = DataStoreLibrary.getUintData(
            data,
            msg.sender,
            moodName
            );
        moodUpdatedAt = DataStoreLibrary.getUintData(
            data,
            msg.sender,
            CURRENT_MOOD_TIMESTAMP
        );
    }

    // Admin functions
    
    /* @dev Add a mood name, represented as bytes32.
     * @param moodName The name of the mood to add.
     */
    function adminMoodNameAdd(bytes32 moodName)
        public
        onlyOwner()
    {
        uint256 index;
        bool found;
        (index, found) = getMoodIndex(moodName);

        // Found? don't add it again
        if (found) {
            return;
        }
        moodNames.push(moodName);
        emit AdminMoodAdded(moodName);
    }
    
    /** @dev This removes a mood name, if contained. It is not designed to handle large arrays, it will run out of gas in that scenario.
      * @param moodName The mood name to remove.
      */
    function adminMoodNameRemove(bytes32 moodName)
        public
        onlyOwner()
    {
        uint256 index;
        bool found;
        (index, found) = getMoodIndex(moodName);
        // Not found? There's nothing to remove
        if (! found) {
            return;
        }
        // Delete the element and roll down those above it.
        for (uint i = index; i < moodNames.length-1; i++ ) {
            moodNames[i] = moodNames[i+1];
        }
        delete moodNames[moodNames.length - 1];
        moodNames.length--;
        emit AdminMoodRemoved(moodName);
    }

    // Utility code
        
    /* @dev Get the moods the system currently supports.
     * @return The mood name strings currently in use, as bytes32.
     */
    function getMoodNames() public view returns (bytes32[] names) {
        names = moodNames;
    }

    /** @dev Determine the mood's index in the mood array (or none).
      * @param moodName The name of the mood to find the index of.
      * @return the index of the mood, only valid if found is true.
      */
    function getMoodIndex(bytes32 moodName) private view
        returns (uint256 index, bool found)
    {
        found = false;
        // Find name in moodNames
        for (index = 0; index < moodNames.length; index++) {
            if ( moodNames[index] == moodName ) {
                found = true;
                break;
            }
        }
    }

}
