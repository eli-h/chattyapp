import React, {Component} from 'react';
import Message from './Message.jsx';



class MessageList extends Component {

  render() {
  const userMessage = this.props.messages
  const listMessages = userMessage.map((message,index) => (
		  <Message key={index} userName={message.username} userContent={message.content}/>
		))
  	console.log('Rendering <MessageList/>');
    return (
	    <main className="messages">
	      <div>{listMessages}</div>
	    </main>
    );
  }
}
export default MessageList;