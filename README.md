# ts-lib-template

# Grammer

```

Line
    - A single line of text
    : LineItems

LineItems
    -- Collection of Words, Phrases, Characters, or WhiteSpace
    : (Word | Phrase | Character | WhiteSpace)+

Phrase
    - One or more Word or WhiteSpace, enclosed by {} | [] | "" | ''
    : PhraseOpen
    : PhraseList
    : PhraseClose

PhraseOpen
    - One or more repeating characters that signify the start of a phrase.
    : ({ | [ | " | ')+

PhraseList
    - One or more Words or WhiteSpace
    : (Word | WhiteSpace)+

PhraseClose
    - One or more repeating characters that signify the end of a phrase.
    - Should Match the character(s) in PhraseOpen.
    : (} | ] | " | ')+

Word
    - Any single word.
    : [a-zA-Z0-9']+


Whitespace
    : [^\S\r\n]+

NewLine
    : [\r\n]+

```
