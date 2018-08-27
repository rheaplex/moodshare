pragma solidity ^0.4.22;

/** @title Data Store Libary */
/** @dev I was working on this to use in the upgradeable contract version. */
library DataStoreLibrary {

    struct Data {
        mapping ( bytes32 => int256 ) intData;
        mapping ( bytes32 => uint256 ) uintData;
        mapping ( bytes32 => string ) stringData;
        mapping ( bytes32 => bytes32 ) bytesData;
    }

    /** @dev Hashes the scope (an account or contract address) and key together
      *      to create a unique identifier for use in a mapping.
      * @param scope The address of the contract or account setting the key.
      * @param key The key for the value in this scope.
      * @return hash The unique identifier for use in a mapping.
      */
    function hashScopeKey (address scope, bytes32 key)
        public
        pure
        returns (bytes32 hash)
    {
        hash = sha256(abi.encodePacked(scope, key));
    }

    /** dev Set the int256 value under the key in the scope of the address.
      * @param scope The address of the contract or account setting the key.
      * @param key The key for the value in this scope.
      * @param value The int256 value to set under the key in the scope.
      */
    function setIntData (
        Data storage self,
        address scope,
        bytes32 key,
        int256 value
    )
        public
    {
        bytes32 keyHash = hashScopeKey(scope, key);
        self.intData[ keyHash ] = value;
    }

    /** dev Get the int256 value under the key in the scope of the address.
      * @param scope The address of the contract or account setting the key.
      * @param key The key for the value in this scope.
      * @return value The int256 value stored under the key in the scope.
      */
    function getIntData (Data storage self, address scope, bytes32 key)
        public
        view
        returns (int256 value)
    {
        bytes32 keyHash = hashScopeKey(scope, key);
        value = self.intData[ keyHash ];
    }

    /** dev Set the uint256 value under the key in the scope of the address.
      * @param scope The address of the contract or account setting the key.
      * @param key The key for the value in this scope.
      * @param value The uint256 value to set under the key in the scope.
      */
    function setUintData (
        Data storage self,
        address scope,
        bytes32 key,
        uint256 value
    )
        public
    {
        bytes32 keyHash = hashScopeKey(scope, key);
        self.uintData[ keyHash ] = value;
    }

    /** dev Get the uint256 value under the key in the scope of the address.
      * @param scope The address of the contract or account setting the key.
      * @param key The key for the value in this scope.
      * @return value The uint256 value stored under the key in the scope.
      */
    function getUintData (Data storage self, address scope, bytes32 key)
        public
        view
        returns (uint256 value)
    {
        bytes32 keyHash = hashScopeKey(scope, key);
        value = self.uintData[ keyHash ];
    }

    /** dev Set the string value under the key in the scope of the address.
      * @param scope The address of the contract or account setting the key.
      * @param key The key for the value in this scope.
      * @param value The string value to set under the key in the scope.
      */
    function setStringData (
        Data storage self,
        address scope,
        bytes32 key,
        string value
    )
        public
    {
        bytes32 keyHash = hashScopeKey(scope, key);
        self.stringData[ keyHash ] = value;
    }

    /** dev Get the string value under the key in the scope of the address.
      * @param scope The address of the contract or account setting the key.
      * @param key The key for the value in this scope.
      * @return value The string value stored under the key in the scope.
      */
    function getStringData (Data storage self, address scope, bytes32 key)
        public
        view
        returns (string value)
    {
        bytes32 keyHash = hashScopeKey(scope, key);
        value = self.stringData[ keyHash ];
    }

    /** dev Set the bytes32 value under the key in the scope of the address.
      * @param scope The address of the contract or account setting the key.
      * @param key The key for the value in this scope.
      * @param value The bytes32 value to set under the key in the scope.
      */

    function setBytesData (
        Data storage self,
        address scope,
        bytes32 key,
        bytes32 value
    )
        public
    {
        bytes32 keyHash = hashScopeKey(scope, key);
        self.bytesData[ keyHash ] = value;
    }

    /** dev Get the bytes32 value under the key in the scope of the address.
      * @param scope The address of the contract or account setting the key.
      * @param key The key for the value in this scope.
      * @return value The bytes32 value stored under the key in the scope.
      */
    function getBytesData (Data storage self, address scope, bytes32 key)
        public
        view
        returns (bytes32 value)
    {
        bytes32 keyHash = hashScopeKey(scope, key);
        value = self.bytesData[ keyHash ];
    }

}
