import React from 'react';
import { Card, Button } from 'react-bootstrap';
import './RoomList.css';


class RoomList extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            id:this.props.id
        }
        this.newJoining = this.newJoining.bind(this);
        this.deleteRoom = this.deleteRoom.bind(this);
        

    }

    newJoining(){
        
        fetch("http://localhost:8000/api/rooms/join", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: this.props.id,
                name:this.props.name,
                maxPlayers: this.props.maxPlayers,
                
            })
        })
        
        .catch(err => console.error(err)) 
        
    }

    deleteRoom(){

       fetch("http://localhost:8000/api/rooms/delete", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: this.state.id,
                isAdmin: this.props.isAdmin
                
            })
        })

        
        .catch(err => console.error(err))  
        window.location.reload()


    }

    render() {

        const id = this.props.id; 
        const ref = "/room/"+id; 

        return  (
            <div className = "roomElement" href = "/room">

               <Card border="danger" bg="secondary" text="light" style = {{ width:'18rem' }}>

                    <Card.Header as="h5" > {"Room " + this.props.id} </Card.Header>

                    <Card.Body>
                    <Card.Title> {this.props.name} </Card.Title>

                    <Card.Text>

                        {this.props.currentPlayer 
                            + " / " + this.props.maxPlayer}

                    </Card.Text>

                    </Card.Body>
                    
                    <Button href={ref} variant="danger" className="join" onClick = {this.newJoining}>
                        Join
                    </Button>
                    {this.props.isAdmin ? (

                    <Button variant="danger" className="delete" onClick = {this.deleteRoom}>
                        Delete
                    </Button>

                        ) : (null)
                    }
                   
                    

                </Card> 
                    
            </div>
        );
    }
}

export default RoomList;
