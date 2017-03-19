const translate = require('@google-cloud/translate')({
    projectId: 'teletobit-158823',
    keyFilename: './server/config/teletobit-5f683ceeb80b.json'
});

const teletobitTranslate = (metadata) => {
	let title = metadata.title ;
	let description = metadata.description;
	let source = metadata.publisher;

    // Translate data if locale is not 'korean' or undetective language
    return new Promise((resolve, reject ) => {
        translate.translate([title, description], {to:'ko',model:'nmt'}, (err, translations) => {
            title = translations[0];
            description = translations[1];

            resolve ({
                title: title,
                description: description,
				source: source	                
            });
        });
    });
};

module.exports = teletobitTranslate;


