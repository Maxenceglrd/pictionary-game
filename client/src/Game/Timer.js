import React from 'react';

class Timer extends React.Component{
	constructor(props){
		super(props);
		this.state = {
            minutes: 1,
            seconds: 0,
        }



	}


	componentDidMount() {
		this.props.socket.on("LOADED", () => {
			
  			this.handleInterval = setInterval(() => {
    			const minutes  = this.state.minutes;
    			const seconds  = this.state.seconds;
    			this.props.isOver(minutes, seconds);
    			if (seconds > 0) {
      				this.setState({seconds: seconds - 1})
    			}

    			if (seconds === 0) {
      				if (minutes === 0) {
      					this.props.isOver(minutes, seconds);
        				this.setState({minutes: 1, seconds: 0});        				
        				clearInterval(this.handleInterval);    					
      				} else {
        				this.setState({ minutes: minutes -1 , seconds : 59 });
      				}		
    			}
  				}, 1000)

  			
  		});
		

	}

	componentWillUnmount() {
        clearInterval(this.myInterval)
    }

	render(){


		var minutes = this.state.minutes;
        var seconds = this.state.seconds;


		return(


			<div>

				<h3 className="timer"> Time remaining : { minutes }:{ seconds < 10 ? `0${ seconds }` : seconds } </h3>

			</div>


		)
	}

}

export default Timer;