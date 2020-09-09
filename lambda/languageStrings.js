/* *
 * We create a language strings object containing all of our strings.
 * The keys for each string will then be referenced in our code, e.g. handlerInput.t('WELCOME_MSG').
 * The localisation interceptor in index.js will automatically choose the strings
 * that match the request's locale.
 * */

module.exports = {
    en: {
        translation: {
            WELCOME_MSG: 'Welcome to the meal planner.',
            SUGGEST_MSG: 'You can ask me for suggestions',
            HELLO_MSG: 'You do not have a meal set yet. So I am going ahead and creating one for you. ',
            HELP_MSG: 'You can say hello to me! How can I help?',
            GOODBYE_MSG: 'Goodbye!',
            REFLECTOR_MSG: 'You just triggered {{intentName}}',
            FALLBACK_MSG: 'Sorry, I don\'t know about that. Please try again.',
            ERROR_MSG: 'Sorry, I had trouble doing what you asked. Please try again.'
        }
    },
    hi: {
        translation: {
            WELCOME_MSG: 'नमस्ते, आप hello या help कह सकते हैं. आप क्या करना चाहेंगे?',
            HELLO_MSG: 'नमस्ते दुनिया ',
            HELP_MSG: 'आप मुझसे hello बोल सकते हो.',
            GOODBYE_MSG: 'अलविदा ',
            REFLECTOR_MSG: 'आपने {{intentName}} trigger किया हैं ',
            FALLBACK_MSG: 'Sorry, मैं वो समझ नहीं पायी. क्या आप दोहरा सकते हैं ',
            ERROR_MSG: 'Sorry, मैं वो समझ नहीं पायी. क्या आप दोहरा सकते हैं '
        }
    }
}