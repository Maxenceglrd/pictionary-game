import React from 'react';
import {Form, Button} from 'react-bootstrap';
import './Login.css';
import {Redirect} from 'react-router-dom';
import Drawer from 'react-drag-drawer';


class Login extends React.Component{

	constructor(props){
		super(props)
		this.state = {
			mail:"",
			password:"",
			token:"",
			id:"",
			redirect:false,
            name:"",
            showPopup:false,

		}
		
		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
        this.register = this.register.bind(this);
        this.togglePopup = this.togglePopup.bind(this);
        this.redirect = this.redirect.bind(this);
		
	}

	

	
	setToken(parsedJSON){
		this.setState({token:parsedJSON.token});
		console.log(this.state.token);
	}

	handleInputChange(event){      
        this.setState({[event.target.name]: event.target.value});
        
       
    }

    handleSubmit(event){
    	
    	event.preventDefault();
    	
        fetch("http://localhost:8000/api/login", {
            method: 'POST',
            headers: {            	
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                mail:this.state.mail,
                password:this.state.password,
            })
        })
        .then(response => response.json())
        .then(parsedJSON => {
        	console.log(parsedJSON);
        	sessionStorage.setItem('token',parsedJSON.token);
        	this.setState({redirect: true});
        })
        .then(() => {window.location.reload();})

        .catch(err => console.error(err))




        


	
    }

    register(event){

        event.preventDefault();
        
        fetch("http://localhost:8000/api/register", {
            method: 'POST',
            headers: {              
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                mail:this.state.mail,
                password:this.state.password,
                name:this.state.name
            })
        })
        .then(response => response.json())
        .then(parsedJSON => {
            console.log(parsedJSON);
            sessionStorage.setItem('token',parsedJSON.token);
            this.setState({redirect: true});
        })
        .then(() => {window.location.reload();})
        .catch(err => console.error(err))




        
    }

    togglePopup() {
        this.setState({showPopup:!this.state.showPopup});
    }

    redirect(){
        return(<Redirect to={"/"}/>)
    }

    

	render(){


		if(this.state.redirect){
			return(<Redirect to={"/"}/>);
		}


		return(

				<div className = "FormDiv">


					<Form className = "Form" onSubmit={this.handleSubmit}>

 						<Form.Group controlId="formBasicEmail">
    					<Form.Label>Email address</Form.Label>
    					<Form.Control 
                        className="inputBox"                    
                        placeholder="Email"
                        type="mail"
                        name = "mail"
                        onChange = {this.handleInputChange} />    					
  						</Form.Group>

  						<Form.Group controlId="formBasicPassword">
    					<Form.Label>Password</Form.Label>
    					<Form.Control 
                        className="inputBox"                    
                        placeholder="Password"
                        type = "password"
                        name = "password"
                        onChange = {this.handleInputChange} />
  						</Form.Group>

 
  						<Button variant="danger" type="submit">
    						Login
  						</Button>

                        <Button variant="danger" className="register" onClick={this.togglePopup}>
                            Register
                        </Button>
					</Form>

                    {(this.state.mail && this.state.password) ? (
                    <Drawer
                        open = {this.state.showPopup}
                        onRequestClose = {this.togglePopup}>

                    
                        <Form className = "Form" onSubmit = {this.register}>
                            <h2>Choose a Username ! </h2>

                            <Form.Group className="formgroup">

                            <Form.Control 
                                className="inputBox"                    
                                placeholder="Username"
                                name = "name"
                                onChange = {this.handleInputChange} />
                            </Form.Group>


                            <Button variant="danger" type="submit" onClick={this.redirect}>Continue</Button>

                        </Form>




                    </Drawer>

                    ) : (null) }

					

					

				</div>

		);

	}



}

export default Login;