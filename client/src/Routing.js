import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import App from './App/App';
import Header from './General/Header';
import Footer from './General/Footer';
import Room from './Game/Room';
import Login from './Authentication/Login';
import {Redirect} from 'react-router-dom';
import decode from 'jwt-decode';
import History from './History/History';
import WordsAdmin from './Admin/WordsAdmin';
import Chat from './Game/Chat';
import Register from './Authentication/Register';

import Draw from './Game/Draw';




const checkAuth = () => {
  		const token = sessionStorage.getItem("token");
  		if(!token){
  			return false;
  		}

  		try{
  			const userData = decode(token);
  			const expire = userData.exp;
  			if(expire < new Date().getTime() / 1000){
  				return false;
  			}
  			else {
  				return true;

  			}

  		} catch(err){
  			return false;
  		} 

  	}




const AuthRoute = ({component: Component, ...rest}) => (

		<Route {...rest} render = { props => (
				checkAuth() ? (
						<Component {...props} />
					) :(
						<Redirect to={"/login"} />
					)
			)

		} />

	)



class Routing extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			showPopup: false,
			user:"",
			
		}
		
		this.togglePopup = this.togglePopup.bind(this);
		
		
	}

	togglePopup() {

    	this.setState({
      		showPopup: !this.state.showPopup
    });
  	}

  	componentDidMount(){
  		try{
  			var token = sessionStorage.getItem("token")
  			var user = decode(token);
  			this.setState({user: user});
  		}
  		catch(err){
  			console.log(err);
  		}
  		
  	}

  	handleLogout(){
  		sessionStorage.clear("token");
  		window.location.reload()
  	}

  	
  	

  	

  
	render() {



		


		return(

			

			<BrowserRouter>

				
				<Header showPopup={this.state.showPopup} togglePopup={this.togglePopup} user={this.state.user}
						logout={this.handleLogout} checkAuth={checkAuth}/>



				<Switch>
					<AuthRoute exact path="/" 
							   component={() => <App showPopup={this.state.showPopup} 
							   user={this.state.user} togglePopup={this.togglePopup} isAdmin={this.state.user.isAdmin}/>} >
						
					</AuthRoute>

					<AuthRoute path="/room/:id" component={(props) => <Room {...props} user={this.state.user} />}>

					</AuthRoute>

					<AuthRoute path="/history" component={() => <History user={this.state.user} checkAuth={checkAuth}/>}>
					</AuthRoute>

					{this.state.user.isAdmin ? (
					<AuthRoute path="/admin/words" component={() => <WordsAdmin user={this.state.user}/>}>
					</AuthRoute>

					) : (null) }

					<AuthRoute path="/chat" component={Chat}>

					</AuthRoute>

					<Route exact path="/register" component={Register}>
					</Route>

					<Route exact path="/login" component={Login}>
					</Route>

					<Route exact path="/test" component={Draw}>
					</Route>

					

				</Switch>

				<Footer />


			</BrowserRouter>

			);
	}
}





export default Routing;


