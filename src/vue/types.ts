import { ComponentPublicInstance } from "vue";

export type GuiElement =
  | "interface"
  | "overlay"
  | "preloader"
  | "starPanel"
  | "startScreen"
  | "tooltip";

export type GuiButton =
  | "run"
  | "agreement"
  | "settings"
  | "starPanelHide"
  | "starPanelPlay"
  | "tooltipHide"
  | "tooltipDiveIn";

export type ClientEvent =
  | "GAME_LOADING"
  | "GAME_LOADED"
  | "GAME_CREATED"
  | "GAME_FULLSCREEN"
  | "GAME_CREATED"
  | "SHOW_STAR_PREVIEW"
  | "HIDE_STAR_PREVIEW"
  | "SHOW_STAR_GUI";

export type RaceType =
  | "Robots"
  | "Humans"
  | "Simbionts"
  | "Lizards"
  | "Insects";

export type ClientData = {
  starId: number;
  eventName: ClientEvent;
  name: string;
  description: string;
  level: number;
  race: RaceType;
  pos2d: { x: number; y: number };
  percent: number;
  v: boolean;
};

export type GuiEvent =
  | "overlayClick"
  | "agreement"
  | "setMusicVolume"
  | "setSfxVolume"
  | "toggleFullscreen"
  | "buttonHover"
  | "buttonClick"
  | "run";

export type GuiEventEmitterListener = (data?: any) => void;

export interface GuiEventEmitter {
  on(event: GuiEvent, callback: GuiEventEmitterListener): void;
  once(event: GuiEvent, callback: GuiEventEmitterListener): void;
  off(event: GuiEvent, callback: GuiEventEmitterListener): void;
  emit(event: GuiEvent, data?: any): void;
}

export interface GuiInterface extends ComponentPublicInstance, GuiEventEmitter {
  showTooltip(data: ClientData & { textAutofit: boolean }): void;
  hideTooltip(): void;
  showStarPanel(data: ClientData): void;
  hideStarPanel(): void;
  showPreloader(): void;
  hidePreloader(): void;
  showStartScreen(): void;
  hideStartScreen(): void;
  showInterface(): void;
  hideInterface(): void;
}