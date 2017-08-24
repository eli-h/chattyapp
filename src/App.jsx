import React, {Component} from 'react';
import MessageList from './MessageList.jsx';
import ChatBar from './ChatBar.jsx';

class App extends Component {
	constructor(props){
		super(props);
		this.state = {
		currentUser: {oldName: '',
      newName: "Anon"
    },
    messages: []
	  };
	}
  createMessage(e){
    if (e.key === 'Enter') {
    	const message = {
  		  username: this.state.currentUser.newName,
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
        oldName: this.state.currentUser.newName,
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
          let newMessage = this.state.messages.concat(data);
	  	    this.setState({messages: newMessage})
	  	    break;
	  	  case 'incomingNotification':
          this.setState({currentUser: {oldName: data.oldName, newName: data.newName}})
          this.setState({
            messages: this.state.messages.concat({
              content: data.oldName + ' has changed their username to ' + data.newName,
              id: data.id,
              username: ''
            })})
	  	    break;
        case 'userCount':
          this.setState({users: data.users});
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
        <nav className="navbar"><div className="navbar-counter">Mans: {this.state.users}</div>
          <a href="/" className="navbar-brand">Chatty</a>
        </nav>
	      <MessageList messages={this.state.messages}/>
	      <ChatBar currentUser={this.state.currentUser.newName} updateUserName={this.updateUserName.bind(this)}  createMessage={this.createMessage.bind(this)}/>
	    </div>
    );
  }
}
export default App;
