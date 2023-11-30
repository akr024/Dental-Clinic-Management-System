### Mqtt Service package

## Installation
To install this package in an npm project, run the following command. The suffix is a tag which signifies the version
``` 
npm install git+ssh://git@git.chalmers.se:courses/dit355/2023/student-teams/dit356-2023-09/mqttservicepackage.git#v1.0.0
```

## Usage
Initialization can be done by providing credentials and options manually through `initializeMqtt`, or by using environment variables and using `initializeMqttUsingEnvVariables` instead.

Create a `.env` file in the root directory of your project and define the following variables (bellow are example values). Some are optional depending on your broker configuration

```
MQTT_BROKER_URL=mqtt://broker.hivemq.com
MQTT_BROKER_PORT=1883

MQTT_BROKER_USERNAME=Test1234         # optional
MQTT_BROKER_PASSWORD=Test1234         # optional

MQTT_CERT_PATH=path/to/cert.csr       # optional
MQTT_CERT_KEY_PATH=path/to/cert.key   # optional
```

