import React, {Component} from 'react';
import MessageList from './MessageList.jsx';
import ChatBar from './ChatBar.jsx';

class App extends Component {
	constructor(props){
		super(props);
		this.state = {
		currentUser: {name: "Anon"},
    messages: []
	  };
	}
  createMessage(e){
    if (e.key === 'Enter') {
    	const message = {
  		  username: this.state.currentUser.name,
        content: e.target.value,
        type: 'postMessage'
  	};
  	e.target.value = ''
  	this.socket.send(JSON.stringify(message))
    }
  }

  updateUserName(e){
  	if (e.key === 'Enter') {
  		const userName = {
        oldName: this.state.currentUser.name,
  		  newName: e.target.value,
  		  type: 'postNotification' 	
  		}
      e.target.value = ''
      this.socket.send(JSON.stringify(userName))
    }
  }

	componentDidMount() {
	  console.log("componentDidMount <App />");
	  console.log('Connected to server') 
	  this.socket = new WebSocket('ws://localhost:3001');

	  this.socket.onmessage = (e) => {
	  	const data = JSON.parse(e.data);
	  	switch(data.type){
	  		case 'incomingMessage':
          console.log(data)
	  	    this.setState({messages: this.state.messages.concat(data)})
	  	    break;
	  	  case 'incomingNotification':
          console.log(data)
          this.setState({currentUser: {name: data.newName}})
	  	    break;
	  	  default:
	  	    throw new Error("Unknown event type " + data.type);
	  	}
	  }
  };
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
