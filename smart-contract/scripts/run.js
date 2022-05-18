const main = async () => {
    const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");  // Compile contract and generate necessary files under '/artifacts'
    const waveContract = await waveContractFactory.deploy({ value: hre.ethers.utils.parseEther("0.1") });    // Create local Eth network and deploy contract
    await waveContract.deployed();  // Wait until contract is deployed and run the constructor
    console.log("Contract addy:", waveContract.address);

    /**
     * Get contract balance
     */
    let contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
    console.log("Contract balance:", hre.ethers.utils.formatEther(contractBalance));

    /**
     * Send wave
     */
    let waveTxn = await waveContract.wave('A message!');
    await waveTxn.wait();

    let waveTxn2 = await waveContract.wave('A message!');
    await waveTxn2.wait();

    /**
     * Get contract balance to see what happened!
     */
    contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
    console.log("Contract balance", hre.ethers.utils.formatEther(contractBalance));

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