import zlib from 'zlib';

class Mpj {
    decompress(binary) {
        const buffer = new Buffer(binary, "ascii");
        return new Promise((resolve, reject) => {
            const mpjHeader = "MMM SaveFile";
            const header = new TextDecoder("utf-16").decode(buffer.slice(0, 32));
            if (mpjHeader !== header.slice(0, header.indexOf('\0'))) {
                reject("Unknown file format. Header of input data: " + header.slice(0, header.indexOf('\0')));
                return;
            }
            const content = buffer.slice(36);
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