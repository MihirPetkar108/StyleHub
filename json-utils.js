(function (global) {
    function stringify(obj) {
        return JSON.stringify(obj, null, 2);
    }

    function parse(str) {
        try {
            return JSON.parse(str);
        } catch (e) {
            console.error("JSON.parse error:", e);
            return null;
        }
    }

    function _replaceInPlace(o, key, newValue) {
        if (Array.isArray(o)) {
            o.forEach(function (v) {
                if (typeof v === "object" && v !== null)
                    _replaceInPlace(v, key, newValue);
            });
            return;
        }

        if (typeof o === "object" && o !== null) {
            Object.keys(o).forEach(function (k) {
                if (k === key) {
                    o[k] = newValue;
                } else if (typeof o[k] === "object" && o[k] !== null) {
                    _replaceInPlace(o[k], key, newValue);
                }
            });
        }
    }

    function replaceValue(obj, key, newValue) {
        var clone = parse(stringify(obj));
        if (clone === null) return null;
        _replaceInPlace(clone, key, newValue);
        return clone;
    }

    function replaceInString(jsonString, key, newValue) {
        var obj = parse(jsonString);
        if (obj === null) return null;
        var replaced = replaceValue(obj, key, newValue);
        return stringify(replaced);
    }

    global.JSONUtils = {
        stringify: stringify,
        parse: parse,
        replaceValue: replaceValue,
        replaceInString: replaceInString,
    };

    if (typeof window !== "undefined") {
        window.addEventListener("DOMContentLoaded", function () {
            console.debug("JSONUtils loaded");
        });
    }
})(this);
