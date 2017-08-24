import React, {Component} from 'react';

class Message extends Component {
  render() {
  	console.log('Rendering <Message/>');
  	if (this.props.type === 'notification'){
  		return(
  		  <div className="message system">{this.props.userContent}</div>
  		)
  	} else {
	    return (
	      <div className="message">
	        <span className="message-username">{this.props.userName}</span>
	        <span className="message-content">{this.props.userContent}</span>
	      </div>
	    );
    }
  }
}
export default Message;