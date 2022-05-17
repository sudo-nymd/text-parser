# ts-lib-template

# Grammer

```

Line
    : Word+ | Phrase+

Phrase
    : PhraseOpen
    : WordList
    : PhraseClose

WordList
    : Word+

Word
    : [a-zA-Z0-9']+

PhraseOpen
    : ["'\[{]

PhraseClose
    : ["'\]}]

Whitespace
    : [^\S\r\n]+

NewLine
    : [\r\n]+

```
