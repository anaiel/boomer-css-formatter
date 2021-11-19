import { EndOfLine } from "vscode";

const eolDict = {
  [EndOfLine.LF]: "\n",
  [EndOfLine.CRLF]: "\r\n",
};

export const resolveEOL = (eol: EndOfLine): string => eolDict[eol];
