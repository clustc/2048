/**
 * 
 */
var bp = {};
bp.config = require('./config')
bp.platform = require("./bpPlatform");
bp.util = require("./bpUtil");
bp.gui = require("./bpGUI");
bp.event = require("./bpEvent");
bp.http = require("./net/bpHttp");
bp.socket = require("./net/bpSocket");
bp.encrypt = require("./bpEncrypt");
bp.sound = require("./bpSound");

window.bp = bp;