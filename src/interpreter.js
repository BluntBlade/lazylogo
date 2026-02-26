class Token {
    static NO_MORE = "NO_MORE";
    static NOT_FOUND = "NOT_FOUND";
    static IDENTIFIER = "IDENTIFIER";
    static PROCEDURE = "PROCEDURE";
    static VARIABLE = "VARIABLE";
    static WORD = "WORD";
    static NUMBER = "NUMBER";
    static LEFT_BRACKET = "LEFT_BRACKET";
    static RIGHT_BRACKET = "RIGHT_BRACKET";
    static LEFT_BRACE = "LEFT_BRACE";
    static RIGHT_BRACE = "RIGHT_BRACE";
    static LEFT_PARENTHESIS = "LEFT_PARENTHESIS";
    static RIGHT_PARENTESIS = "RIGHT_PARENTESIS";
    static SIGN_PLUS = "SIGN_PLUS";
    static SIGN_MINUS = "SIGN_MINUS";
    static SIGN_STAR = "SIGN_STAR";
    static SIGN_SLASH = "SIGN_SLASH";
    static RUN = "RUN";
    static IF = "IF";
    static IFELSE = "IFELSE";
    static REPEAT = "REPEAT";
    static DOWHILE = "DOWHILE";
    static WHILE = "WHILE";
    static DOUNTIL = "DOUNTIL";
    static UNTIL = "UNTIL";
    static OUTPUT = "OUTPUT";
    static STOP = "STOP";
    static BYE = "BYE";
}

class Lexer {
    static NO_VALUE = function () { return null; };
    static ONE_VALUE = function (m) { return m[1]; };

    static PATTERNS = {
        IDENTIFIER:       {"val": Lexer.ONE_VALUE, "pat": /^([_A-Za-z][_A-Za-z0-9]*[?]?)$/ },
        VARIABLE:         {"val": Lexer.ONE_VALUE, "pat": /^[:]([_A-Za-z][_A-Za-z0-9]*$)/ },
        WORD:             {"val": Lexer.ONE_VALUE, "pat": /^["']([_A-Za-z][_A-Za-z0-9]*)$/ },
        NUMBER:           {"val": Lexer.ONE_VALUE, "pat": /^([-+]?(?:[0-9]*\.[0-9]+|[0-9]+)(?:[eE][-+]?[0-9]+)?)$/ },
        LEFT_BRACKET:     {"val": Lexer.NO_VALUE,  "pat": /^\[$/ },
        RIGHT_BRACKET:    {"val": Lexer.NO_VALUE,  "pat": /^\]$/ },
        LEFT_BRACE:       {"val": Lexer.NO_VALUE,  "pat": /^\{$/ },
        RIGHT_BRACE:      {"val": Lexer.NO_VALUE,  "pat": /^\}$/ },
        LEFT_PARENTHESIS: {"val": Lexer.NO_VALUE,  "pat": /^\($/ },
        RIGHT_PARENTESIS: {"val": Lexer.NO_VALUE,  "pat": /^\)$/ },
        SIGN_PLUS:        {"val": Lexer.NO_VALUE,  "pat": /^\+$/ },
        SIGN_MINUS:       {"val": Lexer.NO_VALUE,  "pat": /^-$/ },
        SIGN_STAR:        {"val": Lexer.NO_VALUE,  "pat": /^\*$/ },
        SIGN_SLASH:       {"val": Lexer.NO_VALUE,  "pat": /^\/$/ },
    };

    static KEYWORDS = {
        RUN:         true,
        IF:          true,
        IFELSE:      true,
        REPEAT:      true,
        DOWHILE:     true,
        WHILE:       true,
        DOUNTIL:     true,
        UNTIL:       true,
        OUTPUT:      true,
        STOP:        true,
        BYE:         true,
    };

    constructor (code) {
        this.lines = code.trim().split(/\xd?\xa/);
        this.line_number = 0;
        this.components = this.lines.length > 0 ? this.lines[0].split(/\s/) : [];
        this.index = 0;
    } // constructor

    map_token (idr, val) {
        if (idr != Token.IDENTIFIER) return idr;
        if (val in Lexer.KEYWORDS) return Token.PROCEDURE;
        return Token.NOT_FOUND;
    } // map_token

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
        } // if

        const text = this.components[this.index];
        for (const key in Lexer.PATTERNS) {
            const meta = Lexer.PATTERNS[key];

            const m = text.match(meta["pat"]);
            if (! m) continue;

            this.index += 1;

            const val = meta["val"](m);
            const tkn = this.map_token(key, val);

            if (tkn == Token.NOT_FOUND) break;
            return {
                "matched": true,
                "token": tkn,
                "raw": text,
                "value": val,
            };
        } // for

        return {
            "matched": false,
            "token": Token.NOT_FOUND,
            "raw": text,
        };
    } // next_token

    test () {
        while (true) {
            const tkn = this.next_token();
            console.log(tkn);
            if (! tkn.matched) break;
        } // while
    } // test
}

class Parser {
    // code       => blocks
    // blocks     => control blocks         |
    //               statement blocks
    // control    => RUN body               |
    //               IF expr body           |
    //               IFELSE expr body body  |
    //               REPEAT expr body       |
    //               DOWHILE body expr      |
    //               WHILE expr body        |
    //               DOUNTIL body expr      |
    //               UNTIL expr body        |
    //               OUTPUT expr            | # End the running procedure and output the specified value.
    //               STOP                   | # End the running procedure with no output value.
    //               BYE                    | # Terminate the program.
    // body       => [ blocks ]
    // statement  => PROCEDURE items        | # Call procedure with default number of inputs.
    //               ( PROCEDURE items )      # Call procedure with an arbitrary number of inputs.
    // items      => item items             |
    //               item
    // item       => group                  |
    //               list                   |
    //               array                  |
    //               WORD                   |
    //               NUMBER                 |
    //               VARIABLE
    // list       => [ items ]                # Immutable collection of items
    // array      => { items }                # Mutable collection of items
    // group      => ( expr )
    // expr       => operand + operand      | # Calculate the sum
    //               operand - operand      | # Calculate the difference
    //               operand * operand      | # Calculate the production
    //               operand / operand      | # Calculate the quotient
    //               operand % operand      | # Calculate the modulo
    //               operand ^ operand      | # Calculate the power
    //               - operand              | # Negate the value
    // operand    => group                  |
    //               NUMBER

    constructor () {
    } // constructor

    parse (code) {
        const lxr = new Lexer(code);
        const tkn = lxr.next_token();
    } // parse
}
