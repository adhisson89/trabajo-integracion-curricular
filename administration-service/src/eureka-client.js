const { Eureka } = require('eureka-js-client');
const os = require('os');
const crypto = require('crypto');
require("dotenv").config();

// Genera un ID aleatorio para la instancia
const instanceId = `administration-service:${crypto.randomBytes(8).toString('hex')}`;


// Configura el cliente Eureka
const client = new Eureka({
    instance: {
        app: 'administration-service',
        hostName: os.hostname(),
        ipAddr: '127.0.0.1',
        instanceId,
        statusPageUrl: `http://localhost:${process.env.PORT}/test/health`,
        port: {
            '$': process.env.PORT,
            '@enabled': 'true',
        },
        vipAddress: 'administration-service',
        dataCenterInfo: {
            '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
            name: 'MyOwn',
        },
    },
    eureka: {
        host: '172.25.0.3',
        port: 8761,
        servicePath: '/eureka/apps/'
    }
});

client.logger.level('debug')

// Inicia el cliente Eureka
client.start( error => {
    console.log(error || "User service registered")
});

function exitHandler(options, exitCode) {
    if (options.cleanup) {
    }
    if (exitCode || exitCode === 0) console.log(exitCode);
    if (options.exit) {
        client.stop();
    }
}

client.on('deregistered', () => {
    console.log('after deregistered');
    process.exit();
})

client.on('started', () => {
  console.log("eureka host  " + '172.25.0.3');
})

process.on('SIGINT', exitHandler.bind(null, {exit:true}));
process.on('SIGTERM', exitHandler.bind(null, {exit:true}));

