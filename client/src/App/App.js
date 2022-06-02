import React from 'react';
import './App.css';
import RoomList from '../Game/RoomList.js';
import {Container, Col, Row} from 'react-bootstrap';
import CreateRoom from '../Game/CreateRoom';
import Drawer from 'react-drag-drawer';

class App extends React.Component {

  constructor(props){
      super(props);
      this.state = {
        rooms:[],
        redirect:false
      }
      

      this.getRoomsList = this.getRoomsList.bind(this);
  }

  componentDidMount(){
    this.getRoomsList();
  }





  getRoomsList(){
      fetch('http://localhost:8000/api/rooms')
      .then(response => response.json())
      .then(parsedJSON => this.setState({rooms:parsedJSON.data}))
      .catch(err => console.error(err))
      
  }



  renderRooms = (room) => (<div key={room.id}>
    <Col xs lg="2">      
    </Col>
    <Col md="auto">            
     <RoomList id = {room.id} name = {room.name} currentPlayer = {room.currentPlayers}
      maxPlayer = {room.maxPlayers} 
      privateRoom = {room.privateRoom}
      isAdmin = {this.props.isAdmin}
      />
    </Col>

    <Col xs log="2">
    </Col>
    </div>
    );  


  render(){ 


    const {rooms} = this.state;
    return (
        <div className="App">

          <Container>

             <Row className='justify-content-md-center'>
             </Row>

             <Row className="justify-content-md-center">
                    
                    {rooms.map(this.renderRooms)}
                    
             </Row>
            </Container>

            
          <Drawer
           open = {this.props.showPopup}
           onRequestClose = {this.props.togglePopup}>
          
          
          <CreateRoom
            text='Close Me'
            closePopup={this.props.togglePopup}
            getRoomsList={this.getRoomsList}
            user={this.props.user}
          />
          

        
        </Drawer>

        </div>
    );
  }
}

export default App;
