import React, { Component } from 'react'
import { Button, Tabs, Tab } from 'react-bootstrap'
import MoodShare from '../build/contracts/MoodShare.json'
import getWeb3 from './utils/getWeb3'

import AllMoods from './AllMoods.js'
import CurrentMood from './CurrentMood.js'
import ImportantNotice from './ImportantNotice.js'
import Loading from './Loading.js'
import LogMood from './LogMood.js'

const LOG_TAB = 3;

class App extends Component {

    constructor(props) {
	super(props)
	
	this.handleSelectTab = this.handleSelectTab.bind(this)  
	
	this.state = {
	    storageValue: 0,
	    web3: null,
	    status: 'Loading...',
	    tabKey: 1,
	    paused: false,
	    currentMood: {mood: '-', count: '--', date: '----'},
	    allMoods: {},
	    moodNames: {}
	}
    }

    fetchCurrentMood() {
	// Use account zero
	this.state.moodShareInstance.userGetMoodCurrent()
	    .then((currentMood) => {
		let mood = this.state.web3.toUtf8(currentMood[0])
		let count = this.state.web3.toDecimal(currentMood[1])
		let date = '----'
		let timestamp = this.state.web3.toDecimal(currentMood[2])
		if (timestamp > 0) {
		    let d = new Date(timestamp * 1000);
		    date = d.toLocaleDateString("en-US") + " "
			+ d.toLocaleTimeString("en-US")
		}
		this.setState({
		    currentMood: {
			mood: mood ? mood : '-',
			count: count ? count : '--',
			date: date
		    }
		})
	    })
    }
    
    componentWillMount() {
	getWeb3
	    .then(results => {
		this.setState({
		    web3: results.web3
		})

		// Instantiate contract once web3 provided.
		this.instantiateContract()
	    })
	    .catch((e) => {
		console.log('Error finding web3:')
		console.log(e)
		this.setState({
		    status: 'Could not find web3. Make sure you are using a web3 browser or plugin.'
		})
	    })
    }

    fetchAllMoods() {
	this.setState({
	    allMoods: {}
	})
	this.state.moodShareInstance.getMoodNames()
	    .then(moodNames => {
		moodNames.forEach(moodName => {
		    // Use account zero
		    this.state.moodShareInstance.userGetMoodCount(moodName)
			.then(count => {
			    const name = this.state.web3.toUtf8(moodName)
			    const allMoods = this.state.allMoods
			    allMoods[name] = this.state.web3.toDecimal(count)
			    this.setState({
				allMoods: allMoods
			    })
			})
		})
	    })
    }


    instantiateContract() {
	const contract = require('truffle-contract')
	const moodShare = contract(MoodShare)
	moodShare.setProvider(this.state.web3.currentProvider)
	moodShare.deployed().then((instance) => {
	    this.setState({      
		moodShareInstance: instance
	    })
	}).then(() => {
	    return this.state.moodShareInstance.paused()
	}).then(paused => {
	    if (paused) {
		console.log(paused)
		this.emergencyStop()
	    } else {
		this.fetchCurrentMood()
		this.fetchAllMoods()
		this.subscribeToEvents()
	    }
	})
    }
    
    subscribeToEvents() {
	this.state.moodShareInstance.Pause()
	    .watch((err, response) => {
		if (! err) {	    
		    this.setState({
			paused: true,
			status: "Cannot be used: in Emergency Stop state"
		    })
		}
	    })
	this.state.moodShareInstance.Unpause()
	    .watch((err, response) => {
		if (! err) {
		    this.setState({paused: false, status: ''})
		}
	    })
	this.state.web3.eth.getAccounts((error, accounts) => {
	    if (! error) {
		this.state.moodShareInstance.UserMoodLogged(
		    {user: accounts[0]}
		).watch((err, response) => {
		    if (! err) {
			this.fetchCurrentMood()
			this.fetchAllMoods()
		    }
		})
	    }	  
	})
	this.state.moodShareInstance.AdminMoodAdded()
	    .watch((err, response) => {
		if (! err) {
		    this.fetchAllMoods()
		}
	    })
	this.state.moodShareInstance.AdminMoodRemoved()
	    .watch((err, response) => {
		if (! err) {
		    this.fetchAllMoods()
		}
	    })
  }

    handleSelectTab(key) {
      this.setState({
	tabKey: key
    })
  }

    render() {
	const loading = (this.state.moodShareInstance == null)
	      || (this.state.paused === true);
	return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
            <h1 className="pure-menu-heading">M👀dShare</h1>
        </nav>

	<div className="container">
	{loading ? <Loading status={this.state.status} />
	: <div> 
	    <Tabs activeKey={this.state.tabKey}
                  onSelect={this.handleSelectTab}
	          id="moodshare-ui-tabs"
	    >
	        <Tab eventKey={1} title="Current Mood">
                    <CurrentMood currentMood={this.state.currentMood} />
	        </Tab>
	        <Tab eventKey={2} title="All Moods">
                    <AllMoods allMoods={this.state.allMoods} />
	        </Tab>
	        <Tab eventKey={3} title="Log Your Mood">
	            <LogMood
	                moodShareInstance={this.state.moodShareInstance}
                        web3={this.state.web3}
	            />
	        </Tab>
	        <Tab eventKey={4} title="Disclaimer">	        
	          <ImportantNotice web3={this.state.web3} />
	        </Tab>
	    </Tabs>
	 {(this.state.tabKey !== LOG_TAB)
            ? <Button bsStyle="primary"
	            bsSize="small"
	  onClick={ () => this.handleSelectTab(LOG_TAB) }
	    >Log Your Mood</Button>
	  : <div />
	 }
	    </div>
	}
        </div>
      </div>
    );
  }
}

export default App
