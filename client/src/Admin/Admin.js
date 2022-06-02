import React from 'react';

class Admin extends React.Component(){
	constructor(props){
		super(props);

		this.state = {
			rooms:""
		}

	}


	getRoomsList(){
      fetch('http://localhost:8000/api/rooms')
      .then(response => response.json())
      .then(parsedJSON => this.setState({rooms:parsedJSON.data}))
      .catch(err => console.error(err))
      
  }
}

export default Admin;