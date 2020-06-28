import React, { Component } from 'react';
import { Button, Container, Col, Form, Row } from "react-bootstrap";

import './App.css';

class App extends Component {
  state = {
    ethAddressForEth: '',
    ethAddressForMxc: '',
    responseMessage: '',
    responseTx: ''
  };

  handleSubmitRequestEth = async e => {
    e.preventDefault();
    const data = new FormData(e.target);
    const inputEthAddress = data.get('ethAddressForEth');
    if (inputEthAddress === '') {
      return;
    }
    const url = new URL(`${window.location.href}api/faucet/eth/ropsten`);
    const params = { address: inputEthAddress };
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    const response = await fetch(url, {
      method: 'GET',
    });
    if (response.status !== 200) {
      this.setState({
        responseMsg: response.statusText,
      });
      return;
    };
    const json = await response.json();
    console.log('Response from handling request for Eth in json: ', json);
    this.setState({
      responseMsg: json.message,
      responseTx: json.tx
    });
  };

  handleSubmitRequestMxc = async e => {
    e.preventDefault();
    const data = new FormData(e.target);
    const inputEthAddress = data.get('ethAddressForMxc');
    if (inputEthAddress === '') {
      return;
    }
    const url = new URL(`${window.location.href}api/faucet/mxc/ropsten`);
    const params = { address: inputEthAddress };
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    const response = await fetch(url, {
      method: 'GET',
    });
    if (response.status !== 200) {
      this.setState({
        responseMsg: response.statusText,
      });
      return;
    };
    const json = await response.json();
    console.log('Response from handling request for MXC in json: ', json);
    this.setState({
      responseMsg: json.message,
      responseTx: json.tx
    });
  };
  
  render() {
    const { responseMsg, responseTx } = this.state;
    return (
      <Container fluid className="App">
        <Row className="justify-content-md-center">
          <Col>
            <Form onSubmit={this.handleSubmitRequestEth}>
              <Form.Group controlId="formRequestEth">
                <Row className="justify-content-md-center">
                  <Col xs={12} md={2}>
                    <Form.Label><h3>Request ETH</h3></Form.Label>
                  </Col>
                  <Col xs={12} md={5}>
                    <Form.Control
                      type="text"
                      ref={this.ethAddressForEth}
                      name="ethAddressForEth" placeholder="Ethereum Address"
                      onChange={(e) => this.setState({ ethAddressForEth: e.target.value})}
                    />
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
                  <Col xs={12} md={2}>
                    <Form.Label><h3>Request MXC</h3></Form.Label>
                  </Col>
                  <Col xs={12} md={5}>
                    <Form.Control
                      type="text"
                      ref={this.ethAddressForMxc}
                      name="ethAddressForMxc"
                      placeholder="Ethereum Address"
                      onChange={(e) => this.setState({ ethAddressForMxc: e.target.value})}
                    />
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
                <p>{responseMsg} {responseTx ? <a target="_new" href={responseTx}>View Transaction</a> : null}</p>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default App;
