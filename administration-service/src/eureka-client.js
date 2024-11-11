const Eureka = require('eureka-js-client').Eureka;
const os = require('os');
const crypto = require('crypto');
require("dotenv").config();

// Genera un ID aleatorio para la instancia
const instanceId = `administration-service:${crypto.randomBytes(8).toString('hex')}`;
const port = process.env.PORT;

// Configura el cliente Eureka
const client = new Eureka({
    // Configuración de la instancia del microservicio
    instance: {
        app: 'administration-service',
        instanceId: instanceId,
        hostName: os.hostname(),
        ipAddr: 'localhost',
        port: {
            '$': port,
            '@enabled': 'true',
        },
        vipAddress: 'administration-service',
        dataCenterInfo: {
            '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
            name: 'MyOwn',
        },
    },
    // Configuración de conexión con el servidor Eureka
    eureka: {
        host: '172.25.0.3',
        port: 8761,
        servicePath: '/eureka/apps/'
    }
});

client.start(error => {
    console.log('Eureka client started with error:', error);
});

