const request = require('request')
const express = require('express')
const app = express()
const flags = require('flags');
const ip = require("ip");
var eip = '';
var lip = ip.address();

flags.defineString('localip', '', 'LOCAL ip of the machine hosting the server (OPTIONAL IF ON SAME MACHINE)');
flags.defineString('externalip', '', 'Your External IP (OPTIONAL IF ON SAME MACHINE)');
flags.defineInteger('port', 3111, 'Port to run the API on, can be anything');
flags.parse();

request.get({ url: 'http://ifconfig.io/ip' }, function(e, r, body) {
    if (flags.get('externalip')) { eip = flags.get('externalip') } else { eip = body.replace(/\r?\n|\r/g, " "); }
    if (flags.get('localip')) { lip = flags.get('localip') }
    console.log(`Local IP: ${lip}\nExternal IP: ${eip}`)
});

app.get('/', (req, res) => { res.send('') });

app.get('/v1/servers', (req, res) => {
    request.get({ url: 'http://ms.pavlov-vr.com/v1/servers', headers: { 'version': '0.70.4' } }, function(e, r, body) {
        b2 = JSON.parse(body).servers.map(i => {
            if (i.ip === eip) i.ip = lip;
            return i;
        });
        res.json({ servers: b2 })
    });
});

app.listen(flags.get('port'), () => { console.log(`\nMS link: http://${ip.address()}:${flags.get('port')}`) })
