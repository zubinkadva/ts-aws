var AWS = require('aws-sdk')
var http = require('https')

AWS.config.update({ region: 'us-east-2' })

var transcribeservice = new AWS.TranscribeService()

var uri = 'https://s3.us-east-2.amazonaws.com/sbcotton/objective_comp.wav'
var jobName = 'TestJob5'

var params = {
  LanguageCode: 'en-US' /* required */,
  Media: {
    /* required */
    MediaFileUri: uri
  },
  MediaFormat: 'wav' /* required */,
  TranscriptionJobName: jobName /* required */,
  MediaSampleRateHertz: 22050
}

/*
* Creates a Transcription Job
*/
transcribeservice.startTranscriptionJob(params, function(err, data) {
  if (err)
    console.log(err, err.stack) // an error occurred
  else console.log(data) // successful response
})

var params = {
  TranscriptionJobName: jobName /* required */
}

/*
* Get Transcription Job
*/
// NEED TO LOOP THIS TILL THE JOB IS COMPLETED
//data['TranscriptionJob']['TranscriptionJobStatus'] == 'COMPLETED'
transcribeservice.getTranscriptionJob(params, function(err, data) {
  if (err) {
    console.log(err, err.stack)
  } else {
    var url = data['TranscriptionJob']['Transcript']['TranscriptFileUri']

    http
      .get(url, function(res) {
        var body = ''
        res.on('data', function(chunk) {
          body += chunk
        })
        res.on('end', function() {
          console.log(
            'Got a response: ',
            JSON.parse(body)['results']['transcripts'][0]['transcript']
          )
        })
      })
      .on('error', function(e) {
        console.log('Got an error: ', e)
      })
  }
})
