class Formatter {
    _originalContent: string;
    _currentContent: string;

    constructor(content: string) {
      this._originalContent = content;
      this._currentContent = content;
    }

    get content() {
      return this._currentContent;
    }

    process(): string {
      this._currentContent = "Hello world";
      return this._currentContent;
    }
}

export default Formatter;