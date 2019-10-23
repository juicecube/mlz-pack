export interface CommonConfig {}
export interface BaseConfig {
  [propName:string]:any;
}
export interface DeepCopyData {
  [propName:string]:any;
}

export type Env = 'dev' | 'prod';