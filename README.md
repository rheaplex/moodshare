# What Does It Do?

MoodShare is a blockchain mood tracking DApp.

Users can record how they are feeling (from very sad to very happy) and track
their mood over time.


# How To Set It Up

Make sure you have truffle, npm and a modern web browser with MetaMask
installed.

In the terminal:

    npm install


## How To Run A Local Development Server

You will need two terminals.

In the first terminal:

    $ truffle develop
    > migrate

If you get the following error message:

    Error: Attempting to run transaction which calls a contract function...

Then enter this command in the second terminal before trying to migrate again:

    rm build/contracts/*

Then in the second terminal:

    npm start

If this does not open the project in the web browser, open the following url:

[http://localhost:3000/]


# Testing Features not exposed via the UI

To persorm an emergency stop, enter the following command in the
`truffle develop` console:

    > MoodShare.deployed().then(instance => instance.pause())

To reverse the emergency stop, enter this command instead:

    > MoodShare.deployed().then(instance => instance.unpause())

Adding and removing moods can be performed in the `truffle develop` console as
well. It is recommended to avoid these while testing other features.
