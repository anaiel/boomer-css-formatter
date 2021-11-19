# boomer-css-formatter

A VSCode formatter extensions that turns your pretty prettier-style scss into good old-fashion boomer scss.

The best way to convince your boomer colleague to let you use prettier as a git hook on your repo: they can now use the extension to turn it back to boomer scss on their machine and you never have to know about it.

## Features

Boomers tend to like their css declarations to be all on the same row for some reason. Maybe because they're so experienced they've had time and money to invest in a super wide monitor.

![animation that shows how the code is formtted](https://i.imgur.com/DHAsBaM.gif)

In VSCode, open the Command Palette (Ctrl+Shift+P) and use the Format Document command on a `.scss` file to see the result.

## Known Issues

Because I've only made it for my boomer colleague, it only works in a specific set of conditions for now:
- Only works on `.scss` files
- Probably won't handle some of the fancier scss well. We don't use loops and shit cause we basic. But then maybe it might.

Also, something that can't be solved: `/* ... */` comments are added on a new line, and `// ...` comments are left at the end of the line they are on. This may lead to a weird positioning of the comment cause the extension can't determine if the comment caracterises the current line, what comes before or what comes after or is totally unrelated. Maybe it could do it a little bit better though.

## Release Notes

The extension is yet unreleased to the VSCode market.
To experiment with it, clone the repo, and open a new VSCode window that includes the extension by pressing F5.
