import React, { Component } from 'react';
import { Alert, Button, Container, Col, Form, Row, Spinner } from "react-bootstrap";

import './App.css';

class App extends Component {
  state = {
    ethAddressForEth: '',
    ethAddressForMxc: '',
    dhxAddressForDhx: '',
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

    this.setState({ isLoading: true });
    const response = await fetch(url, {
      method: 'GET',
    });
    this.setState({ isLoading: false });
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

    this.setState({ isLoading: true });
    const response = await fetch(url, {
      method: 'GET',
    });
    this.setState({ isLoading: false });
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
  
  handleSubmitRequestDhx = async e => {
    e.preventDefault();
    const data = new FormData(e.target);
    const inputDhxAddress = data.get('dhxAddressForDhx');
    if (inputDhxAddress === '') {
      return;
    }
    const url = new URL(`${window.location.href}api/faucet/dhx/harbour`);
    const params = { address: inputDhxAddress };
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    this.setState({ isLoading: true });
    const response = await fetch(url, {
      method: 'GET',
    });
    this.setState({ isLoading: false });
    if (response.status !== 200) {
      this.setState({
        responseMsg: response.statusText,
      });
      return;
    };
    const json = await response.json();
    console.log('Response from handling request for DHX in json: ', json);
    this.setState({
      responseMsg: json.message,
      responseTx: json.tx
    });
  };

  render() {
    const { isLoading, responseMsg, responseTx } = this.state;
    return (
      <Container fluid className="App">
        <Row className="justify-content-md-center">
          <Col xs={12} md={1}>
            <a target="_blank" rel="noopener noreferrer" href="https://datahighway.com">
              <img
                width={64}
                height={64}
                className="align-self-start mr-3"
                src="./datahighwayicon.png"
                alt="DataHighway"
              />
            </a>
          </Col>
          <Col xs={12} md={11} className="mt-4">
            <h2>DataHighway Faucet</h2><br />
            <p className="media-body-description">
              The DataHighway Faucet has been provided to allow users to request different tokens to test the DataHighway Harbour Testnet.
            </p>
          </Col>
        </Row>
        <Row className="justify-content-md-center">
          <Col>
            { responseMsg || responseTx ? (
                <Row className="justify-content-md-center">
                  <Col xs={12} md={12}>
                    <Alert variant="info">
                      {responseMsg} {responseTx ? <a target="_new" href={responseTx}>View Transaction</a> : null}
                    </Alert>
                  </Col>
                </Row>
              ) : null
            }
            {
              isLoading && (!responseMsg || !responseTx) ? (
                <Spinner animation="border" variant="primary" />
              ) : null
            }
            <hr className="mb-4" />
            <Form onSubmit={this.handleSubmitRequestEth}>
              <Form.Group controlId="formRequestEth">
                <Row className="justify-content-md-center">
                  <Col xs={12} md={3}>
                    <Form.Label><h6>ETH (Ropsten Testnet)</h6></Form.Label>
                  </Col>
                  <Col xs={8} md={5} >
                    <Form.Control
                      type="text"
                      ref={this.ethAddressForEth}
                      name="ethAddressForEth" placeholder="Ethereum Address"
                      onChange={(e) => this.setState({ ethAddressForEth: e.target.value})}
                    />
                    <Form.Text className="text-muted">
                      Ethereum address for Ropsten ETH to pay for gas fees necessary to mine MXC or pegged IOTA ERC-20 tokens
                    </Form.Text>
                  </Col>
                  <Col xs={3} md={2} className="request">
                    <Button variant="primary" className="btn btn-md" type="submit">Request</Button>
                  </Col>
                </Row>
              </Form.Group>
            </Form>
            <hr className="mb-4" />
            <Form onSubmit={this.handleSubmitRequestMxc}>
              <Form.Group controlId="formRequestMxc">
                <Row className="justify-content-md-center">
                  <Col xs={12} md={3}>
                    <Form.Label><h6>MXC (Ropsten Testnet)</h6></Form.Label>
                  </Col>
                  <Col xs={8} md={5}>
                    <Form.Control
                      type="text"
                      ref={this.ethAddressForMxc}
                      name="ethAddressForMxc"
                      placeholder="Ethereum Address"
                      onChange={(e) => this.setState({ ethAddressForMxc: e.target.value})}
                    />
                    <Form.Text className="text-muted">
                      Ethereum address for Ropsten MXC ERC-20 tokens for mining
                    </Form.Text>
                  </Col>
                  <Col xs={3} md={2} className="request">
                    <Button variant="primary" className="btn btn-md" type="submit">Request</Button>
                  </Col>
                </Row>
              </Form.Group>
            </Form>
            <hr className="mb-4" />
            <Form onSubmit={this.handleSubmitRequestDhx}>
              <Form.Group controlId="formRequestDhx">
                <Row className="justify-content-md-center">
                  <Col xs={12} md={3}>
                    <Form.Label><h6>DHX (Harbour Testnet)</h6></Form.Label>
                  </Col>
                  <Col xs={8} md={5}>
                    <Form.Control
                      type="text"
                      ref={this.dhxAddressForDhx}
                      name="dhxAddressForDhx"
                      placeholder="DataHighway Address"
                      onChange={(e) => this.setState({ dhxAddressForDhx: e.target.value})}
                    />
                    <Form.Text className="text-muted">
                      DataHighway address for Harbour Testnet DHX tokens
                    </Form.Text>
                  </Col>
                  <Col xs={3} md={2} className="request">
                    <Button variant="primary" className="btn btn-md" type="submit">Request</Button>
                  </Col>
                </Row>
              </Form.Group>
            </Form>
          </Col>
        </Row>
        <Row className="justify-content-md-center">
          <Col xs={12} md={12}>
            <Alert variant="light">
              <Alert.Heading>Support</Alert.Heading>
              <p>
                The faucet only works when your testnet balances are low enough: Ropsten ETH balance is &lt; 1 ETH; Ropsten MXC ERC-20 token balance is &lt; 1 MXC; DataHighway DHX token balance is &lt; 1 DHX. It does not support the supplying smart contracts, since only a limited gas price has been catered for.
              </p>
              <hr />
              <p className="mb-0">
              If the faucet is depleted of funds, then please click <a target="_blank" rel="noopener noreferrer" href="https://github.com/DataHighway-DHX/faucet/issues/new">here</a> to create a support ticket and provide your DataHighway Harbour and Ethereum address.
              </p>
            </Alert>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default App;
