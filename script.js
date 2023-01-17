require('console-stamp')(console, 'yyyy-mm-dd HH:MM:ss');
require('dotenv').config();

const {Command} = require('commander');
const program = new Command();

program
    .usage('[options]')
    .option('-m, --model <model>', 'Model to use, 1 is the davinci model, 2 is the curie model')
    .option('-p, --prompt <prompt>', 'Prompt to use')
    .option('-s, --size <size>', 'Size of the result')
    .parse(process.argv);

const options = program.opts();

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    organization: process.env.ORGANIZATION_ID,
    apiKey: process.env.API_KEY,
});

const openai = new OpenAIApi(configuration);
const davinci_model = "text-davinci-003"; // Type 1
const curie_model = "text-curie-001"; // Type 2

async function launchScript() {
    const response = await openai.createCompletion({
        model: options.model === '1' ? davinci_model : options.model === '2' ? curie_model : davinci_model,
        prompt: options.prompt,
        temperature: 0.9,
        max_tokens: options.size ?? 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
    });
    console.log(response.data.choices[0].text);
    console.log("Tokens utiliser: ", response.data.choices[0].text.split(' ').length);
    return response.data.choices[0].text;
}

launchScript()
    .then(_ => {
        console.log("Script ended");
        process.exit();
    })
    .catch(e => {
        console.log("Script failed: " + e);
        process.exit();
    });
