import React, { Component } from 'react'


class MoodDisplay extends Component {
    constructor(props) {
	super(props)
	this.state = {
	    moodShareInstance: props.moodShareInstance,
	    web3: props.web3
	}
    }

    fetchCurrentMood() {
	this.setState({
	    currentMood: {mood: '-', count: '--', date: '----'}
	})
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
		    moods: {},
		    currentMood: {
			mood: mood ? mood : '-',
			count: count ? count : '--',
			date: date
		    }
		})
	    })
    }

    fetchAllMoods() {
	this.setState({
	    moods: {}
	})
	this.state.moodShareInstance.getMoodNames()
	    .then(moodNames => {
		moodNames.forEach(moodName => {
		    // Use account zero
		    this.state.moodShareInstance.userGetMoodCount(moodName)
			.then(count => {
			    console.log(count)
			    const name = this.state.web3.toUtf8(moodName)
			    console.log(name)
			    const moods = this.state.moods
			    moods[name] = this.state.web3.toDecimal(count)
			    this.setState({
				moods: moods
			    })
			})
		})
	    })
    }
    
    componentWillMount() {
	this.fetchCurrentMood()
	this.fetchAllMoods()
    }
    
    render() {
	var bigStyle = {fontSize: "128px"}
	return (
		<div>
		
		<h1>Most Recent Mood</h1>
		<span style={bigStyle}>{ this.state.currentMood.mood }</span>
		<table className="table">
		<tbody>
		<tr><td>Total to date: </td><td>&nbsp;</td><td>{ this.state.currentMood.count }</td></tr>
		<tr><td>Date most recently logged: </td><td>&nbsp;</td><td>{ this.state.currentMood.date }</td></tr>
		</tbody>
		</table>

		<h2>Moods</h2>
		<table className="table">
		<thead><th>Mood</th><th>Total number of times you have logged
	            this mood</th></thead>
		<tbody>
		{Object.keys(this.state.moods).map(key => {
		    return <tr key={ key }><td>{ key }</td>
			<td>{ this.state.moods[key] }</td></tr>
		})}
		</tbody>
		</table>

		</div>
	)
    }
}

export default MoodDisplay
