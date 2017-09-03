import React, {Component} from 'react';
import MessageList from './MessageList.jsx';
import ChatBar from './ChatBar.jsx';

class App extends Component {
	constructor(props){
		super(props);
		this.state = {
		currentUser: {name: 'Anon'},
    messages: []
	  };
	}
  createMessage(e){
    if (e.key === 'Enter') {
    	const message = {
  		  type: 'postMessage',
        data: {
          username: this.state.currentUser.name,
          content: e.target.value
        }
  	};
  	e.target.value = ''
  	this.socket.send(JSON.stringify(message))
    }
  }

  updateUserName(e){
    const currentUser = {
      name: e.target.value
    }
  	if (e.key === 'Enter') {
  		const userName = {
        type: 'postNotification',
        data: {
          oldName: this.state.currentUser.name,
          newName: currentUser.name
        } 	
  		}
      e.target.value = ''
      this.socket.send(JSON.stringify(userName))
      this.setState({currentUser})
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
          let newMessage = [...this.state.messages, data.data]
	  	    this.setState({messages: newMessage})
	  	    break;
	  	  case 'incomingNotification':
          let newName = [... this.state.messages, data.data]
          this.setState({ messages: newName});
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
        <nav className="navbar"><div className="navbar-counter">Users: {this.state.users}</div>
          <a href="/" className="navbar-brand">Chatty</a>
        </nav>
	      <MessageList messages={this.state.messages}/>
	      <ChatBar currentUser={this.state.currentUser.name} updateUserName={this.updateUserName.bind(this)}  createMessage={this.createMessage.bind(this)}/>
	    </div>
    );
  }
}
export default App;
