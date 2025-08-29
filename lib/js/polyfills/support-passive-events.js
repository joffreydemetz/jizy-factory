var supportsPassiveEvents = false;
try {
    addEventListener("test.0", null, { get passive() { supportsPassiveEvents = true; } });
} catch (e) { }
// console.log('test.0: '+(supportsPassiveEvents?'Y':'N'));

