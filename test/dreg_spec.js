const Dreg = require("Embark/contracts/Dreg");

let accounts;

config(
    {
        contracts: {
            Dreg: {}
        }
    },
    (err, allAccnts) => {
        accounts = allAccnts;
    }
);

const phoneNumber = "12345678998";
const name = "ABC";

contract("Dreg contract", () => {
    it("successfully adds a mapping from phone number to user", async () => {
        const insertTx = await Dreg.methods.insert(phoneNumber, name).send();
        assert.equal(insertTx.status, true);
    });

    it("retrieves name from phone number", async () => {
        var retName;
        await Dreg.methods
            .getName(phoneNumber)
            .send({ value: "100000000000000" })
            .on("receipt", function(receipt) {
                retName = receipt.events.sendName.returnValues.name;
            });
        assert.equal(name, retName);
    });

    it("Balance", async () => {
        const balance = await Dreg.methods.getBalance().call();
        console.log(balance);
        assert.equal(100000000000000, balance);
    });

    it("Balance Distribution", async () => {
        await Dreg.methods.getMoney().send();
        assert.equal(await Dreg.methods.getBalance().call(), 0);
    });
});
