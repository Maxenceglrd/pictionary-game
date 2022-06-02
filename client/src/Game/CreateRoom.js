 import React from 'react';
import { Form, Button } from 'react-bootstrap';
import './CreateRoom.css';


class CreateRoom extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            name:"",
            maxPlayers:"",
            privateRoom:"false",
            info:"",
            redirect:false
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        
    }

    handleInputChange(event){
        
        if(event.target.value === "Privé" ){
            this.setState({privateRoom:true})
        }
        else if(event.target.value === "Publique"){
            this.setState({privateRoom:false})
        }
        else {
            this.setState({[event.target.name]: event.target.value});
        }
        
    }

    handleSubmit(event){
        //alert(this.state.name + " " + this.state.maxPlayers + " " + this.state.privateRoom + " " + this.state.info);
        

        event.preventDefault();
        fetch("http://localhost:8000/api/rooms/add", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: this.state.name,
                maxPlayers: this.state.maxPlayers,
                privateRoom: this.state.privateRoom,
                creator: this.props.user.userId
                
            })
        })
        .then(this.props.getRoomsList())
        .then(() => {window.location.reload();})
        .catch(err => console.error(err))

        

    }



	render() {


    return (
      <div className='popup'>
        <div className='popup_inner'>

          
          <div className='login'>

                
                
                <Form className = "Form" onSubmit = {this.handleSubmit}>
                    <h1>Create a new room</h1>

                    <Form.Group className="formgroup">

                    <Form.Control 
                        className="inputBox"                    
                        placeholder="Room's name"
                        name = "name"
                        onChange = {this.handleInputChange} />
                    </Form.Group>

                    <Form.Group>
                    <Form.Control 
                        className="inputBox"                       
                        placeholder="Maximal number of players"
                        name="maxPlayers"
                        onChange = {this.handleInputChange} />
                    </Form.Group>


                    <Form.Group controlId="exampleForm.ControlSelect1">
                    <Form.Label>Category</Form.Label>
                    <Form.Control 
                        as="select"
                        name = "privateRoom"
                        onChange = {this.handleInputChange}>
                        <option>Public</option>
                        <option>Private</option>
                    </Form.Control>
                    </Form.Group>
                   
                    
                   
                    <Button variant="danger" type="submit">Create </Button>
                   
                 
                </Form>
                

            </div>
            


        
        </div>
      </div>
    );
  }

}

export default CreateRoom;

