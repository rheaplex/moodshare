# Emergency Stop

Implemented using OpenZeppelin's Pausable.

This was a course requirement but it also makes sense for a system that is
publishing personal data and might need to be shut down due to abuse or
regulatory compliance.

# Ownership

Implemented using OpenZeppelin's Ownable (via Pausable).

Ownership is used to implement the admin role required by Emergency Stop and
to ensure that only the owner/admin can add or remove mood names.

# Unstructured Storage

Implemented as a Library.

A general unstructured storage system is overkill for the current state of the
system but I implemented it when I was hoping to implement the Upgradeable
design pattern and it makes the system more configurable within its current
limitations.

# Other Patterns

I wanted to use Upgradeable but I didn't have the time to make it work so I
simplified the design to get it finished.
