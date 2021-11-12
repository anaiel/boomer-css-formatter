"use strict";
exports.__esModule = true;
var Formatter = /** @class */ (function () {
    function Formatter(content) {
        this._originalContent = content;
        this._currentContent = content;
    }
    Object.defineProperty(Formatter.prototype, "content", {
        get: function () {
            return this._currentContent;
        },
        enumerable: false,
        configurable: true
    });
    Formatter.prototype.process = function () {
        this._currentContent = "Hello world";
        return this._currentContent;
    };
    return Formatter;
}());
exports["default"] = Formatter;
