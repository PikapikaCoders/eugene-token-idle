let utilsLoadInterval;
function utilsSave() {
    localStorage.setItem("eugeneTokenIdlePlayer", JSON.stringify(player));
}

const decimalArr = [
    "tokens", "money", "vel",
    "prestige", "prestigeTkn", "prestigeTknGain", "prestigeTknBest",
]

const nestedDecimalArr = [
    ["ups", ["_total", "accel", "speed", "trans"]],
]

function utilsLoad(json) {
    if (json === null) { return; } 
    temp = JSON.parse(json);
    if (temp.autosave) { setInterval(utilsSave, 1000); }

    for (const s of decimalArr) { temp[s] = new Decimal(temp[s]) }

    for (const a of nestedDecimalArr) {
        for (const s of a[1]) { temp[a[0]][s] = new Decimal(temp[a[0]][s]) }
    }

    player = temp;
}

function utilsAutosave() {
    player.autosave = !player.autosave;

    if (player.autosave) { utilsLoadInterval = setInterval(utilsSave, 1000); }
    else { clearInterval(utilsLoadInterval); }
}

function utilsDeleteSave() {
    const confirm = window.confirm("Are you sure you want to delete your save file?");
    if (!confirm) { return; }

    const confirm2 = window.confirm("Are you REALLY REALLY sure? THIS IS NOT A PRESTIGE!!!");
    if (!confirm2) { return; }

    if (player.autosave) { utilsAutosave(); }

    setDefaultPlayer();
    utilsSave();

    setTimeout(() => { window.location.reload(); }, 100);
}

window.onload = () => { utilsLoad(localStorage.getItem("eugeneTokenIdlePlayer")); };