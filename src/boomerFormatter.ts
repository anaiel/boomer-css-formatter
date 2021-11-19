class Formatter {
  _originalText: string;
  _eol: string;
  formattedText: string;

  constructor(originalText: string, eol: string) {
    this._eol = eol;
    this._originalText = originalText;
    this.formattedText = this._originalText;
  }

  _removeMultipleWhitespace(): Formatter {
    this.formattedText = this.formattedText.replace(/ +/g, " ");
    return this;
  }

  _removeStartOfLineWhitespace(): Formatter {
    this.formattedText = this.formattedText.replace(/(\n|\r\n) +/g, "$1");
    return this;
  }

  _splitDeclarations(): [string, string] {
    let i = 0;
    while (true) {
      if (
        this.formattedText.slice(i).startsWith("@import") ||
        this.formattedText.slice(i).startsWith("$")
      ) {
        while (
          this.formattedText.charAt(i) !== "\n" &&
          (this.formattedText.charAt(i) !== "\r" ||
            this.formattedText.charAt(i + 1) !== "\n")
        )
          i++;
      } else {
        break;
      }
    }
    return [this.formattedText.slice(0, i), this.formattedText.slice(i)];
  }

  removeEOL(): Formatter {
    this.formattedText = this.formattedText
      .replace(/\r\n/g, "")
      .replace(/\n/g, "");
    return this._removeMultipleWhitespace();
  }

  insertEOLBeforeDeclaration(): Formatter {
    let updated = this.formattedText.replace(
      /(\{|\}|;) *([^;\}\{\n]+?) *\{/g,
      `$1${this._eol}$2 {`
    );
    while (updated !== this.formattedText) {
      this.formattedText = updated;
      updated = this.formattedText.replace(
        /(\{|\}|;) *([^;\}\{\n]+?) *\{/g,
        `$1${this._eol}$2 {`
      );
    }
    return this;
  }

  insertEOLAfterClosingBlock(): Formatter {
    this.formattedText = this.formattedText.replace(
      /\}(?![\n|\r\n])/g,
      "}" + this._eol
    );
    return this._removeMultipleWhitespace()._removeStartOfLineWhitespace();
  }

  addNesting(): Formatter {
    const indent = "    ";
    let nesting = "";
    let nestedText = "";

    const [importBlock, declarations] = this._splitDeclarations();

    for (let i = 0; i < declarations.length; i++) {
      const prevPrevChar = i >= 2 ? declarations.charAt(i - 2) : undefined;
      const prevChar = i >= 1 ? declarations.charAt(i - 1) : undefined;
      const char = declarations.charAt(i);
      const nextChar =
        i < declarations.length - 1 ? declarations.charAt(i + 1) : undefined;

      if (char !== "\n") {
        nestedText += char;
        continue;
      }

      if (
        prevChar &&
        prevChar !== "}" &&
        (prevChar !== "\r" || prevPrevChar !== "}")
      )
        nesting += indent;
      if (nextChar === "}") nesting = nesting.slice(0, -1 * indent.length);
      nestedText += char + nesting;
    }

    this.formattedText = importBlock + nestedText;
    return this;
  }

  addEOLInImports(): Formatter {
    const [imports, declarations] = this._splitDeclarations();
    const formattedImports = imports.replace(/;/g, ";" + this._eol);
    this.formattedText = formattedImports + declarations;
    return this;
  }
}

const boomerFormatter = (originalText: string, eol: string): string => {
  const formatter = new Formatter(originalText, eol);

  formatter
    .removeEOL()
    .insertEOLBeforeDeclaration()
    .insertEOLAfterClosingBlock()
    .addNesting()
    .addEOLInImports();

  return formatter.formattedText;
};

export default boomerFormatter;
