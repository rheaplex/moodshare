# Ether and Token Sending/Receiving

The DApp does not handle Ether or tokens, so it does not need to secure against
attacks that affect the sending or receiving of them such as reentrancy attacks
or the contract's address being pre-funded.

# General Reentrancy

The DApp does not call any third party contracts or caller supplied functions,
so it does not suffer from reentrancy attacks.

# Transaction Ordering, Timestamp Dependence

The DApp records user-submitted information in a non-gamified way without
attached value, so the order of transactions is not important in normal
usage, and admin usage has a small interface that should not be called
frequently so again order is unimportant.

The block time of each user's last update is recorded but it is only used for
informational purposes, not in business logic.

# Cross Chain Replay

The DApp does not handle value and the information in it is intended for
personal use, so replaying transactions across chains would be at most a
nuisance and is not guarded against.

# Integer Overflow/Underflow

The values used are either hashes, timestamps, or are unsigned integers that are
increased by one by each transaction. Overflow for any of these is either
unlikely or very expensive for an attacker to achieve.

# Denial of Service

No user-supplied or third party contrct functions are called so a denial of
service attack is not possible.
