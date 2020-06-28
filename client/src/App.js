import React, { Component } from 'react';

import logo from './logo.svg';

import './App.css';

class App extends Component {
  state = {
    response: '',
    post: '',
    responseToPost: '',
    ethAddressForEth: '',
    ethAddressForMxc: '',
    responseMessage: '',
    responseTx: '',
  };
  
  componentDidMount() {
    // this.callApi()
    //   .then(res => this.setState({ response: res.express }))
    //   .catch(err => console.log(err));
  }
  
  /**
   * GET request to API route
   */
  callApi = async () => {
    const response = await fetch('/api/hello');
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    
    return body;
  };

  handleSubmitRequestEth = async e => {
    e.preventDefault();
    const { ethAddressForEth } = this.state;
    const data = new FormData(e.target);
    const url = new URL(`${window.location.href}api/faucet/eth/ropsten`);
    const params = { address: data.get('ethAddressForEth') };
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    const response = await fetch(url, {
      method: 'GET',
    });
    const json = await response.json();
    console.log('Response from handling request for Eth in json: ', json);
    this.setState({
      responseMsg: json.message,
      responseTx: json.tx
    });
  };

  handleSubmitRequestMxc = async e => {
    e.preventDefault();
    const { ethAddressForMxc } = this.state;
    const data = new FormData(e.target);
    const url = new URL(`${window.location.href}api/faucet/mxc/ropsten`);
    const params = { address: data.get('ethAddressForMxc') };
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    const response = await fetch(url, {
      method: 'GET',
    });
    const json = await response.json();
    console.log('Response from handling request for MXC in json: ', json);
    this.setState({
      responseMsg: json.message,
      responseTx: json.tx
    });
  };

  handleSubmit = async e => {
    e.preventDefault();
    const { post } = this.state;
    const response = await fetch('/api/world', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ post }),
    });
    const body = await response.text();

    this.setState({ responseToPost: body });
  };
  
  render() {
    const { ethAddressForEth, ethAddressForMxc, post, response, responseToPost, responseMsg, responseTx } = this.state;
    return (
      <div className="App">
        {/* <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
        </header>
        <p>{response}</p>
        <form onSubmit={this.handleSubmit}>
          <p>
            <strong>Post to Server:</strong>
          </p>
          <input
            type="text"
            value={post}
            onChange={e => this.setState({ post: e.target.value })}
          />
          <button type="submit">Submit</button>
        </form>
        <p>{responseToPost}</p> */}
        <form onSubmit={this.handleSubmitRequestEth}>
          <p>
            <strong>Request ETH:</strong>
          </p>
          <input
            type="text"
            id="ethAddressForEth"
            name="ethAddressForEth"
            value={ethAddressForEth}
            onChange={e => this.setState({ ethAddressForEth: e.target.value })}
          />
          <button type="submit">Submit</button>
        </form>
        <form onSubmit={this.handleSubmitRequestMxc}>
          <p>
            <strong>Request MXC:</strong>
          </p>
          <input
            type="text"
            id="ethAddressForMxc"
            name="ethAddressForMxc"
            value={ethAddressForMxc}
            onChange={e => this.setState({ ethAddressForMxc: e.target.value })}
          />
          <button type="submit">Submit</button>
        </form>
        
        <p>{responseMsg} {responseMsg ? <a target="_new" href={responseTx}>View Transaction</a> : null}</p>
      </div>
    );
  }
}

export default App;
