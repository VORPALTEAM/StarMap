import Web3 from 'web3';
import * as ABIs from "./config/ABI";
import * as contracts from "./config/contracts"
import { env, networkParams } from '../config';
import { BoxData, WinData } from '../types';

const web3 = new Web3(networkParams.rpcUrl)
const envWeb3 = new Web3(env)

const tokenContracts = {
    VRP: new web3.eth.Contract(ABIs.ResourceToken, contracts.VRPReward),
    Spore: new web3.eth.Contract(ABIs.ResourceToken, contracts.SPORE),
    Spice: new web3.eth.Contract(ABIs.ResourceToken, contracts.SPICE),
    Metal: new web3.eth.Contract(ABIs.ResourceToken, contracts.METAL),
    Biomass: new web3.eth.Contract(ABIs.ResourceToken, contracts.BIOMASS),
    Carbon: new web3.eth.Contract(ABIs.ResourceToken, contracts.CARBON),
}

const nftContracts = {
    BoxNFT: new web3.eth.Contract(ABIs.BoxNFT, contracts.BoxNFT),
    LaserNFT: new web3.eth.Contract(ABIs.LaserNFT, contracts.LaserNFT),
}

const rewardContract = new web3.eth.Contract(ABIs.RewardSenderWithChoose, contracts.RewardSender);

export async function getNextWinId () {
    return await rewardContract.methods.getGameCount().call()
}

export async function getWinData (_winId: number): Promise<WinData> {
    const winData: WinData =  await rewardContract.methods.getVictoryData(_winId).call()
    return winData
}

export async function getLaserLevel (_laserId: number) {
    const laserLevel: number = await nftContracts.LaserNFT.methods.GetTokenLevel(_laserId).call()
    return laserLevel;
}

export async function getUserLaserList (_user: string) {
    const laserList: number[] = await nftContracts.LaserNFT.methods.getUserCreationHistory(_user).call();
    return laserList;
}

export async function getUserAvailableLaserLevels (_user: string) {
    const list: number[] = [];
    const laserNFTs = await getUserLaserList (_user);
    for (let j = 0; j < laserNFTs.length; j++) {
       const laserLevel = await getLaserLevel(Number(laserNFTs[j]));
       if (list.indexOf(laserLevel) === -1) {
        list.push(laserLevel);
       }
    }
    return list
}

export async function getUserBoxes (_user: string) {
    const boxList: number[] = await nftContracts.BoxNFT.methods.getUserCreationHistory(_user).call();
    return boxList;
}

export async function getBoxData (_boxId: number) {
    const boxData: BoxData = await nftContracts.BoxNFT.methods.getBoxInfo(_boxId).call();
    return boxData;
}

export async function getUserBoxesToOpen (_user: string) {
    const list: number[] = [];
    const allBoxes = await getUserBoxes (_user);
    for (let j = 0; j < allBoxes.length; j++) {
        const dt = await getBoxData (allBoxes[j]);
        if (!dt.isPaid) list.push(allBoxes[j]);
    }
    return list;
}

export async function getUserWinContractBalance (_user: string) {
    const balance = await rewardContract.methods.balanceOf(_user).call();
	return Number(balance);
}

export async function OpenBox (address: string, _boxId: number) {
    return new Promise(async (resolve, reject) => {
        const contract  = new envWeb3.eth.Contract(ABIs.BoxNFT, contracts.BoxNFT);

        try{
            const gasPrice = await envWeb3.eth.getGasPrice();
            await contract.methods.openBox(_boxId).send({
                from: address,
                gasPrice: gasPrice
            })
            resolve(true)
        } catch (e) {
            reject("Failed to open: " + e.message)
        }
    })
}

export function GetBoxPrizeType (prizeAddress: string) {
    if (prizeAddress = contracts.LaserNFT) {
        return "laser"
    }
    for (let key in contracts) {
        if (contracts[key] === prizeAddress) {
            return key;
        }
    }
}
