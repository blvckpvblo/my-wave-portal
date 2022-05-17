const main = async () => {
    const [owner, randomPerson, otherRandomPerson] = await hre.ethers.getSigners();
    const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");  // Compile contract and generate necessary files under '/artifacts'
    const waveContract = await waveContractFactory.deploy();    // Create local Eth network and deploy contract
    await waveContract.deployed();  // Wait until contract is deployed and run the constructor

    console.log("Contract deployed to:", waveContract.address);
    console.log("Contract deployed by:", owner.address);

    let waveCount;
    waveCount = await waveContract.getTotalWaves();

    let waveTxn = await waveContract.wave();
    await waveTxn.wait();

    waveCount = await waveContract.getTotalWaves();

    waveTxn = await waveContract.connect(randomPerson).wave();
    await waveTxn.wait();

    waveCount = await waveContract.getTotalWaves();

    waveTxn = await waveContract.connect(randomPerson).wave();
    await waveTxn.wait();

    waveTxn = await waveContract.connect(otherRandomPerson).wave();
    await waveTxn.wait();

    randomPersonTotalWaves = await waveContract.getSenderTotalWaves(randomPerson.address);
    randomPersonTotalWaves = await waveContract.getSenderTotalWaves(otherRandomPerson.address);
};

const runMain = async () => {
    try {
        await main();
        process.exit(0);    // Exit Node process without error
    } catch (error) {
        console.log(error);
        process.exit(1);    // Exit Node process while indicating 'Uncaught Fatal Exception' error
    }
};

runMain();