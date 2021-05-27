const express = require('express');
const app = new express();

const dotenv = require('dotenv') ;
dotenv.config() ;

function getNLUInstance(){
    let api_key = process.env.API_KEY ;
    let api_url = process.env.API_URL ;

    const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1') ;
    const { IamAuthenticator } = require('ibm-watson/auth') ;

    const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
        version: '2020-08-01',
        authenticator: new IamAuthenticator({
            apikey: api_key,
        }),
        serviceUrl: api_url,
    });
    return naturalLanguageUnderstanding ;
}

app.use(express.static('client'))

const cors_app = require('cors');
app.use(cors_app());

app.get("/",(req,res)=>{
    res.render('index.html');
  });

app.get("/url/emotion", (req,res) => {
    let naturalLanguageUnderstanding = getNLUInstance() ;
    const analyzeParams = {
        'html': req.query.url,
        'features': {
            'emotion': { }
        }
    };

    naturalLanguageUnderstanding.analyze(analyzeParams)
        .then(analysisResults => {
            let resAnalysisResult = JSON.stringify(analysisResults.result.emotion.document.emotion, null, 2) ;
            return res.status('200').send(resAnalysisResult);
        })
        .catch(err => {
            let Error = "Error: " + err.toString() ;
            return res.send(Error);
    });
    //return res.send({"happy":"90","sad":"10"});
});

app.get("/url/sentiment", (req,res) => {
    let naturalLanguageUnderstanding = getNLUInstance() ;
    
    const analyzeParams = {
        'html': req.query.url,
        'features': {
            'sentiment': { }
        }
    };

    naturalLanguageUnderstanding.analyze(analyzeParams)
        .then(analysisResults => {
            let resAnalysisResult = JSON.stringify(analysisResults.result.emotion.document.emotion, null, 2) ;
            return res.status('200').send(resAnalysisResult);
        })
        .catch(err => {
            let Error = "Error: " + err.toString() ;
            return res.send(Error);
    });
    //return res.send("url sentiment for "+req.query.url);
});

app.get("/text/emotion", (req,res) => {
    let naturalLanguageUnderstanding = getNLUInstance() ;
        const analyzeParams = {
        'text': req.query.text,
        'features': {
            'emotion': { }
        }
    };

    naturalLanguageUnderstanding.analyze(analyzeParams)
        .then(analysisResults => {
            let resAnalysisResult = JSON.stringify(analysisResults.result.emotion.document, null, 2) ;
            return res.status('200').send(resAnalysisResult);
        })
        .catch(err => {
            let Error = "Error: " + err.toString() ;
            return res.send(Error);
    });
    //return res.send({"happy":"10","sad":"90"});
});

app.get("/text/sentiment", (req,res) => {
    let naturalLanguageUnderstanding = getNLUInstance() ;
        const analyzeParams = {
        'text': req.query.text,
        'features': {
            'sentiment': { }
        }
    };

    naturalLanguageUnderstanding.analyze(analyzeParams)
        .then(analysisResults => {
            let resAnalysisResult = JSON.stringify(analysisResults.result.sentiment.document.label, null, 2) ;
            //let resAnalysisResult = analysisResults.result.sentiment.document ;
            console.log(resAnalysisResult) ;
            return res.status('200').send(resAnalysisResult);
        })
        .catch(err => {
            let Error = "Error: " + err.toString() ;
            return res.send(Error);
    });
    //return res.send("text sentiment for "+req.query.text);
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})

