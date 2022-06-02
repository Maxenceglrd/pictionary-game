import React from 'react';
import './Draw.css';

class Draw extends React.Component{
	constructor(props){
		super(props)
		this.state = {
			isPenDraw: false,
			mouseX: 0,
			mouseY: 0,
			previousX: 0,
			previousY: 0,
			loaded: true
		};
		this.display = React.createRef();
		this.socket = this.props.socket;

		this.handleDisplayMouseMove = this.handleDisplayMouseMove.bind(this);
		this.handleDisplayMouseDown = this.handleDisplayMouseDown.bind(this);
		this.handleDisplayMouseUp = this.handleDisplayMouseUp.bind(this);
		this.handleClear = this.handleClear.bind(this);

		this.socket.on('CLEAR', (data) => {
			const displayCtx = document.querySelector("canvas").getContext("2d");
  			displayCtx.clearRect(0, 0, 400, 400);
		})

	}

	componentDidMount(){

		this.socket.on('line', data => {
      		if(this.state.loaded) {
        		const [x1,y1,x2,y2] = data.lineCoordinates;
        		const displayCtx = document.querySelector("canvas").getContext("2d");
        		displayCtx.lineWidth = data.lineWidth;
        		displayCtx.strokeStyle = "black";
        		displayCtx.beginPath();
        		displayCtx.moveTo(x1,y1);
        		displayCtx.lineTo(x2,y2);
        		displayCtx.stroke();
      		}
    	});
	}

	handleDisplayMouseMove(e) {
    	this.setState({
      		mouseX: e.clientX,
      		mouseY: e.clientY
    	});
    	if(this.state.isPenDown) {
      		this.display.current.getContext('2d').lineCap = 'round';
     		const {top, left} = this.display.current.getBoundingClientRect();
     
        	if(this.props.userStatus==='drawer'){
          	this.socket.emit('line',{
          		roomId: this.props.roomId,
            	lineWidth: this.state.brushSize,
            	lineColor: this.state.brushColor,
            	lineCoordinates: [this.state.prevX - left, this.state.prevY - top, this.state.mouseX - left, this.state.mouseY - top],
          	});
      		}
        }      
        
   
    	this.setState({
      		prevX: this.state.mouseX,
      		prevY: this.state.mouseY
    	});

    	if(!this.state.isPenDown) {
      		this.setState({
        		prevX: e.clientX,
        		prevY: e.clientY
      		});
    	}


    };

	handleDisplayMouseDown(e) {
    	this.setState({isPenDown: true});
  	}

  	handleDisplayMouseUp(e) {
    	this.setState({isPenDown: false});
  	}

  	handleClear(e){

  		this.socket.emit('CLEAR', {
  			roomId: this.props.roomId,
  		})
  	}

	render() {
		return(
			<div>


			<canvas className="display" width="400" height="400" 
			ref={this.display} 
			onMouseMove={this.handleDisplayMouseMove} 
			onMouseDown={this.handleDisplayMouseDown}
			onMouseUp={this.handleDisplayMouseUp}
			></canvas>
			{this.props.userStatus === 'drawer' ? (
			<button onClick={this.handleClear}> Clear </button>
			) : (null) }


			</div>


		)
	}
}

export default Draw;