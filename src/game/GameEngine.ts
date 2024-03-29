import * as THREE from "three";
import { GameRenderer } from "./scenes/GameRenderer";
import * as datGui from "dat.gui";
import { Settings } from "~/game/data/Settings";
import { InputMng } from "./utils/inputs/InputMng";
import { DeviceInfo } from "./utils/DeviceInfo";
import { GalaxyScene } from "./scenes/GalaxyScene";
import { MyBasicClass } from "./basics/MyBasicClass";
import { ThreeLoader } from "./utils/threejs/ThreeLoader";
import { BattleScene, BattleSceneEvent } from "./scenes/BattleScene";
import { GameCompleteData, PackTitle, StartGameData } from "./battle/Types";
import { GameEvent, GameEventDispatcher } from "./events/GameEvents";
import { getWalletAddress } from "~/blockchain/functions/auth";
import { FrontEvents } from "./events/FrontEvents";
import { OpenBox, getUserBoxesToOpen, getUserWinContractBalance } from "~/blockchain/boxes";
import { useWallet } from "@/services";

export class GameEngine extends MyBasicClass {
    private _renderer: GameRenderer;
    private _galaxyScene: GalaxyScene;
    private _battleScene: BattleScene;
    private clock: THREE.Clock;
    private stats: Stats;

    constructor() {
        super('GameEngine');
        this.clock = new THREE.Clock();
    }

    private initRender() {
        this._renderer = new GameRenderer();
    }

    private initInputs() {
        InputMng.getInstance({
            inputDomElement: Settings.domCanvasParent,
            desktop: DeviceInfo.getInstance().desktop,
            isRightClickProcessing: false,
            clickDistDesktop: 10,
            clickDistMobile: 40
        });
    }

    private initStats() {
        this.stats = new Stats();
        this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild(this.stats.dom);
    }

    private initDebugGui() {

        const BLOCKCHAIN_DEBUG_GUI = {
            boxId: '0',
            claimReward: async () => {
                
            },
            openBox: async () => {
                let ws = useWallet();
                if (!ws.connected) {
                    alert('Wallet Not Connected!');
                    return;
                }
                const boxId = Number(BLOCKCHAIN_DEBUG_GUI.boxId);
                alert(`Trying to open Box ${boxId}`);
                let openResult = ws.provider.openBox(boxId);
                console.log(`openResult:`, openResult);
            },
            getBoxList: async () => {
                const wallet = getWalletAddress();
                getUserBoxesToOpen(wallet).then((aList: number[]) => {
                    let list = aList.map(val => Number(val));
                    this.logDebug(`Box ids to open:`);
                    if (Settings.isDebugMode) console.log(list);
                    if (list.length > 0) {
                        let ids: string = '';
                        for (let i = 0; i < list.length; i++) {
                            ids += String(`${list[i]}, `);
                        }
                        alert(`You have ${list.length} boxes for open.
                        ids: ${ids}`);
                        // GameEventDispatcher.showBoxOpenScreen({ list });
                    }
                    else {
                        alert(`No box found for this user...`);
                    }
                });
            }
        }

        Settings.datGui = new datGui.GUI();
        Settings.datGui.close();

        let gui = Settings.datGui;
        let f = gui.addFolder('Blockchain');
    
        f.add(BLOCKCHAIN_DEBUG_GUI, 'claimReward');

        f.add(BLOCKCHAIN_DEBUG_GUI, 'boxId').onChange((aValue: string) => {
            this.logDebug(`boxId: ${BLOCKCHAIN_DEBUG_GUI.boxId}`);
        }).name(`Box id`);

        f.add(BLOCKCHAIN_DEBUG_GUI, 'openBox');
        f.add(BLOCKCHAIN_DEBUG_GUI, 'getBoxList');

    }

    private initSkybox() {
        let loader = ThreeLoader.getInstance();
        this._renderer.scene.background = loader.getCubeTexture('skybox');
    }

    private initGalaxyScene() {
        // SCENES
        this._galaxyScene = new GalaxyScene({
            scene: this._renderer.scene,
            camera: this._renderer.camera
        });
        this._galaxyScene.initGalaxy();
    }

    private initBattleScene() {
        this._battleScene = new BattleScene({
            scene: this._renderer.scene,
            camera: this._renderer.camera
        });
        this._battleScene.hide();
        this._battleScene.on(BattleSceneEvent.onGameStart, this.onBattleGameStart, this);
        this._battleScene.on(BattleSceneEvent.onGameComplete, this.onBattleComplete, this);
        this._battleScene.on(BattleSceneEvent.onDisconnect, this.onBattleDisconnect, this);
        this._battleScene.on(BattleSceneEvent.onCloseBattle, () => {
            this.switchSceneToGalaxy();
        }, this);
    }

    private onBattleGameStart(aData: StartGameData) {
        this.logDebug(`onBattleEnterGame...`);

        GameEventDispatcher.battlePrerollShow({
            timer: aData.timer,
            playerWallet: aData.playerWallet,
            enemyWallet: aData.enemyWallet
        });
        
        setTimeout(() => {
            this._galaxyScene.hide();
            this._battleScene.show();
        }, 1000);

    }

    private onBattleComplete(aData: GameCompleteData) {
        this.logDebug(`onBattleComplete...`);
        GameEventDispatcher.battleComplete(aData);
    }

    private onBattleDisconnect() {
        this.logDebug(`onBattleDisconnect...`);
        alert(`Disconnect...`);
        GameEventDispatcher.dispatchEvent(GameEvent.GALAXY_MODE);
        this.switchSceneToGalaxy();
    }

    private switchSceneToGalaxy() {
        GameEventDispatcher.dispatchEvent(GameEvent.GALAXY_MODE);
        this._battleScene.hide();
        this._battleScene.clear();
        this._galaxyScene.show();
    }

    private update(dt: number) {
        this._galaxyScene?.update(dt);
        this._battleScene?.update(dt);
    }

    private render() {
        this._renderer?.render();
    }

    private animate() {
        let dtSec = this.clock.getDelta();

        if (Settings.isDebugMode) this.stats.begin();
        this.update(dtSec);
        this.render();
        if (Settings.isDebugMode) this.stats.end();

        requestAnimationFrame(() => this.animate());
    }

    initGame() {
        this.initRender();
        this.initInputs();
        if (Settings.isDebugMode) {
            this.initStats();
            this.initDebugGui();
        }
        this.initSkybox();
        this.initGalaxyScene();
        this.initBattleScene();
        this.animate();
    }


}