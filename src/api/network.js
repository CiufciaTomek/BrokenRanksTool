var Cap = require('cap').Cap;
var decoders = require('cap').decoders;
const utf8 = require('utf8')
const { ipcMain } = require('electron')

var PROTOCOL = decoders.PROTOCOL;

let usedDevice = {
    type: 'NETWORK_SETTING',
    name: null,
    desc: null,
    ipv4: null
}

ipcMain.on('BR_NETWORK', (e, data) => {
    for (const device of Cap.deviceList()) {
        for (const address of device.addresses) {
            if (address.addr.match(/\d+\.\d+\.\d+\.\d+/)) {
                usedDevice.name = device.name
                usedDevice.description = device.description
                usedDevice.ipv4 = address.addr
            }
        }
    }
    if (!usedDevice.ipv4) e.reply('BR_NETWORK', { type: 'NETWORK_SETTING_ERROR', text: 'Ipv4 was not found!' })
    else e.reply('BR_NETWORK', usedDevice)

    var c = new Cap();
    var device = Cap.findDevice(usedDevice.ipv4);
    var filter = 'tcp and (port 9335 or port 51157)';
    var bufSize = 10 * 1024 * 1024;
    var buffer = Buffer.alloc(65535);

    var linkType = c.open(device, filter, bufSize, buffer);

    c.setMinBytes && c.setMinBytes(0);

    const channels = { 0: { name: 'global' }, 1: { name: 'trade' }, 2: { name: 'private' }, 5: { name: 'novice' }, 6: { name: 'guild' }, 8: { name: 'local' }, 7: { name: 'expedition' } }

    c.on('packet', function (nbytes, trunc) {
        if (linkType === 'ETHERNET') {
            var ret = decoders.Ethernet(buffer);

            if (ret.info.type === PROTOCOL.ETHERNET.IPV4) {

                ret = decoders.IPV4(buffer, ret.offset);

                if (ret.info.protocol === PROTOCOL.IP.TCP) {
                    var datalen = ret.info.totallen - ret.hdrlen;

                    ret = decoders.TCP(buffer, ret.offset);
                    datalen -= ret.hdrlen;

                    const dupa = buffer.toString('binary', ret.offset, ret.offset + datalen);

                    const dupaSplit = dupa.split(';')
                    //console.log(dupaSplit)
                    if (dupaSplit[0] == 0 && dupaSplit[1] == 3) {
                        const eqList = []
                        const equipment = dupaSplit[2].split('%')
                        for (eq of equipment) {
                            let newItem = {}

                            for (let eqItem of eq.split('$')) {
                                let splitEqItem = eqItem.split(',')
                                if (splitEqItem.length == 7) {
                                    newItem = {
                                        ...newItem,
                                        sila: splitEqItem[0],
                                        zreka: splitEqItem[1],
                                        moc: splitEqItem[2],
                                        wiedza: splitEqItem[3],
                                        pz: splitEqItem[4],
                                        mana: splitEqItem[5],
                                        konda: splitEqItem[6]
                                    }
                                }

                                if (splitEqItem.length == 8) {
                                    newItem = {
                                        ...newItem,
                                        siecz: splitEqItem[0],
                                        obuch: splitEqItem[1],
                                        klut: splitEqItem[2],
                                        idk: splitEqItem[3],
                                        idk1: splitEqItem[4],
                                        idk2: splitEqItem[5],
                                        idk3: splitEqItem[6],
                                        idk4: splitEqItem[7]
                                    }
                                }

                                if (splitEqItem.length == 21) {
                                    newItem = {
                                        ...newItem,
                                        name: splitEqItem[0],
                                        lvl: splitEqItem[2]
                                    }
                                }
                            }
                            eqList.push(newItem)
                        }
                        return e.reply('BR_NETWORK', {type: 'EQUIPMENT', eqList})
                    }

                    switch (dupaSplit[0]) {
                        case '2': {
                            if (dupaSplit[1] == '19') return
                            if (dupaSplit[1] == '3') return
                            try {
                                let message = {
                                    type: 'MESSAGE',
                                    player: decodeURIComponent(utf8.decode(dupaSplit[2])) + ' [' + dupaSplit[4] + ']',
                                    message: decodeURIComponent(utf8.decode(dupaSplit[3])).trim(' '),
                                    channel: channels[dupaSplit[5]].name
                                }
                                //console.log(JSON.stringify(message));
                               return e.reply('BR_NETWORK', message)
                            } catch (e) {
                                //console.log(dupaSplit)
                            }
                        }
                            break;
                        case '-1': {
                            return e.reply('BR_NETWORK', { type: 'USERNAME', name: dupaSplit[2] })
                        }
                    }

                    const test = dupaSplit.sort((a, b) => {
                        return b.length - a.length
                    })
                    const filtr = /1&([A-Z])\w+/g;
                    const found = test[0].match(filtr);
                    if (found) {
                        let battleReport = [];
                        let mobs = [];
                        let info = dupaSplit[0].split('$')
                        for (element of info) {
                            if (!element) continue;
                            let eSplit = element.split('&')
                            if (eSplit[0] == 1) {
                                battleReport.push({
                                    name: decodeURIComponent(utf8.decode(eSplit[1])),
                                    exp: eSplit[2],
                                    gold: eSplit[3],
                                    items: decodeURIComponent(utf8.decode(eSplit[5])).trim(' '), others: decodeURIComponent(utf8.decode(eSplit[7])).trim(' '),
                                })
                            } else if (eSplit[0] == 2) {
                                mobs.push(decodeURIComponent(utf8.decode(eSplit[1]))) //TUTAJ COŚ SIE PIERDOLI I JAKĄŚ 8 ZWRACA
                            }
                        }
                        if (mobs.length) {
                            battleReport.push(mobs)
                        }
                        if (!battleReport.length) return;
                        if (!mobs[0]?.length && mobs?.length == 1) return;

                        return e.reply('BR_NETWORK', {type: 'FIGHT', data: battleReport})
                    }
                }

            } else
                console.log('Unsupported Ethertype: ' + PROTOCOL.ETHERNET[ret.info.type]);
        }
    });
})