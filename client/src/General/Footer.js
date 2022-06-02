import React from 'react';
import './Footer.css';
import StickyFooter from 'react-sticky-footer';

class Footer extends React.Component {

	render () {
		return (

			<StickyFooter
    		bottomThreshold={50}
    		normalStyles={{
    			backgroundColor: "rgb(52, 58, 64)",
    			padding: "2rem",
    			color:"white"
    		}}
    		stickyStyles={{
    			backgroundColor: "rgb(52, 58, 64)",
    			padding: "2rem",
    			color:"white"
    		}}
			>
    			By Maxence Gélard, DTY Spring
			</StickyFooter>

		);
	}
}

export default Footer;