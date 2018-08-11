const Dreg = require("Embark/contracts/Dreg");

let accounts;

config({
    contracts: {
	Dreg: {
	}
    }
}, (err, allAccnts) => {
    accounts = allAccnts;
});

const phoneNumber = "12345678998";
const name = "ABC";

contract("Dreg contract", () => {
    it("successfully adds a mapping from phone number to user", async () => {
	const insertTx = await Dreg.methods.insert(phoneNumber, name).send();
	assert.equal(insertTx, true);
    });

    it("retrieves name from phone number", async () => {
	const retName = await Dreg.methods.getName(phoneNumber).send();
	assert.equal(name, retName);
    });
});
