import React from 'react'
//import CanvasDraw from "react-canvas-draw";
import './Room.css';
import Chat from './Chat';
import Timer from './Timer';
import {Container, Col, Row, Button} from 'react-bootstrap';
import {Redirect} from 'react-router-dom';
import io from 'socket.io-client';
import Draw from './Draw';






class Room extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            id:this.props.match.params.id,
            user:this.props.user,
            userStatus: '',
            room:'',
            nb_player:0,
            score:0,
            endpoint:'localhost:8000',
            saveData:'',
            toBeFoundWord: '',
            words:'',
            users: [],
            time: {minutes: 1, seconds: 0},
            isEnded: 0,
            nb_game: 0,
            timeOver: true,
        
        }


        this.socket = io(this.state.endpoint, {user: this.state.user});

        
        this.loadPartie = this.loadPartie.bind(this);
        this.getRoom = this.getRoom.bind(this);
        this.updateUser = this.updateUser.bind(this);
        this.onBackButtonEvent = this.onBackButtonEvent.bind(this);
        //this.onMouseMove = this.onMouseMove.bind(this);
        //this.sendDraw = this.sendDraw.bind(this);
        this.getWords = this.getWords.bind(this);
        this.updateScore = this.updateScore.bind(this);
        this.isOver = this.isOver.bind(this);
        this.restart = this.restart.bind(this);
        //this.loadableCanvas = null;
    
        this.nb_player = 0;
        

        /*this.socket.on('RECEIVE_DRAW', (draw) =>{
            this.setState({saveData: draw});

        });*/

        this.socket.on('NEW_WORD', (word) =>{
            console.log(word);
            this.setState({toBeFoundWord: word});
            this.setState({nb_game: this.state.nb_game + 1});
        });

        

        this.socket.on('disconnect', () => {
            console.log("disconnection");
        })

        this.socket.on('join', (nb_player) => {
            this.setState({nb_player:nb_player});
        })

        this.socket.on('leave', (nb_player) => {
            this.setState({nb_player:nb_player});
        })

        this.socket.on('WIN', (data) => {
            if(data.userId === this.state.user.userId)
            this.updateScore(data.score);
        })


        
    


    }

    
    /*onMouseMove(e){
        
        if(this.state.userStatus === "drawer"){
         this.sendDraw()
        }
     }*/

    

    getWords(){
        
        fetch("http://localhost:8000/api/words", {
            method: 'GET',            
        })

        .then(response => response.json())
        .then(parsedJSON => this.setState({words:parsedJSON.data}))    
        .catch(err => console.error(err))  
        
    }



    loadPartie(){
        if(this.state.timeOver === true){
        console.log(this.state.timeOver);
        var min=0; 
        var max=this.state.words.length;  
        var random = Math.floor(Math.random() * (+max - +min)) + +min;
        if(this.state.nb_player > 1){
            if(this.state.nb_game < 3){
                //this.setState({nb_game: this.state.nb_game + 1});
                this.socket.emit('NEW_WORD', {word: this.state.words[random].value, roomId: this.state.id})
            }
            else{
                this.setState({isEnded: true});
            }
        }
        else{
            alert("Please wait for players !");
        }
        }
        else{
            alert("Wait for the end of the game !");
        }
    }

    componentWillMount(){        
        this.getRoom();        
    
    }

    componentDidMount(){
        this.getWords();
        if(this.state.user.userId !== undefined){
            this.socket.emit('join', {userId: this.state.user.userId, roomId: this.state.id});
        }

        
    }

    

   
    /*sendDraw(){
        this.socket.emit('SEND_DRAW', {draw: this.saveableCanvas.getSaveData(), roomId: this.state.id}, ({error}) => {
        
      });


    } */


 
    

    onBackButtonEvent(){

        
        
        fetch("http://localhost:8000/api/rooms/leave", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: this.state.id,                
            })
        })
        .then(() => {this.socket.emit("leave", {userId: this.state.user.userId, roomId: this.state.id})})
        .then(() => {this.setState({redirect:true})})
        .catch(err => console.error(err)) 
    } 

    
    getRoom(){
        fetch('http://localhost:8000/api/rooms/'+this.state.id)
        .then(response => response.json())
        .then(parsedJSON => {this.setState({room :parsedJSON.data})})
        .then(() => this.updateUser())

    }

    updateUser(){
        if(this.state.room.currentPlayers === 1){
            this.setState({userStatus:"drawer"});
        }
        else{
            this.setState({userStatus:"player"});
        }
        console.log(this.state.userStatus);
    }

    updateScore(score){
        var total = score + this.state.score;
        this.setState({score: total});
    }

    isOver(minutes, secondes){
        if(minutes === 0 && secondes === 0){
            this.setState({timeOver:true});
        }
        else{
            this.setState({timeOver:false});
        }
    }

    restart(){
        this.setState({nb_game: 0});
    }




    render () {

        var currentPlayers = this.state.room.currentPlayers;
        var maxPlayers = this.state.room.maxPlayers;
        var isNotFull = (currentPlayers < maxPlayers + 1);
        var word = this.state.toBeFoundWord;
        
        

        if(this.state.redirect){
            return(<Redirect to={"/"}/>);
        }

        


        return(


        

            <div className = "room">


                
                
                

                { isNotFull ? (

                <div className="container">
                <Container>
                <Row>
                
                <Col>
                    <Timer socket={this.socket} roomId={this.state.id} loadPartie={this.loadPartie} isOver={this.isOver} isEnded={this.state.isEnded}/>
                    <h3> Game : {this.state.nb_game} / 3 </h3>
                    {this.state.nb_game === 3 ? (
                        <Button onClick = {this.restart}> Restart </Button>
                    ) : (null)
                    }
                <div className = "drawingZone" onMouseMove={ this.onMouseMove } >
                    {this.state.userStatus==='drawer' ? (
                    <div>
                    <h1 className="guessWord"> To be guessed : {word} </h1>
                    <Draw socket={this.socket} roomId={this.state.id} userStatus={this.state.userStatus}/>
                    <button className = "newWordButton"
                            onClick = {() => this.loadPartie()}
                    > Start
                    </button>
                    </div>
                    ) : (
                    <Draw socket={this.socket} roomId={this.state.id} userStatus={this.state.userStatus}/>
                    )}
                {this.state.userStatus==='player' ? (  
                <h2 className="score"> Your score : {this.state.score} </h2>
                ) : (null)
                }
                <h3 className="nbPlayer"> Number of players : {this.state.nb_player} </h3>
                </div>
                </Col>

                <Col>
                    <h1 className="chatTitle"> Real time chat </h1>
                    {this.state.room ?  <Chat className="chat" socket={this.socket} toBeFoundWord = {this.state.toBeFoundWord} room_id={this.state.id} updateScore={this.updateScore} room={this.state.room} user={this.state.user}/> : null }
                
                </Col>
                </Row>
               
                    
                    
                        <Button onClick={this.onBackButtonEvent}> Leave the room </Button>
                    
                
                </Container>
                </div>

                ) : (
                    <div>
                    <h1> Room Full</h1> 
                    <Button onClick={this.onBackButtonEvent}> Leave the room </Button>
                    </div>) }

                

            </div>

            
        )
    }
}



export default Room;
