function exprCharType(char) {
    const ascii = char.charCodeAt(0);
    let type;

    if (ascii == 40) { type = "open"; }
    else if (ascii == 41) { type = "close"; }
    else if ((ascii == 42 || ascii == 43) || (ascii == 45 || ascii == 47)) { type = "op"; }
    else if (ascii == 46 || (ascii >= 48 && ascii <= 57)) { type = "num"; }
    else if ((ascii >= 65 && ascii <= 90) || (ascii >= 97 && ascii <= 122)) { type = "str"; }
    else if (ascii == 32) { type = ""; }

    return type;
}

function exprOpLevel(op) {
    let level;
    switch (op) {
        case "+": case "-": level = 0; break;
        case "*": case "/": level = 1; break;
        default: level = -1;
    }

    return level;
}

function exprOpEval(op, val1, val2) {
    let val;
    val1 = new Decimal(val1);
    val2 = new Decimal(val2);
    switch (op) {
        case "+": val = val1.add(val2); break;
        case "-": val = val1.sub(val2); break;
        case "*": val = val1.times(val2); break;
        case "/": val = val1.div(val2); break;
        default: val = new Decimal(0);
    }

    return format(val);
}

function exprStrToVal(str) {
    let val;
    switch (str) {
        case "token": val = player.tokens; break;
        case "money": val = player.money; break;
        case "vel": val = player.vel; break;
        case "accel": val = player.ups.accel; break;
        case "speed": val = player.ups.speed; break;
        case "spirit": val = player.spirits; break;
        case "essence": val = player.essence; break;
        default: val = new Decimal(0);
    }

    return format(val);
}

function exprTokenize(expr) {
    let stack = [], prevType = "", type, tkn = "";

    for (const char of expr) {
        type = exprCharType(char);

        if (type === "") continue;

        if (prevType === "" || prevType === type) {
            tkn += char;
        } else {
            stack.push(tkn);
            tkn = char;
        }

        prevType = type;
    }

    stack.push(tkn);

    return stack;
}

function exprToRPN(stack) {
    let output = [], op = [];

    for (const str of stack) {
        switch(exprCharType(str[0])) {
            case "open": op.push(str); break;
            
            case "close": 
                let opPop;
                while (true) {
                    opPop = op.pop();

                    if (opPop == "(") { break; }
                    output.push(opPop);
                }
                break;

            case "op":
                const level = exprOpLevel(str);
                while (op.length && exprOpLevel(op[op.length - 1]) >= level) {
                    output.push(op.pop());
                }
                op.push(str);
                break;

            case "num": output.push(str); break;

            case "str": output.push(exprStrToVal(str)); break;
        }
    }

   while (op.length) { output.push(op.pop()); }

    return output;
}

function exprEvalRPN(stack) {
    let output = [];

    for (const str of stack) {
        if (exprCharType(str[0]) === "op") {
            const val2 = output.pop(), val1 = output.pop();
            const val = exprOpEval(str, val1, val2);

            output.push(val);
        } else { output.push(str); }
    }

    return new Decimal(output[0]);
}

function exprEval(expr) {
    const stack = exprTokenize(expr);
    const rpn = exprToRPN(stack);
    const output = exprEvalRPN(rpn);

    return output;
}