/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');
// i18n library dependency, we use it below in a localisation interceptor
const https = require('https');
const i18n = require('i18next');
// i18n strings for all supported locales
const languageStrings = require('./languageStrings');

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = handlerInput.t('WELCOME_MSG');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const SetMealIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'SetMealIntent';
    },
    async handle(handlerInput) {
        const speakOutput = handlerInput.t('HELLO_MSG');
        const output =  await httpGet(process.env.base,'maxRecords=100&view=Grid%20view');
        var dishes = [];
        // cycle through dishes list
        for(record in output.records){
            dishes.push(output.records[record].fields.Dishes)
        }
        dishes = shuffleArray(dishes);
        dishes.length = 21
        const updateMeal = {"records":[]};

        const breakfast = {"fields":{
        "Meal Plan":"Breakfast", 
        "Monday":dishes[0], 
        "Tuesday":dishes[1], 
        "Wednesday":dishes[2], 
        "Thursday":dishes[3],
        "Friday":dishes[4],
        "Saturday":dishes[5],
        "Sunday":dishes[6]
        }};

        const lunch = {"fields":{
        "Meal Plan":"Lunch", 
        "Monday":dishes[7], 
        "Tuesday":dishes[8], 
        "Wednesday":dishes[9], 
        "Thursday":dishes[10],
        "Friday":dishes[11],
        "Saturday":dishes[12],
        "Sunday":dishes[13]
        }};

        const dinner = {"fields":{
        "Meal Plan":"Dinner", 
        "Monday":dishes[14], 
        "Tuesday":dishes[15], 
        "Wednesday":dishes[16], 
        "Thursday":dishes[17],
        "Friday":dishes[18],
        "Saturday":dishes[19],
        "Sunday":dishes[20]
        }};

        updateMeal["records"].push(breakfast, lunch, dinner);
        const update = await httpPost(process.env.base, 'Meal%20Plan', updateMeal);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = handlerInput.t('HELP_MSG');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = handlerInput.t('GOODBYE_MSG');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = handlerInput.t('FALLBACK_MSG');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = handlerInput.t('REFLECTOR_MSG', {intentName: intentName});

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = handlerInput.t('ERROR_MSG');
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

function shuffleArray(input){
    for(let i = input.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * i);
        const temp = input[i];
        input[i] = input [j];
        input[j] = temp;
    }
    return input;
}

function httpGet(base, filter, table = "Dishes"){
    
    var options = {
        host: "api.airtable.com",
        port: 443,
        path: "/v0/" + base + "/" + table + "?" + filter,
        method: "GET",
        headers:{
            Authorization: 'Bearer ' + process.env.apiKey
        }
    };

    // console.log("FULL PATH = http://" + options.host + options.path);
    
    return new Promise(((resolve, reject) => {
      const request = https.request(options, (response) => {
        response.setEncoding("utf8");
        let returnData = "";

  
        if (response.statusCode < 200 || response.statusCode >= 300) {
          return reject(new Error(`${response.statusCode}: ${response.req.getHeader("host")} ${response.req.path}`));
        }
        
        //console.log("HTTPS REQUEST OPTIONS = " + JSON.stringify(options));
  
        response.on("data", (chunk) => {
          returnData += chunk;
        });
  
        response.on("end", () => {
          resolve(JSON.parse(returnData));
        });
  
        response.on("error", (error) => {
          reject(error);
        });
      });
      request.end();
    }));
}

function httpPost(base, table, data){
    var output = JSON.stringify(data);
    
    const options = {
        hostname: 'api.airtable.com',
        path: "/v0/" + base + "/" + table,
        method: "POST",
        headers: {
            'Authorization': 'Bearer ' + process.env.apiKey,
            'Content-Type': 'application/json',
            'Content-Length': output.length
        }
      };

      return new Promise(((resolve, reject) => {
        const req = https.request(options, function(res) {
            console.log(`statusCode: ${res.statusCode}`)
            var chunks = '';

            res.on('data', function (chunk) {
                chunks += chunk;
            });
            res.on('end', function() {
                resolve(chunks);
            });
          })
        
          req.on('error', error => {
            console.error(error)
          });

          req.write(output);
          req.end();
        }));
}


// This request interceptor will bind a translation function 't' to the handlerInput
const LocalisationRequestInterceptor = {
    process(handlerInput) {
        i18n.init({
            lng: Alexa.getLocale(handlerInput.requestEnvelope),
            resources: languageStrings
        }).then((t) => {
            handlerInput.t = (...args) => t(...args);
        });
    }
};
/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        SetMealIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .addRequestInterceptors(
        LocalisationRequestInterceptor)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();
