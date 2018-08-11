import React from "react";
import {
    Segment,
    Dropdown,
    Label,
    Icon,
    Grid,
    Header
} from "semantic-ui-react";

export default function AccountSelector({
    accounts,
    onAccountChange,
    currentAccount,
    balance
}) {
    let options = accounts.map(acnt => ({
        text: acnt,
        value: acnt
    }));

    return (
        <div className="accounts" style={{ height: "100%", width: "100%" }}>
            <Grid
                textAlign="center"
                style={{ height: "100%", width: "100%" }}
                verticalAlign="middle"
            >
                <Grid.Column style={{ maxWidth: "75%" }} stretched>
                    <Header as="h2" color="teal" textAlign="center">
                        Change Accounts
                    </Header>
                    <Segment>
                        <Header as="h4" color="teal" textAlign="center">
                            Current Account:
                        </Header>
                        <Dropdown
                            inline
                            options={options}
                            value={currentAccount}
                        />
                        <Header as="h4" color="teal" textAlign="center">
                            Balance
                        </Header>
                        <Icon name="ethereum" /> {balance}
                    </Segment>
                </Grid.Column>
            </Grid>
        </div>
    );
}
