import { ParsedFlags, PhraseToken } from "../src/parser";
import { Token, TokenTypes, TokenSpecs } from "../src/tokenizer";

const generatePhraseToken = (open: string , value: string, close: string): PhraseToken => {
    let token: PhraseToken = {
        type: 'single-quoted-phrase',
        open: { type: 'character', value: open },
        value: value,
        close: { type: 'character', value: close }   
    }

    // Determine the flags
    switch (open) {
        case `"`: { token.type = 'double-quoted-phrase'; token.flags = ParsedFlags.DoubleQuote; }
        case `'`: { token. token.flags = ParsedFlags.SingleQuote; }
        case `{`: { token.flags = ParsedFlags.Bracket; }
        case `[`: { token.flags = ParsedFlags.Brace; }
        case `(`: { token.flags = ParsedFlags.Parenthesis; }
    }

    return token as PhraseToken;
}

const generateToken = (type: TokenTypes, value: string) => {
    const token = {
            value: value,
            type: type
        }
    
        return token;
}

const generateWhitespaceToken = (count: number = 1): Token => {
    return  {
        type: 'whitespace',
        value: "".padEnd(count, ' ')
    }
}

const Tests = [
    {
        phrase: [
            generateToken('word', 'The'),
            generateWhitespaceToken(),
            generatePhraseToken('{', 'quick', '}'),
            generateToken('comma', ','),
            generateWhitespaceToken(),
            generateToken('word', 'brown'),
            generateWhitespaceToken(),
            generateToken('word', 'fox'),
            generateWhitespaceToken(),
            generateToken('word', 'jumped'),
            generateWhitespaceToken(),
            generateToken('word', 'over'),
            generateWhitespaceToken(),
            generateToken('word', 'the'),
            generateWhitespaceToken(),
            generateToken('word', 'lazy'),
            generateWhitespaceToken(),
            generateToken('word', 'dog'),
            generateToken('comma', ','),
            generateWhitespaceToken(),
            generateToken('word', 'and'),
            generateWhitespaceToken(),
            generateToken('word', 'the'),
            generateWhitespaceToken(),
            generateToken('word', 'cow'),
            generateWhitespaceToken(),
            generatePhraseToken('"', 'flew over the', '"'),
            generateWhitespaceToken(),
            generatePhraseToken('[', 'moon', ']'),
            generateToken('exclamation-point', '!')
        ]
    }
];

export const TestDefinition = {
    tests: Tests
}

export const generateTestPhrase = (sample: string) => {
    const phrase = []
    sample.split(' ').forEach((item) =>{
        phrase.push(`generateToken('word', '${item}')`);
        phrase.push('generateWhitespace()')
    });
    console.log(phrase.join(`,\n`));
}

/*
text: `
    The {quick}, brown fox "jumped over" the 'lazy dog', and the cow 
    [jumped] over the moon!
    `

    */