import React from 'react';
import {Navbar, Nav, NavDropdown} from 'react-bootstrap';
import {withRouter} from 'react-router-dom';

class Header extends React.Component{

  constructor(props){
    super(props); 
    this.name = "";
    this.button ="";
    this.isAdmin = false;
    
    this.pathname = this.props.location.pathname;
    
    
  }

   

  


	render() {

    var adminNav = null;
    
    if(this.props.checkAuth()){

      this.button =  <button onClick={this.props.logout}>Logout</button>;
      this.name = this.props.user.userName;
      if(this.props.user.isAdmin){
          adminNav = <NavDropdown.Item href="/admin/words">Words' referential</NavDropdown.Item>
      }


    }
    else{

      this.button = null;
    }
  
   

		return(

			<Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">

  			<Navbar.Brand href="/">Pictionary</Navbar.Brand>
  			<Navbar.Toggle aria-controls="responsive-navbar-nav" />
  			<Navbar.Collapse id="responsive-navbar-nav">
    			<Nav className="mr-auto">
              {this.props.checkAuth() ? (
      				<NavDropdown title="Play" id="collasible-nav-dropdown">
                {this.pathname === "/" ? (
        				<NavDropdown.Item onClick = {this.props.togglePopup}>Create a room</NavDropdown.Item>
                ) :(null) }
        				 
                <NavDropdown.Divider /> 
                {adminNav}   				
        				       				
      				</NavDropdown> ) : (null)}
    			</Nav>
    			<Nav>

              {this.props.checkAuth() ? (
      				<Nav.Link href="/history">{"Welcome " + this.name}</Nav.Link>
              ) : (null) }
              
              {this.button}
               
      				
   				</Nav>
  			</Navbar.Collapse>
			</Navbar>

			);
	}
}

export default withRouter(Header);