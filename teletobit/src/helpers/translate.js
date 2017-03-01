import franc from 'franc';
var googleTranslate = require('google-translate')('AIzaSyDn87dgXOFWk-yJ9SM2-VvU2Tg9zrP4Jtc');


const translate = (title, description) => {

    var inputLocale = franc(description);
    console.log('description=>', description);
    console.log("inputLocale: ", inputLocale);

    if(inputLocale !== 'kor' && inputLocale !== 'und') {

        // Translate data if locale is not 'korean' or undetective language
        return new Promise( function(resolve, reject ) {
            googleTranslate.translate([title, description], 'ko', function(err, translations) {
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


// var inputLocale = franc(title);
//
// if(inputLocale === 'und' && description) {
//     inputLocale = franc(description);
// }
//
// if(inputLocale !== 'kor' && inputLocale !== 'und') {
//
//     // Translate data if locale is not 'korean' or undetective language
//     const result = await googleTranslate.translate([title, description], 'ko', function(err, translations) {
//         console.log('googleTranslate');
//         return ({
//             title: translations[0].translatedText,
//             description: translations[1].translatedText
//         });
//
//     });
// } else {
//     console.log('not googleTranslate');
//
//     return ({
//         title: title,
//         description: description
//     });
//
// }
