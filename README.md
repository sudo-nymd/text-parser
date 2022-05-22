# @SUDO-NYMD/TEXT-PARSER

A simple, yet flexible, library for making sense out of text.

# Getting Started

## Install the Package
```
npm i @sudo-nymd/text-parser
```

## Using the Library

```COMING SOON```

## Parser

```COMING SOON```

## Tokenizer

```COMING SOON```

## Plugins

### Keywords Plugin

```COMING SOON```

### Date Plugins

```COMING SOON```

---

# Grammer

## Document

## Lines


## Line

A single line of text.

    : Literals

## Literals

A collection of one or more ```Words```, ```Phrases```, ```Characters```, or ```WhiteSpace```.

    : (Word | Phrase | Character | Whitespace | Plugin) +

## Phrase

A collection of Words, Characters, or Whitespace encoded by a single ```PhraseCharacter```.

**Examples:**

* "The snow is falling"
* [Build Completed]
* {Start}
* 'Mission Success'

---
```Phrase```

    : PhraseOpen (PhraseCharacter) 1
    : (Word | Character | Whitespace) +
    : PhraseClose (PhraseCharacter) 1

### PhraseCharacter

A special character that signifies the start and end boundaries of a ```Phrase```.

    : Brackets {} /^{[^{]*}/
    : Braces [] /^\[[^\[]*\]/
    : SingleQuotes '' /^'[^']*'/
    : DoubleQuotes "" /^"[^"]*"/
    : Parenthesis *()*: /^\([^\(]*\)/

### PhraseOpen
    
One or more repeating characters that signify the start of a phrase.

    : ({ | [ | " | ')+

### PhraseList

One or more Words or WhiteSpace
    
    : (Word | WhiteSpace | Character)+

### PhraseClose

One or more repeating characters that signify the end of a phrase.

    - Should Match the character(s) in PhraseOpen.
    : (} | ] | " | ')+

## Word

Any single word.

    : [a-zA-Z0-9']+

## Whitespace

    : [^\S\r\n]+

## NewLine
    : [\r\n]+
