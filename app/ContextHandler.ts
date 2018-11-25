import allContexts, { Context } from './contexts/allContexts';

export default class ContextHandler {
  static contexts: Array<Context> = allContexts;

  /*
  currentProcess: string = '';

  changeProcess(name: string) {
    this.currentProcess = name;
  }

  getCurrentContext(): Context | undefined {
    for (const contextKey in ContextHandler.contexts) {
      const context = ContextHandler.contexts[contextKey];
      if (context.processName.test(this.currentProcess)) {
        return context;
      }
    }
    return undefined;
  } */

  static getContextOfProcess(process: string): Context | undefined {
    for (const contextKey in ContextHandler.contexts) {
      const context = ContextHandler.contexts[contextKey];
      if (context.processName.test(process)) {
        return context;
      }
    }
    return undefined;
  }
}
