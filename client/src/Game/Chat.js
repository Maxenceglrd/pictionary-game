import React from 'react';
import {InputGroup, Button, FormControl} from 'react-bootstrap';
import io from 'socket.io-client';
import './Chat.css';



class Chat extends React.Component{

	constructor(props){
		super(props);
		this.state ={
			endpoint:'localhost:8000',
			room_id:this.props.room_id,
			room:this.props.room,
			message:'',
			messages:[],
			}

		this.socket = this.props.socket

		this.sendMessage = this.sendMessage.bind(this);
		this.addMessage = this.addMessage.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);


		this.socket.on('RECEIVE_MESSAGE', data =>{
			this.addMessage(data);
		});	
			

	
	}


	componentDidMount(){

      this.socket = io(this.state.endpoint);

  	};

  

  	sendMessage(event){

  		event.preventDefault();

  		this.socket.emit('SEND_MESSAGE', {
          message: this.state.message,
        	author: this.props.user.userName,
          userId: this.props.user.userId,
          roomId: this.state.room_id,
          win: this.state.message === this.props.toBeFoundWord,
        	
    	});
    	this.setState({message: ''});
    	if(this.state.message === this.props.toBeFoundWord){
    		alert("You found it ! ");
        this.socket.emit('WIN', {userId: this.props.user.userId, roomId: this.state.room_id});
    	}

  	}

  	addMessage(data){  	
      if(!data.win)	{
    	  this.setState({messages: [...this.state.messages, data]});
      }
      else{
        this.setState({messages: [...this.state.messages, {author:data.author, message:"found the word", win:true}]});
      }
  	}

  	handleInputChange(event){
  		this.setState({message: event.target.value})

  	}
    

	render() {

		return(
			<div>
			<div className="chat">

			


				<div className="messages">
    				{this.state.messages.map(message => {
                if(message.win){
                  return (<div><em><font color="red">{message.author}: {message.message}</font></em></div>)
                }
                else{
        				  return (<div>{message.author}: {message.message}</div>)  
                }      						
    				})}
				</div>

				
				


			</div>

			<InputGroup className="addMessage">
    				<InputGroup.Prepend className="addMessage" onChange={this.handleInputChange}>
      					<Button variant="danger" onClick={this.sendMessage}>Send</Button>
    				</InputGroup.Prepend>
    				<FormControl aria-describedby="basic-addon1" name = "addedWord" value ={this.state.message}
                        onChange = {this.handleInputChange}/>
  		</InputGroup>

  			</div>

			




		)

	}

}

export default Chat;