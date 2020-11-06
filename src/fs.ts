import * as path from 'path';
import * as fs from 'fs';
import { DEMO_JSON_PATH, DEMO_TTF_PATH } from './const';

/**
 * 文件路径生成
 * @param paths 文件名
 */
export function combinePath (...paths: string[]): string {
  if (!path) return '';
  return path.resolve(...paths);
}

/**
 * 读取文件
 * @param fliename 
 */
export function readFileAsync (filename: string): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.open(filename, 'r', (err, data) => {
      if (err) {
        if (err.code === 'ENOENT') {
          console.log(`文件[${filename}]不存在`);

          return resolve('');
        }
        return reject(err);
      }
      fs.readFile(filename, (e, buffer) => {
        if (e) return reject(e);

        resolve(buffer.toString());
      });
    });
  });
}

/**
 * 写入文件
 * @param filename 文件路径
 * @param data 文件内容
 */
export function writeFileAsync (filename: string, data: any): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    fs.open(filename, 'wx', (err, fd) => {
      if (err) {
        if (err.code === 'EEXIST') {

        } else {
          reject(err);
        }
      }
      fs.writeFile(filename, data, (e) => e ? reject(e) : resolve());
    });
  });
}

/**
 * 文件是否存在
 * @param folder 
 */
export function existsFileAsync (file: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    fs.access(file, fs.constants.F_OK | fs.constants.W_OK, (error) => {
      resolve(!error);
    });
  });
}

/**
 * 同步创建文件夹
 * @param folder 要创建的文件夹名
 */
export function createFolderAsync (folder: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!folder) return Error('参数[folder]不能为空!');

    const fPath = path.resolve(folder);
    fs.access(fPath, fs.constants.F_OK | fs.constants.W_OK, (error) => {
      // 文件存在且可以读写
      if (!error) return resolve();
      // 文件不可读写
      if (error.code !== 'ENOENT') return reject(error);

      fs.mkdir(fPath, async (err) => {
        /// 创建完毕
        if (!err) return resolve();

        /// 文件不存在？
        if (err.code === 'ENOENT') {

          /// 可能父文件夹不存在
          const parent = path.dirname(fPath);

          /// 创建父文件夹
          await createFolderAsync(parent);

          /// 重新执行创建
          await createFolderAsync(folder);
          return resolve();
        }

        reject(err);
      });
    });

  });
}

export async function createFoldersAsync (paths: string, base: string = '') {
  if (!paths) return;
  const target = path.join(paths.replace(base, ''));
  const folders = target.split('/');
  let output: string = base;
  for (const folder of folders) {
    output = path.resolve(output, folder);

    if (!fs.existsSync(output)) fs.mkdirSync(output);
  }
}

export function copyDemoFiles (output: string): Promise<void> {
  return new Promise((resolve, reject) => {

    const demoPath = path.resolve(__dirname, 'template', 'demo');
    const ttfPath = path.resolve(demoPath, DEMO_TTF_PATH);
    const jsonPath = path.resolve(demoPath, DEMO_JSON_PATH);
    const ttfTar = path.join(output, DEMO_TTF_PATH);
    const jsonTar = path.join(output, DEMO_JSON_PATH);

    /// 如果已存在，先删除
    if (fs.existsSync(ttfTar)) {
      fs.unlinkSync(ttfTar);
    }

    /// 如果已存在，先删除
    if (fs.existsSync(jsonTar)) {
      fs.unlinkSync(jsonTar);
    }

    /// 复制文件
    fs.createReadStream(ttfPath).pipe(fs.createWriteStream(ttfTar).on('close', () => {
      fs.createReadStream(jsonPath).pipe(fs.createWriteStream(jsonTar).on('close', () => {
        resolve();
      }));
    }));

  });
}



export default {
  combinePath,
  readFileAsync,
  writeFileAsync,
  existsFileAsync,
  createFolderAsync,
  createFoldersAsync,
};
