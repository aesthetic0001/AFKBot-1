import TSServer from '../server/express.js';

export default class TSBot {
  public server: () => void = new TSServer().init
}
