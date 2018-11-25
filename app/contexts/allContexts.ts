import { Source } from '../types';
import { StackExchangeSite, StackExchangeSource } from '../sources/stackoverflow';

export interface Context {
  processName: RegExp;
  displayName: string;
  sources: Array<Source>;
}

/*
const IDEContext = {
  processName: //
}*/

const StackOverflow = new StackExchangeSource(StackExchangeSite.STACKOVERFLOW);
const Arqade = new StackExchangeSource(StackExchangeSite.ARQADE);
const Blender = new StackExchangeSource(StackExchangeSite.BLENDER);
const Photography = new StackExchangeSource(StackExchangeSite.PHOTOGRAPHY);
const SuperUser = new StackExchangeSource(StackExchangeSite.SUPERUSER);
const Tex = new StackExchangeSource(StackExchangeSite.TEX);

const VSCodeContext = {
  processName: /^(Code|CodeSetup|VSCodeUserSetup)$/,
  displayName: 'VSCode',
  sources: [StackOverflow, Tex]
};

const PDNContext = {
  processName: /^(PaintDotNet)$/,
  displayName: 'Paint.NET',
  sources: [Photography]
};

const LOLContext = {
  processName: /^(LeagueClient|LeagueClientUx)$/,
  displayName: 'League of Legends',
  sources: [Arqade]
};

const TerminalContext = {
  processName: /^(terminator|powershell)$/,
  displayName: 'Terminal',
  sources: [SuperUser, StackOverflow]
};

const UnknownContext = {
  processName: /^.+$/,
  displayName: 'Unknown',
  sources: [StackOverflow, Arqade, Blender, Photography, SuperUser, Tex]
};

const contexts: Array<Context> = [
  VSCodeContext,
  PDNContext,
  LOLContext,
  TerminalContext,
  UnknownContext
];

export default contexts;
