import React, { Component } from 'react'

class Loading extends Component {
    constructor(props) {
	super(props)
	this.state = {
	    status: props.status
	}
    }

    
    render() {
	return (
	    <div>
		<h1>{this.props.status}</h1>
	    </div>
	)
    }
}

export default Loading
