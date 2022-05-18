const main = async () => {
    const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");  // Compile contract and generate necessary files under '/artifacts'
    const waveContract = await waveContractFactory.deploy();    // Create local Eth network and deploy contract
    await waveContract.deployed();  // Wait until contract is deployed and run the constructor
    console.log("Contract addy:", waveContract.address);

    let waveCount;
    waveCount = await waveContract.getTotalWaves();
    console.log(waveCount.toNumber());

    let waveTxn = await waveContract.wave("A message!");
    await waveTxn.wait();

    const [_, randomPerson] = await hre.ethers.getSigners();
    waveTxn = await waveContract.connect(randomPerson).wave("Another message!");
    await waveTxn.wait();

    let allWaves = await waveContract.getAllWaves();
    console.log(allWaves);
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