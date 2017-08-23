import React, {Component} from 'react';

class ChatBar extends Component {

  render() {
  	console.log('Rendering <ChatBar/>');
    return (
	    <footer className="chatbar">
		      <input className="chatbar-username" onChange={this.props.updateUserName} placeholder={this.props.currentUser.name } name='name' />
		      <input className="chatbar-message" onKeyPress={this.props.createMessage} placeholder="Type a message and hit ENTER" name='test'/>
	    </footer>
    );
  }
}
export default ChatBar;

