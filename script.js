const player = {
    tokens: new Decimal(0)
}

function foo() {
    console.log(`I am ran! You have ${format(player.tokens)} eugene tokens!!!`);
    return 0;
}

function bar(arg) {
    console.log(`Hey! I found this element for you: ${getElement("eugene")}!`);
    changeElement("eugene", arg);
    return 0;
}

/*
Hi, I am a comment!
Once we start working on this, the foo() and bar() shall be deleted.
They are only for reference.
*/