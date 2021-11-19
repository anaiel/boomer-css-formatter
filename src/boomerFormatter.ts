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
    this.formattedText = this.formattedText.replace(/\n +/g, "\n");
    return this;
  }

  _splitDeclarations(): [string, string] {
    let i = 0;
    while (true) {
      const current = this.formattedText.slice(i);
      const afterCurrent = this.formattedText.slice(i + 1);
      if (
        current.startsWith("@import") ||
        current.startsWith("$") ||
        current.startsWith("//") ||
        current.startsWith("/*")
      ) {
        while (this.formattedText.charAt(i) !== "\n") i++;
      } else if (
        afterCurrent.startsWith("@import") ||
        afterCurrent.startsWith("$") ||
        afterCurrent.startsWith("//") ||
        afterCurrent.startsWith("/*")
      ) {
        i++;
      } else {
        break;
      }
    }
    return [this.formattedText.slice(0, i), this.formattedText.slice(i)];
  }

  replaceEOL(): Formatter {
    this.formattedText = this.formattedText.replace(/\r\n/g, "\n");
    return this;
  }

  removeEOL(): Formatter {
    this.formattedText = this.formattedText.replace(/(?<!\/\/[^\n]*?)\n/g, "");
    return this._removeMultipleWhitespace();
  }

  insertEOLBeforeDeclaration(): Formatter {
    let updated = this.formattedText.replace(
      /(\{|\}|;) *([^;\}\{\n]+?) *\{/g,
      "$1\n$2 {"
    );
    while (updated !== this.formattedText) {
      this.formattedText = updated;
      updated = this.formattedText.replace(
        /(\{|\}|;) *([^;\}\{\n]+?) *\{/g,
        "$1\n$2 {"
      );
    }
    return this;
  }

  insertEOLAfterClosingBlock(): Formatter {
    this.formattedText = this.formattedText.replace(/\}(?!\n)/g, "}\n");
    this.formattedText = this.formattedText
      .split("\n")
      .map((line) => {
        if (line.endsWith("}") && !line.includes("{") && line.trim() !== "}")
          return line.replace("}", "\n}");
        return line;
      })
      .join("\n");
    return this._removeMultipleWhitespace()._removeStartOfLineWhitespace();
  }

  addNesting(): Formatter {
    const indent = "    ";
    let nesting = "";
    let nestedText = "";

    const [importBlock, declarations] = this._splitDeclarations();

    for (let i = 0; i < declarations.length; i++) {
      const prevChar = i >= 1 ? declarations.charAt(i - 1) : undefined;
      const char = declarations.charAt(i);
      const nextChar =
        i < declarations.length - 1 ? declarations.charAt(i + 1) : undefined;

      if (char !== "\n") {
        nestedText += char;
        continue;
      }

      let j = i - 1;
      while (j > 0 && declarations.charAt(j) !== "\n") j--;
      let prevLine = declarations.slice(j, i);

      if (prevChar && prevLine.includes("{") && !prevLine.endsWith("}"))
        nesting += indent;
      if (nextChar === "}") nesting = nesting.slice(0, -1 * indent.length);
      nestedText += char + nesting;
    }

    this.formattedText = importBlock + nestedText;
    return this;
  }

  addEOLInImports(): Formatter {
    const [imports, declarations] = this._splitDeclarations();
    const formattedImports = imports.replace(/;/g, ";\n");
    this.formattedText = formattedImports + declarations;
    return this;
  }

  handleCommentBlock(): Formatter {
    this.formattedText = this.formattedText
      .split("\n")
      .map((line) => {
        let i = 0;
        while (i < line.length && line.charAt(i) === " ") i++;
        const indent = line.slice(0, i);
        const content = line.slice(i);

        let updated = content.replace(
          /(\/\*.*?\*\/) */g,
          `\n${indent}$1\n${indent}`
        );
        if (updated.startsWith("\n")) updated = updated.slice(1);
        if (updated.endsWith("\n")) updated = updated.slice(0, -1);
        updated = updated.replace(/\n+/g, "\n");
        if (!updated.startsWith(indent)) updated = indent + updated;

        return updated;
      })
      .join("\n");
    return this;
  }

  resetEOL(): void {
    this.formattedText = this.formattedText.replace(/\n/g, this._eol);
  }
}

const boomerFormatter = (originalText: string, eol: string): string => {
  const formatter = new Formatter(originalText, eol);

  formatter
    .replaceEOL()
    .removeEOL()
    .insertEOLBeforeDeclaration()
    .insertEOLAfterClosingBlock()
    .addNesting()
    .addEOLInImports()
    .handleCommentBlock()
    .resetEOL();

  return formatter.formattedText;
};

export default boomerFormatter;
