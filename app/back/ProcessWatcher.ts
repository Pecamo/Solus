'use strict';

const exec = require('child_process').exec;
const spawn = require('child_process').spawn;

const regexPattern = new RegExp(/(?:[\d\.]+\s+){6,7}((?:\s?\w+)+)/);

const out = process.stdout;

const getFocusProcess = (cb: Function) => {
  // OS X
  if (process.platform.toLowerCase().includes('darwin')) {
    const proc = exec('osascript osxproc.scpt');
    proc.stdout.on('data', (data: any) => {
      cb(data.trim());
    });

    proc.stderr.on('data', (data: any) => {
      console.log(`stderr: ${data}`);
    });

    proc.on('close', (code: any) => {
    });

    // Windows
  } else if (process.platform.toLowerCase().includes('win')) {
    const child = spawn('powershell.exe', ['-ExecutionPolicy', 'ByPass', '-File', 'windowsproc.ps1']);
    child.stdout.on('data', (data: any) => {
      const found = data.toString().match(regexPattern);
      if (found) {
        cb(found[1].trim());
      }
    });

    child.stderr.on('data', (data: any) => {
      console.log(`Powershell error : ${data}`);
    });

    child.on('exit', () => {
      console.log('Powershell script finished');
    });

    child.stdin.end();

    // Linux
  } else if (process.platform.toLowerCase().includes('linux')) {
    const proc = exec('ps -p $(xdotool getactivewindow getwindowpid) -o comm=');

    proc.stdout.on('data', (data: any) => {
      cb(data.trim());
    });

    proc.stderr.on('data', (data: any) => {
      console.log(`stderr: ${data}`);
    });

    proc.on('close', (code: any) => {
    });
  }
};

export default class ProcessWatcher {

  static titleOf = {
    'Google Chrome' : 'Google Chrome',
    'chrome' : 'Google Chrome',
    'chromium' : 'Google Chrome',
    'POWERPNT' : 'PowerPoint',
    'pycharm64' : 'PyCharm'
  };

  currentProcess: string = '';
  timeInterval: number = 1000;
  isWindows: boolean = (process.platform.toLowerCase().includes('win')) && !(process.platform.toLowerCase().includes('darwin'));
  onProcessChange: (arg: {title: string, process: string}) => void = () => null;
  running: boolean = false;

  constructor(onProcessChange: (arg: {title: string, process: string}) => void) {
    this.onProcessChange = onProcessChange;
  }

  run() {
    if (!this.running) {
      setTimeout(this.processWatcher, this.timeInterval);
    } else {
      console.log('Already running.');
    }
  }

  private processWatcher = () => {
    getFocusProcess((process: string) => {
      if (this.currentProcess !== process) {
        this.currentProcess = process;

        // const title = (typeof ProcessWatcher.titleOf[process] !== 'undefined') ? ProcessWatcher.titleOf[process] : process;
        const title = process;
        this.onProcessChange({ process, title });
        out.write(`\nCurrent process : ${process}`);

      }
      if (!this.isWindows) {
        setTimeout(this.processWatcher, this.timeInterval);
      }
    });
  }
}
