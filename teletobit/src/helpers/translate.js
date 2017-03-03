import franc from 'franc';
var googleTranslate = require('google-translate')('AIzaSyDn87dgXOFWk-yJ9SM2-VvU2Tg9zrP4Jtc');


const translate = (data) => {
    let title, description;

    var inputLocale = franc(data.description);
    console.log('description=>', data.description);
    console.log("inputLocale: ", inputLocale);

    if(inputLocale !== 'kor' && inputLocale !== 'und') {

        // Translate data if locale is not 'korean' or undetective language
        return new Promise( function(resolve, reject ) {
            googleTranslate.translate([data.title, data.description], 'ko', function(err, translations) {
                console.log(translations);
                title = translations[0].translatedText;
                description = translations[1].translatedText;

                resolve ({
                    title: title,
                    description: description
                });
            });
        });

    } else {

        return ({
            title: title,
            description: description
        });

    }

};

export default translate;
