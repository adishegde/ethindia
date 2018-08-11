import React from "react";
import { Segment, Dropdown, Label, Icon } from "semantic-ui-react";

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
        <Segment color="teal" inverted>
            <span>
                Current Account:
                <Dropdown inline options={options} value={currentAccount} />
                <br />
            </span>
            <Label>
                <Icon name="ethereum" /> {balance}
            </Label>
        </Segment>
    );
}
