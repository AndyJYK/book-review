import type { config as base } from './envs/default';
import type { config as dev } from './envs/dev';
// import type { config as production } from './envs/production';

export type Objectype = Record<string, unknown>;
export type Default = typeof base;
export type Developement = typeof dev;
// export type Production = typeof production;
export type Config = Default & Developement; // & Production;