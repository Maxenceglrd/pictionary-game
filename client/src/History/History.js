import React from 'react';
import {ListGroup} from 'react-bootstrap';
import './History.css';

class History extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			createdRooms:[""],
			id:this.props.user.userId,
			isConnected: this.props.checkAuth()
		}

		this.getCreatedRooms = this.getCreatedRooms.bind(this);
	}

	componentDidMount(){
	if(typeof this.state.id != "undefined"){
		this.getCreatedRooms();
	}
    
  }


	getCreatedRooms(){

		fetch("http://localhost:8000/api/rooms/history", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: this.state.id,
                isConnected: this.state.isConnected
                
            })
        })

		.then(response => response.json())
		.then(parsedJSON => this.setState({createdRooms:parsedJSON.data}))        
        .catch(err => console.error(err))  
        //window.location.reload()
	}


	renderRooms = (room) => (
    	
  		<ListGroup.Item key={room.id}>{room.name}</ListGroup.Item>  
		
    
    );  



	
    

	render() {



		return(

			<div className = "history">

				<h2 className = "title"> Created Rooms history </h2>

				<ListGroup className="list">
				{this.state.createdRooms.map(this.renderRooms)}
				</ListGroup>



			</div>

		)

	}
}

export default History;