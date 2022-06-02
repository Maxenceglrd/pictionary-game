import React from 'react';

class Register extends React.Component{

	constructor(props){
		super(props);
		this.state = {
			mail:"",
			password:""
		}
	}

	render() {

		return(

			<div className = "registerFor">

				<h1> Register here ! </h1>

			</div>

		)
	}

}

export default Register;