# A Simple Parser of Text

A simple, yet flexible library for extracting specialized tokens out of text. After maintaining a library of Regular Expressions for years, I was inspired to build a number of parsers after taking [Dmitry Soshnikov's](http://dmitrysoshnikov.com/) excellent Udemy course [Building a Parser from Scratch](https://www.udemy.com/course/parser-from-scratch/).

# Getting Started

## Install the Package
```
npm i @sudo-nymd/text-parser
```
## The Parser

The ```Parser``` is the root of the API. The Parser implemented a ```parse()``` method that will return parsed tokens with metadata about the text found.

The following code...

``` javascript
const { Parser } = require('@sudo-nymd/text-parser');

const text = `Sudo-Nymd's "text-parser"!`
const parsed = new Parser().parse(text);
console.log(parsed);
```
... produces the following output:

``` javascript
[
  { type: 'word', flags: 48, value: "Sudo-Nymd's" },
  { type: 'whitespace', flags: 0, value: ' ' },
  {
    type: 'phrase',
    flags: 3,
    startChar: { type: 'character', value: '"' },
    items: [
            {
                "type": "word",
                "flags": 32,
                "value": "text-parser"
            }
        ],
    value: 'text-parser',
    stopChar: { type: 'character', flags: 0, value: '"' }
  },
  { type: 'punctuation', flags: 0, value: '!' }
]
```

## The Tokenizer

```COMING SOON```

## Plugins

### Keywords Plugin

```COMING SOON```

### Date Plugins

```COMING SOON```

---

# Grammer

The grammer of the parser is simple, and is outlined below. 

## Line

A single line of text composed of one or more ```Literals```.

    : Literals

## Literals

A collection of one or more ```Word```, ```Phrase```, ```Character```, ```Punctuation```, ```WhiteSpace```, or ```Plugin```.

    : (Word | Phrase | Character | Puncuation | Whitespace | Plugin) +

**Examples:**
```
The quick, [brown fox] jumped over the "lazy dog", and the cow jumped over the {moon}!
```

The precending ```Literal``` consistes of
3 ```Phrases``` ([brown fox], "lazy dog", and {moon}),
3 ```Punctuation``` (2 commas and 1 exclamation point),
11 ```Words```, and
13 ```Whitespaces```.


## Phrase

A collection of ```Words```, ```Characters```, or ```Whitespace``` enclosed by a ```StartChar``` and a ```StopChar```.

    : StartChar
    : (Word | Character | Whitespace) +
    : EndChar

**Examples:**
```
"The snow is falling"
[Build Completed]
{Start}
'Mission Success'
```

### PhraseCharacter

### StartChar
    
One or more repeating characters that signify the start of a ```Phrase```. Includes double quote, single quote, open brace, and open bracket.

    : ( { | [ | " | ' )+

### EndChar

One or more repeating characters that signify the end of a ```Phrase```. Includes double quote, single quote, close brace, and close bracket.

    : ( } | ] | " | ' )+

## Word

Any single word.

    : ([\w]+(?:.['-]?[\w]+)*)

## Whitespace

Any whitespace 

    : [\s]+

## Character

Any character that is not alpha-numeric, whitespace, or a phrase start or stop character.

    : [^a-zA-Z0-9{}\\[\\]"']

