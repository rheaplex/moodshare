import React, { Component } from 'react'
import { Table } from 'react-bootstrap'

class AllMoods extends Component {
    
    render() {
	return (
		<div>
		<br />
		<Table className="table">
		<thead>
		<tr><th>Mood</th><th>Total number of times you have logged
	            this mood</th></tr>
		</thead>
		<tbody>
		{Object.keys(this.props.allMoods).map(key => {
		    return <tr key={ key }><td>{ key }</td>
			<td>{ this.props.allMoods[key] }</td></tr>
		})}
		</tbody>
		</Table>
		</div>
	)
    }
}

export default AllMoods
