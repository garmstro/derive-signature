const Crypto = require('crypto-js');

console.log('Calculating Signature...');
const params = {
    privateKey: '<YOUR PRIVATE KEY GOES HERE>',
    dateStamp: '20171211',
    region: 'us-east-1',
    service: 's3'
}
const key = getSignatureKey(params);

const stringToSign = '{ "expiration": "2017-12-13T12:00:00.000Z",\n' +
    '  "conditions": [\n' +
    '    {"bucket": "S3WEBSITEUPLOADBUCKET"},\n' + 
    '    ["starts-with", "$key", "images/"],\n' +
    '    {"acl": "private"},\n' +
    '    {"success_action_redirect": "http://S3WEBSITEBUCKET.s3.amazonaws.com/successful_upload.html"},\n' +
    '    ["starts-with", "$Content-Type", "image/"],\n' +
    '    {"x-amz-credential": "<YOUR ACCESS KEY ID GOES HERE>/20171211/us-east-1/s3/aws4_request"},\n' +
    '    {"x-amz-algorithm": "AWS4-HMAC-SHA256"},\n' +
    '    {"x-amz-date": "20171211T000000Z" }\n' +
    '  ]\n' +
    '}';
const utf8String = Crypto.enc.Utf8.parse(stringToSign);
const base64String = Crypto.enc.Base64.stringify(utf8String);
console.log('Policy: ' + base64String);

const signatureHash = Crypto.HmacSHA256(base64String, key);
const signature = signatureHash.toString(Crypto.enc.Hex);
console.log('Signature: ' + signature);

function getSignatureKey(params) {
    var kDate = Crypto.HmacSHA256(params.dateStamp, "AWS4" + params.privateKey);
    var kRegion = Crypto.HmacSHA256(params.region, kDate);
    var kService = Crypto.HmacSHA256(params.service, kRegion);
    var kSigning = Crypto.HmacSHA256("aws4_request", kService);
    return kSigning;
}
