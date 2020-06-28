import React, { Component } from 'react';
import { Button, Container, Col, Form, Row } from "react-bootstrap";

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
      <Container fluid className="App">
        <Row className="justify-content-md-center">
          <Col>
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
            <Form onSubmit={this.handleSubmitRequestEth}>
              <Form.Group controlId="formRequestEth">
                <Row className="justify-content-md-center">
                  <Col xs={12} md={4}>
                    <Form.Label>Request ETH</Form.Label>
                  </Col>
                  <Col xs={12} md={8}>
                    <Form.Control type="text" ref={this.ethAddressForEth} name="ethAddressForEth" placeholder="Ethereum Address" onChange={(e) => this.setState({ ethAddressForEth: e.target.value})}/>
                    <Form.Text className="text-muted">
                      Ethereum address for Ropsten ETH
                    </Form.Text>
                    <Button variant="primary" className="btn btn-lg" type="submit">Submit</Button>
                  </Col>
                </Row>
              </Form.Group>
            </Form>
            <Form onSubmit={this.handleSubmitRequestMxc}>
              <Form.Group controlId="formRequestMxc">
                <Row className="justify-content-md-center">
                  <Col xs={12} md={4}>
                    <Form.Label>Request MXC</Form.Label>
                  </Col>
                  <Col xs={12} md={8}>
                    <Form.Control type="text" ref={this.ethAddressForMxc} name="ethAddressForMxc" placeholder="Ethereum Address" onChange={(e) => this.setState({ ethAddressForMxc: e.target.value})}/>
                    <Form.Text className="text-muted">
                      Ethereum address for MXC ERC-20 tokens
                    </Form.Text>
                    <Button variant="primary" className="btn btn-lg" type="submit">Submit</Button>
                  </Col>
                </Row>
              </Form.Group>
            </Form>
            <Row className="justify-content-md-center">
              <Col xs={12} md={12}>
                <p>{responseMsg} {responseMsg ? <a target="_new" href={responseTx}>View Transaction</a> : null}</p>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default App;
