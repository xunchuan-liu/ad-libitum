const deepai = require('deepai');


async function generate() {
    deepai.setApiKey('937ae033-e29f-4485-b5da-63f3cede0127');
   
    var resp = await deepai.callStandardApi("text-generator", {
            text: "batgirl",
    });
    console.log(resp.output);
}

export default generate;