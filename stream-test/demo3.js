const Readable = require('stream').Readable;

class ToReadable extends Readable {
    constructor(iterator) {
        super();
        this.iterator = iterator;
    }

    _read() {
        const res = this.iterator.next();
        if (res.done) {
            return this.push(null);
        }
        setTimeout(() => {
            this.push(res.value + '\n');
        }, 0);
    }
}

const gen = function*(a) {
    let count = 5,
        res = a;

    while (count--) {
        res = res * res;
        yield res;
    }
};

const readable = new ToReadable(gen(2));

readable.on('data', data => process.stdout.write(data));

readable.on('end', () => process.stdout.write('readable stream ended~'));