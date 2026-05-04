import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { jPackCli, jPackConfig } from 'jizy-packer';

const here = path.dirname(fileURLToPath(import.meta.url));

function getArg(name) {
    const i = process.argv.indexOf('--' + name);
    return i !== -1 ? process.argv[i + 1] : null;
}

const site = getArg('name');
const pluginsArg = getArg('plugins');

let cfgFile = path.resolve(here, '../config/jpack.js');
if (site) {
    const candidate = path.resolve(here, `../config/jpack.${site}.js`);
    if (fs.existsSync(candidate)) {
        cfgFile = candidate;
    }
}

const { default: jPackData } = await import(pathToFileURL(cfgFile).href);

const wrapped = function () {
    jPackData();
    if (pluginsArg) {
        const list = pluginsArg.split(',').map(s => s.trim()).filter(Boolean);
        jPackConfig.set('plugins', list);
    }
};

jPackCli(wrapped);
