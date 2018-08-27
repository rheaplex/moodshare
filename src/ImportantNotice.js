import React, { Component } from 'react'

class ImportantNotice extends Component {
    constructor(props) {
	super(props)
	this.state = {
	    userAccount: 'Unknown',
	    web3: props.web3
	}
    }

    componentWillMount() {
	this.setState({
	    userAccount: 'Unknown'
	})
	this.state.web3.eth.getAccounts((error, accounts) => {
	    if (! error) {
		this.setState({
		    userAccount: accounts[0]
		})
	    }
	})
    }
    
    render() {
	   
	return (
	    <div>
		<h1>Important Notices</h1>
		<h2>No Privacy, No Takesy-Backsies!</h2>
		<p>This code is an experiment in radical transparency. You probably don&apos;t want that. When you record your mood with this code it is stored to the blockchain publicly and forever. Again, you probably don&apos;t want that. By using the code you acknowledge that you understand this.</p>
		<h2>Not For Real World Use!</h2>
		<p>This code has not been audited. It is provided without warranty or guarantee. Don&apos;t try to use it in production.</p>
		<h2>You Are Using This Ethereum Account:</h2>
		<p><code>{ this.state.userAccount }</code></p>
		<p>This account will have your mood log permanently associated with it on the Ethereum blockchain.</p>
		<br />
	    </div>
	)
    }
}

export default ImportantNotice
