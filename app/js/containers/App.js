import React from "react";
import EmbarkJS from "Embark/EmbarkJS";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import AccountSelector from "../components/AccountSelector";
import GetData from "../components/GetData";
import TopMenu from "../components/TopMenu";
import InsertContacts from "../components/InsertContacts";

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            accounts: [],
            currentAccount: "",
            balance: 0
        };
    }

    loadAccountUsers() {
        web3.eth
            .getAccounts()
            .then(accounts => {
                this.setState({
                    accounts
                });
                this.onAccountChange(accounts[0]);
            })
            .catch(err => {
                console.log(`App.loadAccountUsers: ${err}`);
            });
    }

    onAccountChange = accnt => {
        this.setState({
            currentAccount: accnt
        });

        web3.eth.defaultAccount = accnt;

        web3.eth
            .getBalance(accnt)
            .then(balance => {
                balance = web3.utils.fromWei(balance, "ether");
                balance = Number.parseFloat(balance).toFixed(3);

                this.setState({
                    balance
                });
            })
            .catch(err => {
                console.log(`App.onAccountChange: ${err}`);
            });
    };

    componentDidMount() {
        EmbarkJS.onReady(() => {
            this.loadAccountUsers();
        });
    }

    render() {
        let { accounts, balance, currentAccount } = this.state;

        return (
            <div id="app" style={{ width: "100%", height: "100%" }}>
                <TopMenu />
                <Switch>
                    <Route path="/" exact component={GetData} />
                    <Route
                        path="/accounts"
                        render={() => (
                            <AccountSelector
                                accounts={accounts}
                                currentAccount={currentAccount}
                                balance={balance}
                                onAccountChange={this.onAccountChange}
                            />
                        )}
                    />
                    <Route path="/insert" component={InsertContacts} />
                </Switch>
            </div>
        );
    }
}
