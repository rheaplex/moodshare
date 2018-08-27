import React, { Component } from 'react'
import { Table } from 'react-bootstrap'

class CurrentMood extends Component {
    
    render() {
	var bigStyle = {fontSize: "128px"}
	return (
		<div>
		
		<p style={bigStyle}>{ this.props.currentMood.mood }</p>
		<Table>
		<tbody>
		<tr><td>Total to date: </td><td>&nbsp;</td><td>{ this.props.currentMood.count }</td></tr>
		<tr><td>Date most recently logged: </td><td>&nbsp;</td><td>{ this.props.currentMood.date }</td></tr>
		</tbody>
		</Table>
		</div>
	)
    }

}

export default CurrentMood
