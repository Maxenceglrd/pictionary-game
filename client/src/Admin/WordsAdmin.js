import React from 'react';
import {ListGroup, InputGroup, Button, FormControl} from 'react-bootstrap';
import './WordsAdmin.css';

class WordsAdmin extends React.Component{

	constructor(props){
		super(props);
		this.state = {
			words:[],
			addedWord:""
		}

		this.getWords = this.getWords.bind(this);
		this.addWord = this.addWord.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
		this.deleteWords = this.deleteWords.bind(this);
	}

	componentDidMount(){
		this.getWords();
	} 

    
	getWords(){
		
		fetch("http://localhost:8000/api/words", {
            method: 'GET',            
        })

		.then(response => response.json())
		.then(parsedJSON => this.setState({words:parsedJSON.data}))        
        .catch(err => console.error(err))  
        
	}


	handleInputChange(event){    
        this.setState({[event.target.name]: event.target.value});
    }
        
    


	addWord(){

		

        fetch("http://localhost:8000/api/words/add", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                value: this.state.addedWord,                
            })
        })
        .then(() => {window.location.reload();})
        .then(this.getWords())        
        .catch(err => console.error(err))

  	}

  	deleteWords(id){


  		fetch("http://localhost:8000/api/words/delete", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: id, 
                isAdmin: this.props.user.isAdmin               
            })
        })
        .then(() => {window.location.reload();})
        .then(this.getWords())
        .then(() => {window.location.reload();})      
        .catch(err => console.error(err))

  	}


	renderWords = (word) => (
    	
  		<ListGroup.Item action variant="danger" key={word.id} onClick={() => this.deleteWords(word.id)}>{word.value}</ListGroup.Item> 
  		
  		


  
  		
  		
		
    
    ); 

	render(){
		return(

			<div className = "words">


				
				<h2 className = "title"> Management of the words list </h2>

				<ListGroup className="list">
				{this.state.words.map(this.renderWords)}
				</ListGroup>

				<InputGroup className="addWord">
    				<InputGroup.Prepend className="addWord">
      					<Button variant="outline-secondary" onClick={this.addWord}>Add</Button>
    				</InputGroup.Prepend>
    				<FormControl aria-describedby="basic-addon1" name = "addedWord"
                        onChange = {this.handleInputChange}/>
  				</InputGroup>


			</div>

		)
	}

}

export default WordsAdmin;