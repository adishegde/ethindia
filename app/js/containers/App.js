import React from "react";
import EmbarkJS from "Embark/EmbarkJS";
import Dreg from "Embark/contracts/Dreg";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import GetData from "../components/GetData";
import AccountInfo from "../components/AccountInfo";
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
        window.defaultAccount = accnt; // Minor hack inject default account

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

    updateBalance = () => {
        web3.eth.getBalance(this.state.currentAccount).then(balance => {
            balance = web3.utils.fromWei(balance, "ether");
            balance = Number.parseFloat(balance).toFixed(3);

            this.setState({
                balance
            });
        });
    };

    componentDidMount() {
        EmbarkJS.onReady(() => {
            this.loadAccountUsers();
        });
    }

    onGetMoney = () => {
        Dreg.methods
            .getMoney()
            .send({ from: window.defaultAccount, gas: 4612357 })
            .catch(err => {
                console.log(`App.onGetMoney: ${err}`);
            })
            .then(() => {
                this.updateBalance();
            });
    };

    render() {
        let { accounts, balance, currentAccount, contextRef } = this.state;
        window.onTransaction = this.updateBalance;

        return (
            <div id="app" style={{ width: "100%", height: "100%" }}>
                <TopMenu />
                <AccountInfo
                    account={currentAccount}
                    balance={balance}
                    onGetMoney={this.onGetMoney}
                    onAccountChange={this.onAccountChange}
                    accounts={accounts}
                    currentAccount={currentAccount}
                />
                <Switch>
                    <Route path="/" exact component={GetData} />
                    <Route path="/insert" component={InsertContacts} />
                </Switch>
            </div>
        );
    }
}
