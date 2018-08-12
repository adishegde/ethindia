import React from "react";
import {
    Segment,
    Table,
    Button,
    Icon,
    Modal,
    Loader,
    Header
} from "semantic-ui-react";
import Dreg from "Embark/contracts/Dreg";

function ConfirmModal({ open, gasEstimate, onCancel, onConfirm }) {
    return (
        <Modal open={open} basic size="small">
            <Header as="h2" content="Confirm Transaction" />
            <Modal.Content>
                {gasEstimate ? (
                    `Estimated gas for transaction: ${gasEstimate}`
                ) : (
                    <Loader size="small" />
                )}
            </Modal.Content>
            <Modal.Actions>
                <Button color="red" onClick={onCancel} inverted>
                    <Icon name="remove" /> Cancel
                </Button>
                <Button color="green" onClick={onConfirm} inverted>
                    <Icon name="checkmark" /> Confirm
                </Button>
            </Modal.Actions>
        </Modal>
    );
}

export default class AccountInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            openModal: false,
            gasEstimate: "43715"
        };
    }

    onModalClose = () => {
        this.setState({
            openModal: false
        });
    };

    onModalConfirm = () => {
        this.setState({
            openModal: false
        });
        this.props.onGetMoney();
    };

    onModalOpen = () => {
        this.setState({
            openModal: true
        });

        Dreg.methods
            .getMoney()
            .estimateGas()
            .then(gasEstimate => {
                console.log(gasEstimate);
                this.setState({
                    gasEstimate
                });
            })
            .catch(err => {
                console.log(`AccountInfo.onModalOpen: ${err}`);
            });
    };

    render() {
        let { account, balance, attachTo, onGetMoney } = this.props;
        return (
            <Segment
                style={{ position: "fixed", top: "30px", right: "5px" }}
                basic
            >
                <Table definition compact>
                    <Table.Body>
                        <Table.Row>
                            <Table.Cell>Account</Table.Cell>
                            <Table.Cell>{account}</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>Balance</Table.Cell>
                            <Table.Cell>
                                <Icon name="ethereum" />
                                {balance} ETH
                            </Table.Cell>
                        </Table.Row>
                    </Table.Body>
                    <Table.Footer fullWidth>
                        <Table.Row>
                            <Table.Cell colSpan="2">
                                <Button
                                    onClick={this.onModalOpen}
                                    color="teal"
                                    fluid
                                >
                                    Collect Payment
                                </Button>
                                <ConfirmModal
                                    open={this.state.openModal}
                                    gasEstimate={this.state.gasEstimate}
                                    onCancel={this.onModalClose}
                                    onConfirm={this.onModalConfirm}
                                />
                            </Table.Cell>
                        </Table.Row>
                    </Table.Footer>
                </Table>
            </Segment>
        );
    }
}
