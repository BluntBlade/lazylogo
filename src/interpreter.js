class Token {
    static NO_MORE = "NO_MORE";
    static NOT_FOUND = "NOT_FOUND";
    static END_OF_LINE = "END_OF_LINE";
    static PROCEDURE = "PROCEDURE";
    static VARIABLE = "VARIABLE";
    static WORD = "WORD";
    static NUMBER = "NUMBER";
    static LIST_OPENING = "LIST_OPENING";
    static LIST_CLOSING = "LIST_CLOSING";
    static ARRAY_OPENING = "ARRAY_OPENING";
    static ARRAY_CLOSING = "ARRAY_CLOSING";
    static GROUP_OPENING = "GROUP_OPENING";
    static GROUP_CLOSING = "GROUP_CLOSING";
    static SIGN_PLUS = "SIGN_PLUS";
    static SIGN_MINUS = "SIGN_MINUS";
    static SIGN_STAR = "SIGN_STAR";
    static SIGN_SLASH = "SIGN_SLASH";
}

class Lexer {
    static HAS_NO_VALUE = function () { return null; };
    static HAS_ONE_VALUE = function (m) { return m[1]; };

    static PATTERNS = {
        PROCEDURE:     {"value": Lexer.HAS_ONE_VALUE, "pattern": /^([_A-Za-z][_A-Za-z0-9]*[?]?)$/ },
        VARIABLE:      {"value": Lexer.HAS_ONE_VALUE, "pattern": /^[:]([_A-Za-z][_A-Za-z0-9]*$)/ },
        WORD:          {"value": Lexer.HAS_ONE_VALUE, "pattern": /^["']([_A-Za-z][_A-Za-z0-9]*)$/ },
        NUMBER:        {"value": Lexer.HAS_ONE_VALUE, "pattern": /^([-+]?(?:[0-9]*\.[0-9]+|[0-9]+)(?:[eE][-+]?[0-9]+)?)$/ },
        LIST_OPENING:  {"value": Lexer.HAS_NO_VALUE,  "pattern": /^\[$/ },
        LIST_CLOSING:  {"value": Lexer.HAS_NO_VALUE,  "pattern": /^\]$/ },
        ARRAY_OPENING: {"value": Lexer.HAS_NO_VALUE,  "pattern": /^\{$/ },
        ARRAY_CLOSING: {"value": Lexer.HAS_NO_VALUE,  "pattern": /^\}$/ },
        GROUP_OPENING: {"value": Lexer.HAS_NO_VALUE,  "pattern": /^\($/ },
        GROUP_CLOSING: {"value": Lexer.HAS_NO_VALUE,  "pattern": /^\)$/ },
        SIGN_PLUS:     {"value": Lexer.HAS_NO_VALUE,  "pattern": /^\+$/ },
        SIGN_MINUS:    {"value": Lexer.HAS_NO_VALUE,  "pattern": /^-$/ },
        SIGN_STAR:     {"value": Lexer.HAS_NO_VALUE,  "pattern": /^\*$/ },
        SIGN_SLASH:    {"value": Lexer.HAS_NO_VALUE,  "pattern": /^\/$/ },
    };

    constructor (code) {
        this.lines = code.trim().split(/\xd?\xa/);
        this.line_number = 0;
        this.components = this.lines.length > 0 ? this.lines[0].split(/\s/) : [];
        this.index = 0;
    };

    next_token () {
        if (this.index == this.components.length) {
            if ((this.line_number + 1) == this.lines.length) {
                return {
                    "matched": false,
                    "token": Token.NO_MORE,
                    "raw": "",
                };
            } // if

            // Parse next line.
            this.line_number += 1;
            this.components = this.lines[this.line_number].split(/\s/);
            this.index = 0;

            return {
                "matched": true,
                "token": Token.END_OF_LINE,
                "raw": "",
            };
        } // if

        const text = this.components[this.index];
        for (const key in Lexer.PATTERNS) {
            const meta = Lexer.PATTERNS[key];

            const m = text.match(meta["pattern"]);
            if (! m) continue;

            this.index += 1;
            return {
                "matched": true,
                "token": key,
                "raw": text,
                "value": meta["value"](m),
            };
        } // for

        return {
            "matched": false,
            "token": Token.NOT_FOUND,
            "raw": text,
        };
    };

    test () {
        while (true) {
            const tkn = this.next_token();
            console.log(tkn);
            if (! tkn.matched) break;
        } // while
    }
}
