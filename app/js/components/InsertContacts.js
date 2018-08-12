import React from "react";
import {
    Grid,
    Header,
    Segment,
    TextArea,
    Button,
    Modal,
    Table,
    Icon,
    Message
} from "semantic-ui-react";
import Dreg from "Embark/contracts/Dreg";

function ConfirmModal({
    open,
    contacts,
    onConfirm,
    onCancel,
    gasEstimate,
    loading
}) {
    let rows = contacts.map((contact, idx) => (
        <Table.Row key={idx}>
            <Table.Cell>{contact.number}</Table.Cell>
            <Table.Cell>{contact.name}</Table.Cell>
        </Table.Row>
    ));

    return (
        <Modal open={open} basic onCancel={onCancel} size="small">
            <Header content="Confirm Transaction" />
            <Modal.Content>
                <Table celled>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Mobile Number</Table.HeaderCell>
                            <Table.HeaderCell>Name</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>{rows}</Table.Body>
                </Table>
                <Segment basic loading={loading}>
                    <Header
                        as="h4"
                        content="Gas Estimate"
                        style={{ color: "#FFFFFF" }}
                    />
                    {gasEstimate}
                </Segment>
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

export default class InsertContacts extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            text: "",
            openModal: false,
            error: "",
            contacts: [],
            loading: false,
            gasEstimate: 0,
            message: ""
        };
    }

    onChangeText = (e, { value }) => {
        this.setState({
            text: value
        });
    };

    onAddContacts = () => {
        let { text } = this.state;

        // Reset message states when button is clicked
        this.setState({
            message: "",
            error: ""
        });

        try {
            // Try and parse text to get JSON
            let contacts = JSON.parse(text);
            // Filter out contacts with falsy values for name and number
            contacts = contacts.filter(
                contact => contact.number && contact.name
            );

            // Open modal and show loading symbol
            this.setState({
                contacts,
                openModal: true,
                loading: true
            });

            // Get gas estimates for inserting each map
            let gasPromises = contacts.map(({ number, name }) =>
                Dreg.methods.insert(number, name).estimateGas()
            );

            // Wait for return value and setState
            Promise.all(gasPromises)
                .then(gasEstimates => {
                    this.setState({
                        gasEstimate: gasEstimates.reduce(
                            (sum, gas) => sum + gas,
                            0
                        ),
                        loading: false
                    });
                })
                .catch(error => {
                    error = error.toString();

                    this.setState({
                        openModal: false,
                        error,
                        loading: false
                    });

                    console.log(`InsertContacts.onAddContacts: ${error}`);
                });
        } catch (error) {
            error = error.toString();

            this.setState({
                error
            });
            console.log(`InsertContacts.onAddContacts: ${error}`);
        }
    };

    onModalConfirm = () => {
        // Close modal and reset UI state
        this.setState({
            openModal: false,
            loading: true,
            message: "",
            error: ""
        });

        let { gasEstimate, contacts } = this.state;

        let insertPormises = contacts.map(contact =>
            Dreg.methods
                .insert(contact.number, contact.name)
                .send({ from: window.defaultAccount, gas: 4612357 })
        );

        Promise.all(insertPormises)
            .then(() => {
                this.setState({
                    loading: false,
                    message: "Successfully inserted contacts"
                });
            })
            .catch(error => {
                error = error.toString();
                this.setState({
                    loading: false,
                    error
                });
                console.log(`InsertContacts.onModalConfirm: ${err}`);
            });
    };

    onModalCancel = () => {
        this.setState({
            openModal: false
        });
    };

    render() {
        let {
            text,
            openModal,
            error,
            loading,
            message,
            contacts,
            gasEstimate
        } = this.state;

        return (
            <div className="contacts" style={{ height: "100%", width: "100%" }}>
                <Grid
                    textAlign="center"
                    style={{ height: "100%", width: "100%" }}
                    verticalAlign="middle"
                >
                    <Grid.Column style={{ maxWidth: "75%" }} stretched>
                        <Header
                            as="h2"
                            content="Insert Contact Details"
                            color="teal"
                            textAlign="center"
                            subheader="A simulation of the contacts API"
                        />
                        <TextArea
                            placeholder="Add a JSON array containing the contact details"
                            value={text}
                            onChange={this.onChangeText}
                            syle={{ minHeight: "200px" }}
                            autoHeight={true}
                        />
                        <Button
                            onClick={this.onAddContacts}
                            loading={loading}
                            color="teal"
                        >
                            Add Contacts
                        </Button>
                        <ConfirmModal
                            open={openModal}
                            contacts={contacts}
                            onConfirm={this.onModalConfirm}
                            gasEstimate={gasEstimate}
                            loading={loading}
                            onCancel={this.onModalCancel}
                        />
                        <Segment basic>
                            {message ? (
                                <Message positive>
                                    <Message.Header>{message}</Message.Header>
                                </Message>
                            ) : null}
                            {error ? (
                                <Message error>
                                    <Message.Header>{error}</Message.Header>
                                </Message>
                            ) : null}
                        </Segment>
                    </Grid.Column>
                </Grid>
            </div>
        );
    }
}
