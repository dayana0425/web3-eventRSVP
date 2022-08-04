import { network, ethers } from "hardhat";
import "dotenv/config";

async function main() {
    // deploying contract
    const rsvpContractFactory = await ethers.getContractFactory("Web3RSVP");
    const rsvpContract = await rsvpContractFactory.deploy();
    await rsvpContract.deployed();
    console.log("Contract deployed to:", rsvpContract.address);

    // testing smart contract
    const [ deployer, address1, address2 ] = await ethers.getSigners();
    console.log("Contract deployed from: ", deployer);
    let deposit = ethers.utils.parseEther("1");
    let maxCapacity = 3;
    let timestamp = 1718926200;
    let eventDataCID = "bafybeibhwfzx6oo5rymsxmkdxpmkfwyvbjrrwcl7cekmbzlupmp5ypkyfi";
    let eventID;

    // testing new event creation
    let createNewEventTxn = await rsvpContract.createNewEvent(
        timestamp,
        deposit,
        maxCapacity,
        eventDataCID
    );
    let waitNewEvent = await createNewEventTxn.wait();
    if (waitNewEvent && waitNewEvent.events && waitNewEvent.events[0].args) {
        console.log("NEW EVENT CREATED:", waitNewEvent.events[0].event, waitNewEvent.events[0].args);
        eventID = waitNewEvent.events[0].args.eventID;
        console.log("EVENT ID:", eventID);
    }
    else {
        throw new Error("Failed: Creating New Event");
    }
    
    // testing rsvp - rsvping with deployer wallet
    let createNewRSVPTxn = await rsvpContract.createNewRSVP(eventID, { value: deposit });
    let waitNewRSVP = await createNewRSVPTxn.wait();
    if(waitNewRSVP && waitNewRSVP.events && waitNewRSVP.events[0].args) {
        console.log("NEW RSVP:", waitNewRSVP.events[0].event, waitNewRSVP.events[0].args);
    }
    else {
        throw new Error("Failed: RSVPing with Deployer Wallet");
    }
    

    // testing rsvp - rsvping with another wallet
    let createNewRSVPTxn1 = await rsvpContract.connect(address1).createNewRSVP(eventID, { value: deposit });
    let waitNewRSVP1 = await createNewRSVPTxn1.wait();
    if(waitNewRSVP1 && waitNewRSVP1.events && waitNewRSVP1.events[0].args) {
        console.log("NEW RSVP:", waitNewRSVP1.events[0].event, waitNewRSVP1.events[0].args);
    }
    else {
        throw new Error("Failed: RSVPing with Another Wallet (1)");
    }
    
    
    // testing rsvp - rsvping with another wallet
    let createNewRSVPTxn2 = await rsvpContract.connect(address2).createNewRSVP(eventID, { value: deposit });
    let waitNewRSVP2 = await createNewRSVPTxn2.wait();
    if(waitNewRSVP2 && waitNewRSVP2.events && waitNewRSVP2.events[0].args) {
        console.log("NEW RSVP:", waitNewRSVP2.events[0].event, waitNewRSVP2.events[0].args);
    }
    else {
        throw new Error("Failed: RSVPing with Another Wallet (2)");
    }
    

    // testing confirmation of all attendees
    let confirmAllAttendeesTxn = await rsvpContract.confirmAllAttendees(eventID);
    let waitConfirmAllAttendees = await confirmAllAttendeesTxn.wait();
    if(waitConfirmAllAttendees && waitConfirmAllAttendees.events && waitConfirmAllAttendees.events[0].args) {
        waitConfirmAllAttendees.events.forEach((event: any) => console.log("CONFIRMED:", event.args.attendeeAddress));
    }
    else {
        throw new Error("Failed: Testing Confirmation of All Attendees");
    }

    // testing withdraw leftover deposits
    await network.provider.send("evm_increaseTime", [15778800000000]); // wait 10 years
    let withdrawUnclaimedDepositsTxn = await rsvpContract.withdrawUnclaimedDeposits(eventID);
    let waitWithdrawUnclaimedDeposits = await withdrawUnclaimedDepositsTxn.wait();
    if(waitWithdrawUnclaimedDeposits && waitWithdrawUnclaimedDeposits.events && waitWithdrawUnclaimedDeposits.events[0].args) {
        console.log("WITHDRAWN:", waitWithdrawUnclaimedDeposits.events[0].event, waitWithdrawUnclaimedDeposits.events[0].args);
    }
    else {
        throw new Error("Failed: Testing Withdraw Leftover Deposits");
    }
}

main()
    .then(() => 
        process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });