export interface Source {
  displayName: string;
}

export interface Context {
  processName: RegExp;
  displayName: string;
  Sources: Array<Source>;
}



export default class ContextHandler {
  static processNameToDisplay: {[process: string]: string} = {
    'electron': 'Electron',

  }


}
