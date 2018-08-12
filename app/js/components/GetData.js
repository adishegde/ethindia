import React from "react";
import {
    Segment,
    Icon,
    Grid,
    Header,
    Message,
    Button,
    Input,
    Modal,
    Loader
} from "semantic-ui-react";
import Dreg from "Embark/contracts/Dreg";

function ConfirmModal({ open, onConfirm, onCancel, trCost, loading }) {
    let cost = trCost;
    if (loading) cost = <Loader size="mini" />;

    return (
        <Modal open={open} onCancel={onCancel} basic size="small">
            <Header content="Confirm Transaction" />
            <Modal.Content>
                This transaction will cost {trCost} wei.
            </Modal.Content>
            <Modal.Actions>
                <Button basic color="red" inverted onClick={onCancel}>
                    <Icon name="remove" /> Cancel
                </Button>
                <Button color="green" inverted onClick={onConfirm}>
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
            result: "",
            loading: false,
            error: "",
            openModal: false,
            cost: 0
        };
    }

    render() {
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
                            {this.state.result ? (
                                <div>
                                    <Header as="h4" content="Result" />
                                    {this.state.result}
                                </div>
                            ) : null}
                        </Segment>
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
            loading: true
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
            .send({ value: this.state.cost + "0" })
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
