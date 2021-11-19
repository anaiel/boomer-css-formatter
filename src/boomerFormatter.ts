class Formatter {
  _originalText: string;
  _eol: string;
  formattedText: string;

  constructor(originalText: string, eol: string) {
    this._eol = eol;
    this._originalText = originalText;
    this.formattedText = this._originalText;
  }

  removeWhitespace() {
    this.formattedText = this.formattedText
      .replace(/ /g, "")
      .replace(/\r\n/g, "")
      .replace(/\n/g, "");
    return this;
  }

  insertEOLBeforeDeclaration() {
    this.formattedText = this.formattedText.replace(
      /([;|\}])(?!\})([^;]+?)\{/g,
      `$1${this._eol}$2{`
    );
    return this;
  }

  insertEOLAfterClosingBlock() {
    this.formattedText = this.formattedText.replace(
      /\}(?![\n|\r\n])/g,
      "}" + this._eol
    );
    return this;
  }

  addNesting() {
    const indent = "    ";
    let nesting = "";
    let nestedText = "";

    for (let i = 0; i < this.formattedText.length; i++) {
      const prevPrevChar =
        i >= 2 ? this.formattedText.charAt(i - 2) : undefined;
      const prevChar = i >= 1 ? this.formattedText.charAt(i - 1) : undefined;
      const char = this.formattedText.charAt(i);
      const nextChar =
        i < this.formattedText.length - 1
          ? this.formattedText.charAt(i + 1)
          : undefined;

      if (char !== "\n") {
        nestedText += char;
        continue;
      }

      if (prevChar !== "}" && (prevChar !== "\r" || prevPrevChar !== "}"))
        nesting += indent;
      if (nextChar === "}") nesting = nesting.slice(0, -1 * indent.length);
      nestedText += char + nesting;
    }

    this.formattedText = nestedText;
    return this;
  }

  addSpacingBeforeBrace() {
    this.formattedText = this.formattedText
      .replace(/\{/g, " {")
      .replace(/(?<![\n|\r\n| ])\}/g, " }");
    return this;
  }

  addSpacingAfterBrace() {
    this.formattedText = this.formattedText
      .replace(/\{(?![\n|\r\n])/g, "{ ")
      .replace(/\}(?![\n|\r\n])/g, "} ");
    return this;
  }

  separateDeclarations() {
    this.formattedText = this.formattedText.replace(/;(?![\n|\r\n| ])/g, "; ");
    return this;
  }
}

const boomerFormatter = (originalText: string, eol: string): string => {
  const formatter = new Formatter(originalText, eol);

  formatter
    .removeWhitespace()
    .insertEOLBeforeDeclaration()
    .insertEOLAfterClosingBlock()
    .addNesting()
    .addSpacingBeforeBrace()
    .addSpacingAfterBrace()
    .separateDeclarations();

  return formatter.formattedText;
};

export default boomerFormatter;
