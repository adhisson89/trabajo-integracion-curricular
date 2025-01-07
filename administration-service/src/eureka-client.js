const { Eureka } = require('eureka-js-client');
const os = require('os');
const crypto = require('crypto');

let client

exports.registerWithEureka = (port) => {
// Genera un ID aleatorio para la instancia
    const instanceId = `administration-service:${crypto.randomBytes(8).toString('hex')}`;

    // Configura el cliente Eureka
    client = new Eureka({
        instance: {
            app: 'administration-service',
            hostName: os.hostname(),
            ipAddr: '127.0.0.1',
            instanceId,
            statusPageUrl: `http://localhost:${port}/test/health`,
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
        eureka: {
            host: '172.25.0.3',
            port: 8761,
            servicePath: '/eureka/apps/'
        }
    });

    // client.logger.level('debug')


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
        console.log('Deregistered completely from eureka');
        process.exit();
    })


    client.on('registryUpdated', () => {
        console.log('Registry updated!');
        
        // const registry = client.cache.app; 

        // Object.keys(registry).forEach((appName) => {
        //     console.log(`Application: ${appName}`);
            
        //     registry[appName].forEach((instance) => {
        //         console.log(`Hostname: ${instance.hostName}`);
        //         console.log(`IP Address: ${instance.ipAddr}`);
        //         console.log(`Port: ${instance.port.$}`);
        //         console.log('---'); 
        //     });
        // });
    });

    process.on('SIGINT', exitHandler.bind(null, {exit:true}));
    process.on('SIGTERM', exitHandler.bind(null, {exit:true}));


}

exports.getServiceUrl = (serviceName) => {
    if (!client) {
        console.error("Eureka client is not initialized.");
        return null;
    }

    const registry = client.cache.app;
    const service = registry[serviceName.toUpperCase()];
    if (service && service.length > 0) {
        const instance = service[Math.floor(Math.random() * service.length)];
        return `http://${instance.ipAddr}:${instance.port.$}`;
    }
    return null;
};