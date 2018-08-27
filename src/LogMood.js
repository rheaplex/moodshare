import React, { Component } from 'react'
import { Button } from 'react-bootstrap'

class LogMood extends Component {
    constructor(props) {
	super(props)
	this.state = {
	    moodShareInstance: props.moodShareInstance,
	    web3: props.web3
	}
    }

    fetchMoodNames() {
	this.setState({
	    moodNames: []
	})
	this.state.moodShareInstance.getMoodNames()
	    .then(moodNames => {
		const moodNameStrings = moodNames.map(this.state.web3.toUtf8)
		this.setState({
		    moodNames: moodNameStrings
		})
	    })
    }
    
    componentWillMount() {
	this.fetchMoodNames()
    }
    
    logMood(mood) {
	this.state.web3.eth.getAccounts((error, accounts) => {
	    this.state.moodShareInstance.userSetMood(
		this.state.web3.fromUtf8(mood),
		{from: accounts[0]}
	    )
	})
    }
    
    render() {
	return (
		<div>
		<h2>Click a mood to log it:</h2>
		<br />
		{Object.keys(this.state.moodNames).map(key => {
		    const mood = this.state.moodNames[key]
		    const childKey = 'button-log-' + mood
		    return <p key={ childKey }>
			   <Button bsSize="large"
		           onClick={ () => this.logMood(mood) }>{mood}</Button>
		           </p>
		})}
		</div>
	)
    }
}

export default LogMood
