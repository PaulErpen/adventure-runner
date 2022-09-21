const fs = require("fs");
const fetch = require("node-fetch");

function writeToSpells(spells, fetched) {
    for(spell of fetched.results) {
        spells[spell.slug] = spell;
    }
}

async function fetchSpellsOpen5e() {
    const spells = {};
    let fetched = await fetch("https://api.open5e.com/spells/").then(res => res.json());
    writeToSpells(spells, fetched);
    while(fetched.next) {
        fetched = await fetch(fetched.next).then(res => res.json());
        writeToSpells(spells, fetched);
    }
    fs.writeFileSync(`${__dirname}/../content/Spells/spells.json`, JSON.stringify(spells));
}

fetchSpellsOpen5e();