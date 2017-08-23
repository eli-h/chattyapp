import React, {Component} from 'react';
import MessageList from './MessageList.jsx';
import ChatBar from './ChatBar.jsx';

class App extends Component {
	constructor(props){
		super(props);
		this.socket = new WebSocket('ws://localhost:3001');
		this.state = {
		currentUser: {name: "Bob"},
    messages: [
	    {
	    	key: 1,
	      username: "Bob",
	      content: "Has anyone seen my marbles?",
	    },
	    {
	    	key: 2,
	      username: "Anonymous",
	      content: "No, I think you lost them. You lost your marbles Bob. You lost them for good."
	    }
	  ]
	  }
	}

  createMessage(e){
    if (e.key === 'Enter') {
    	const message = {
  		  username: this.state.currentUser.name,
        content: e.target.value
  	};
  	e.target.value = ''
      const newMessages = this.state.messages.concat(message)
  	  this.setState({messages: newMessages})
    }
  }

  updateUserName(e){
  	this.state.currentUser.name = e.target.value
  }

	componentDidMount() {
	  console.log("componentDidMount <App />");
	  this.socket
	  console.log('Connected to server')
  }
  render() {

  	console.log('Rendering <App/>');
    return (
    	<div>
	      <MessageList messages={this.state.messages}/>
	      <ChatBar currentUser={this.state.currentUser} updateUserName={this.updateUserName.bind(this)}  createMessage={this.createMessage.bind(this)}/>
	    </div>
    );
  }
}
export default App;
