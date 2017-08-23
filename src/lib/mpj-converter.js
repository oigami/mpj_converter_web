import zlib from 'zlib';
import { TextDecoder } from 'text-encoding';

class Mpj {
    decompress(binary) {
        return new Promise((resolve, reject) => {
            const mpjHeader = "MMM SaveFile";
            const header = new TextDecoder("utf-16").decode(new Uint8Array(binary, 0, 32));
            if (mpjHeader !== header.slice(0, header.indexOf('\0'))) {
                reject("Unknown file format. Header of input data: " + header.slice(0, header.indexOf('\0')));
                return;
            }
            const content = new Uint8Array(binary, 36);
            zlib.inflate(content, (error, result) => {
                if (error !== null) {
                    reject(error);
                } else {
                    const val = new TextDecoder("utf-8").decode(result);
                    resolve(val);
                }
            });
        });
    }
}

export default new Mpj();