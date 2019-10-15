import { BaseConfig, Env } from './types';
import { start } from './webpack'

export class Builder {
  static run(env:Env) {
    console.log(env);
    start(env);
  }
}