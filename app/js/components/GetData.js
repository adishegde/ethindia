import React from "react";
import {
    Segment,
    Icon,
    Grid,
    Header,
    Message,
    Button,
    Input,
    Modal
} from "semantic-ui-react";
import Dreg from "Embark/contracts/Dreg";

function ConfirmModal({ open, onConfirm, onCancel, trCost, loading }) {
    let cost = web3.utils.fromWei(trCost, "ether");
    if (loading) cost = "-";

    return (
        <Modal open={open} onCancel={onCancel} basic size="small">
            <Header content="Confirm Transaction" />
            <Modal.Content>
                This transaction will cost <Icon name="ethereum" />
                {cost} ETH.
            </Modal.Content>
            <Modal.Actions>
                <Button basic color="red" inverted onClick={onCancel}>
                    <Icon name="remove" /> Cancel
                </Button>
                <Button
                    color="green"
                    inverted
                    onClick={onConfirm}
                    loading={loading}
                >
                    <Icon name="checkmark" /> Confirm
                </Button>
            </Modal.Actions>
        </Modal>
    );
}

export default class GetData extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            query: "",
            result: null,
            loading: false,
            error: "",
            openModal: false,
            cost: 0
        };
    }

    render() {
        let resultEl = null;
        if (this.state.result !== null) {
            resultEl = (
                <Segment basic>
                    <div>
                        <Header as="h3" content="Result" color="teal" />
                        {this.state.result || "No results found"}
                    </div>
                </Segment>
            );
        }

        return (
            <div className="get-data" style={{ height: "100%", width: "100%" }}>
                <Grid
                    textAlign="center"
                    style={{ height: "100%", width: "100%" }}
                    verticalAlign="middle"
                >
                    <Grid.Column style={{ maxWidth: "75%" }} stretched>
                        <Header as="h2" color="teal" textAlign="center">
                            Query using Mobile Number
                        </Header>
                        <Segment.Group>
                            <Segment>
                                <Input
                                    value={this.state.query}
                                    onChange={this.onInputChange}
                                    placeholder="Enter mobile number"
                                />
                                <Button
                                    onClick={this.onSearch}
                                    color="teal"
                                    loading={this.state.loading}
                                >
                                    Search
                                </Button>
                            </Segment>
                            {resultEl}
                        </Segment.Group>
                        {this.state.error ? (
                            <Message negative>
                                <Message.Header>
                                    {this.state.error}
                                </Message.Header>
                            </Message>
                        ) : null}
                        <ConfirmModal
                            open={this.state.openModal}
                            onCancel={this.onModalCancel}
                            onConfirm={this.onModalConfirm}
                            trCost={this.state.cost}
                            loading={this.state.loading}
                        />
                    </Grid.Column>
                </Grid>
            </div>
        );
    }

    onInputChange = (e, { value }) => {
        this.setState({
            query: value
        });
    };

    onSearch = () => {
        this.setState({
            openModal: true,
            loading: true,
            result: null
        });

        Dreg.methods
            .getCharge()
            .call()
            .then(cost => {
                this.setState({
                    cost,
                    loading: false
                });
            })
            .catch(error => {
                error = error.toString();

                this.setState({
                    error,
                    loading: false,
                    openModal: false
                });
                console.log(`GetData.onSearch: ${error}`);
            });
    };

    onModalConfirm = () => {
        this.setState({
            openModal: false,
            loading: true,
            error: ""
        });

        Dreg.methods
            .getName(this.state.query)
            .send({ value: this.state.cost })
            .on("receipt", receipt => {
                var retName = receipt.events.sendName.returnValues.name;

                this.setState({
                    result: retName,
                    loading: false
                });
            })
            .on("error", error => {
                error = error.toString();

                this.setState({
                    error: error,
                    loading: false
                });
                console.log(`GetData.onModalConfirm: ${error}`);
            });
    };

    onModalCancel = () => {
        this.setState({
            openModal: false,
            error: ""
        });
    };
}
