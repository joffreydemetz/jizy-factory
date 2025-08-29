import { Types } from 'jizy-utils';

function extend(...args) {
    let deep = false;
    let i = 0;
    let extended = {};

    if (typeof args[0] === 'boolean') {
        deep = args[0];
        i = 1;
    }

    const isObject = obj => obj && Object.prototype.toString.call(obj) === '[object Object]';

    const merge = (obj) => {
        for (const prop in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                if (deep && isObject(obj[prop])) {
                    extended[prop] = extend(true, extended[prop] || {}, obj[prop]);
                } else if (obj[prop] !== undefined) {
                    extended[prop] = obj[prop];
                }
            }
        }
    };

    for (; i < args.length; i++) {
        if (args[i]) merge(args[i]);
    }

    return extended;
}

function isWindow(obj) {
    return Types.isObject(obj) && obj == obj.window;
}

function isDocument(obj) {
    return Types.isObject(obj) && obj.nodeType == obj.DOCUMENT_NODE;
}

function isPlainObject(obj) {
    return Types.isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype;
}

function isEmptyObject(obj) {
    return Types.isObject(obj) && Object.keys(obj).length === 0;
}

function likeArray(obj) {
    const length = !!obj && 'length' in obj && obj.length;

    return !Types.isFunction(obj) && !isWindow(obj) && (
        Array.isArray(obj) || length === 0 || (Types.isNumber(length) && length > 0 && (length - 1) in obj)
    );
}

function trim(str, charlist) {
    if (!charlist) {
        return str.trim();
    }

    const whitespace = [
        ' ',
        '\n', '\r', '\t', '\f',
        '\x0b', '\xa0',
        '\u2000', '\u2001', '\u2002', '\u2003', '\u2004', '\u2005', '\u2006', '\u2007', '\u2008', '\u2009', '\u200a', '\u200b', '\u2028', '\u2029', '\u3000'
    ].join('');

    str += '';
    if (charlist) {
        whitespace = (charlist + '').replace(/([[\]().?/*{}+$^:])/g, '$1');
    }
    let i = 0, l = str.length;
    for (i = 0; i < l; i++) {
        if (whitespace.indexOf(str.charAt(i)) === -1) {
            str = str.substring(i);
            break;
        }
    }
    l = str.length;
    for (i = l - 1; i >= 0; i--) {
        if (whitespace.indexOf(str.charAt(i)) === -1) {
            str = str.substring(0, i + 1);
            break;
        }
    }
    return whitespace.indexOf(str.charAt(0)) === -1 ? str : '';
}

function array_unique(inputArr) {
    return [...new Set(inputArr)];
    /*
    function __array_search(needle, haystack) {
        for (const fkey in haystack) {
            if (haystack.hasOwnProperty(fkey)) {
                if ((haystack[fkey] + '') === (needle + '')) {
                    return fkey;
                }
            }
        }
        return false;
    }

    let val = '', tmp = {};
    for (const key in inputArr) {
        if (inputArr.hasOwnProperty(key)) {
            val = inputArr[key];
            if (false === __array_search(val, tmp)) {
                tmp[key] = val;
            }
        }
    }

    const output = [];
    for (const key in tmp) {
        output.push(tmp[key]);
    }
    return output;
    */
}

function number_format(number, decimals, dec_point, thousands_sep) {
    number = (number + '').replace(/[^0-9+\-Ee.]/g, '');

    const n = !isFinite(+number) ? 0 : +number
        , prec = !isFinite(+decimals) ? 0 : Math.abs(decimals)
        , dec = (typeof dec_point === 'undefined') ? ',' : dec_point
        , sep = (typeof thousands_sep === 'undefined') ? ' ' : thousands_sep
        , toFixedFix = function (n, prec) {
            const k = Math.pow(10, prec);
            return '' + (Math.round(n * k) / k).toFixed(prec);
        };

    let s = '';

    // Fix for IE parseFloat(0.55).toFixed(0) = 0;
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');

    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }

    if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
    }

    return s.join(dec);
}

function sprintf() {
    var regex = /%%|%(\d+\$)?([\-+'#0 ]*)(\*\d+\$|\*|\d+)?(?:\.(\*\d+\$|\*|\d+))?([scboxXuideEfFgG])/g;
    var a = arguments;
    var i = 0;
    var format = a[i++];

    var _pad = function (str, len, chr, leftJustify) {
        if (!chr) {
            chr = ' ';
        }
        var padding = (str.length >= len) ? '' : new Array(1 + len - str.length >>> 0).join(chr);
        return leftJustify ? str + padding : padding + str;
    }

    var justify = function (value, prefix, leftJustify, minWidth, zeroPad, customPadChar) {
        var diff = minWidth - value.length;
        if (diff > 0) {
            if (leftJustify || !zeroPad) {
                value = _pad(value, minWidth, customPadChar, leftJustify);
            } else {
                value = [
                    value.slice(0, prefix.length),
                    _pad('', diff, '0', true),
                    value.slice(prefix.length)
                ].join('');
            }
        }
        return value;
    };

    var _formatBaseX = function (value, base, prefix, leftJustify, minWidth, precision, zeroPad) {
        // Note: casts negative numbers to positive ones
        var number = value >>> 0;
        prefix = (prefix && number && {
            '2': '0b',
            '8': '0',
            '16': '0x'
        }[base]) || '';
        value = prefix + _pad(number.toString(base), precision || 0, '0', false);
        return justify(value, prefix, leftJustify, minWidth, zeroPad);
    };

    var _formatString = function (value, leftJustify, minWidth, precision, zeroPad, customPadChar) {
        if (precision !== null && precision !== undefined) {
            value = value.slice(0, precision);
        }
        return justify(value, '', leftJustify, minWidth, zeroPad, customPadChar);
    };

    var doFormat = function (substring, valueIndex, flags, minWidth, precision, type) {
        var number, prefix, method, textTransform, value;

        if (substring === '%%') {
            return '%';
        }

        // parse flags
        var leftJustify = false;
        var positivePrefix = '';
        var zeroPad = false;
        var prefixBaseX = false;
        var customPadChar = ' ';

        for (var j = 0, flagsl = flags.length; j < flagsl; j++) {
            switch (flags.charAt(j)) {
                case ' ':
                    positivePrefix = ' ';
                    break;
                case '+':
                    positivePrefix = '+';
                    break;
                case '-':
                    leftJustify = true;
                    break;
                case "'":
                    customPadChar = flags.charAt(j + 1);
                    break;
                case '0':
                    zeroPad = true;
                    customPadChar = '0';
                    break;
                case '#':
                    prefixBaseX = true;
                    break;
            }
        }

        // parameters may be null, undefined, empty-string or real valued
        // we want to ignore null, undefined and empty-string values
        if (!minWidth) {
            minWidth = 0;
        } else if (minWidth === '*') {
            minWidth = +a[i++];
        } else if (minWidth.charAt(0) === '*') {
            minWidth = +a[minWidth.slice(1, -1)];
        } else {
            minWidth = +minWidth;
        }

        // Note: undocumented perl feature:
        if (minWidth < 0) {
            minWidth = -minWidth;
            leftJustify = true;
        }

        if (!isFinite(minWidth)) {
            throw new Error('sprintf: (minimum-)width must be finite');
        }

        if (!precision) {
            precision = 'fFeE'.indexOf(type) > -1 ? 6 : (type === 'd') ? 0 : undefined;
        } else if (precision === '*') {
            precision = +a[i++];
        } else if (precision.charAt(0) === '*') {
            precision = +a[precision.slice(1, -1)];
        } else {
            precision = +precision;
        }

        // grab value using valueIndex if required?
        value = valueIndex ? a[valueIndex.slice(0, -1)] : a[i++];

        switch (type) {
            case 's':
                return _formatString(value + '', leftJustify, minWidth, precision, zeroPad, customPadChar);
            case 'c':
                return _formatString(String.fromCharCode(+value), leftJustify, minWidth, precision, zeroPad);
            case 'b':
                return _formatBaseX(value, 2, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
            case 'o':
                return _formatBaseX(value, 8, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
            case 'x':
                return _formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
            case 'X':
                return _formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad).toUpperCase();
            case 'u':
                return _formatBaseX(value, 10, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
            case 'i':
            case 'd':
                number = +value || 0;
                // Plain Math.round doesn't just truncate
                number = Math.round(number - number % 1);
                prefix = number < 0 ? '-' : positivePrefix;
                value = prefix + _pad(String(Math.abs(number)), precision, '0', false);
                return justify(value, prefix, leftJustify, minWidth, zeroPad);
            case 'e':
            case 'E':
            case 'f': // @todo: Should handle locales (as per setlocale)
            case 'F':
            case 'g':
            case 'G':
                number = +value;
                prefix = number < 0 ? '-' : positivePrefix;
                method = ['toExponential', 'toFixed', 'toPrecision']['efg'.indexOf(type.toLowerCase())];
                textTransform = ['toString', 'toUpperCase']['eEfFgG'.indexOf(type) % 2];
                value = prefix + Math.abs(number)[method](precision);
                return justify(value, prefix, leftJustify, minWidth, zeroPad)[textTransform]();
            default:
                return substring;
        }
    }

    return format.replace(regex, doFormat);
}

function preg_replace(str, rep, by) {
    var reg = new RegExp(rep, "g");
    return str.replace(reg, by);
}

function isTouchable() {
    return 'ontouchstart' in document.documentElement;
}

function toQueryString(vars) {
    const params = [];
    for (let key in vars) {
        if (Array.isArray(vars[key])) {
            for (let val of vars[key]) {
                params.push(`${encodeURIComponent(key)}[]=${encodeURIComponent(val)}`);
            }
        } else {
            params.push(`${encodeURIComponent(key)}=${encodeURIComponent(vars[key])}`);
        }
    }
    return params.length ? '?' + params.join('&') : '';
}

function strip_tags(input, allowed) {
    // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
    allowed = (((allowed || "") + "").toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join('');
    var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
    return input.replace(tags, function ($0, $1) {
        return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
    });
}

const jUtils = {
    isString: Types.isString,
    isFunction: Types.isFunction,
    isArray: Types.isArray,
    isObject: Types.isObject,
    isNumeric: Types.isNumber,
    sprintf: sprintf,
    toQueryString: toQueryString,
    extend: extend,
    trim: trim,
    array_unique: array_unique,
    preg_replace: preg_replace,
    number_format: number_format,
    isWindow: isWindow,
    isDocument: isDocument,
    isPlainObject: isPlainObject,
    isEmptyObject: isEmptyObject,
    isTouchable: isTouchable,
    likeArray: likeArray,
    strip_tags: strip_tags
};

export default jUtils;