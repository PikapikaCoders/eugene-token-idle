const player = {
    tokens: new Decimal(0),
    money: new Decimal(0),
    
    scamming: false,
    scamTimeouted: false,
    scamTimeout: 5000,
    ups: {
        _total: new Decimal(0),

        yield: new Decimal(0),
        speed: new Decimal(0),
        trans: new Decimal(0),

        yieldCost: [],
        speedCost: [],
        transCost: [],
    }
}

function getOut() {
    addClass("getOutDiv", "hide");
    removeClass("mainDiv", "hide");
}

var scamTimeoutID;
function scam() {
    if (player.scamTimeouted) { return; }
    
    if (!player.scamming) {
        player.scamming = true;

        let timeout = Decimal.div(1e3, Decimal.pow(1.4, player.ups.speed));

        if (timeout < 50) {
            timeout = 50;
            timeoutMult = gain.times(speedUp.div(20));
        }

        scamTimeoutID = setTimeout(scamTimeoutFunc, timeout)
    } else {
        let transMult = Decimal.pow(1.4, player.ups.trans);
        let gain = player.tokens.div(5).pow(0.5).times(transMult);

        clearTimeout(scamTimeoutID);
        
        player.scamming = false;
        player.tokens = new Decimal(0);
        player.money = player.money.add(gain);
        player.scamTimeouted = true;
        setTimeout(() => { player.scamTimeouted = false; }, player.scamTimeout);
    }

    function scamTimeoutFunc() {
        let timeout = Decimal.div(1e3, Decimal.pow(1.4, player.ups.speed));

        let gain = Decimal.pow(1.4, player.ups.yield);

        if (timeout < 50) {
            timeout = 50;
            timeoutMult = gain.times(speedUp.div(20));
        }
        
        player.tokens = player.tokens.add(gain);
        scamTimeoutID = setTimeout(scamTimeoutFunc, timeout);
    }
}

function upgradeBuy(property, amount) {
    let costMult;
    if (property != "trans") { costMult = 1.5; }
    else { costMult = 1.65; }

    while (amount == 0) {
        let cost = Decimal.pow(costMult, player.ups._total).times(3);
        if (player.money.gte(cost)) {
            player.money = player.money.sub(cost);
            player.ups[property] = player.ups[property].add(1);
            player.ups._total = player.ups._total.add(1);

            player.ups[`${property}Cost`].push(cost);
        } else { return; }
    }

    for (let i=0; i<amount; i++) {
        let cost = Decimal.pow(costMult, player.ups._total).times(3);
        if (player.money.gte(cost)) {
            player.money = player.money.sub(cost);
            player.ups[property] = player.ups[property].add(1);
            player.ups._total = player.ups._total.add(1);
        } else { return; }
    }
}

function upgradeRespec(property, amount) {
    let costArr = player.ups[`${property}Cost`];

    while (amount == 0) {
        let cost = costArr.pop();
        if (cost == undefined) { return; }

        player.money = player.money.add(cost);
        player.ups[property] = player.ups[property].sub(1);
        player.ups._total = player.ups._total.sub(1);
    }

    for (let i=0; i<amount; i++) {
        let cost = costArr.pop();
        if (cost == undefined) { return; }

        player.money = player.money.add(cost);
        player.ups[property] = player.ups[property].sub(1);
        player.ups._total = player.ups._total.sub(1);
    }
}

setInterval(update, 1);
function update() {
    changeElement("yieldupamount", `Bought: ${player.ups.yield}`);
    changeElement("speedupamount", `Bought: ${player.ups.speed}`);
    changeElement("transupamount", `Bought: ${player.ups.trans}`);

    let costCheap = Decimal.pow(1.5, player.ups._total).times(3);
    let costLessCheap = Decimal.pow(1.65, player.ups._total).times(3);

    changeElement("yieldCost", `Cost: ${format(costCheap)} money`);
    changeElement("speedCost", `Cost: ${format(costCheap)} money`);
    changeElement("transCost", `Cost: ${format(costLessCheap)} money`);

    changeElement("amount", `You have ${format(player.tokens)} eugene tokens & ${format(player.money)} money`);
    changeElement("scam", `SCAM (Scamming: ${player.scamming} | Cooldown: ${player.scamTimeouted})`);
}