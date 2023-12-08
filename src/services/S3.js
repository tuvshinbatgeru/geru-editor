import ReactS3Client from 'react-aws-s3-typescript';

const config = {
    bucketName: 'geru-mn',
    region: 'ap-southeast-1',
    accessKeyId: 'AKIA6CN3AAERIVAJSMSV',
    secretAccessKey: 'hJG+YYJ9nRs17mSRRb3EenldCZZA9HofoCF5RXsC',
    // s3Url: 'https:/your-custom-s3-url.com/', /* optional */
}
/*  Notice that if you don't provide a dirName, the file will be automatically uploaded to the root of your bucket */

/* This is optional */
const S3_URL = 'geru-mn.s3-ap-southeast-1.amazonaws.com/'
const S3_PREV_URL = 'geru-mn.s3-ap-southeast-1.amazonaws.com/'//config.S3_PREV_URL
const S3_CLOUD_FRONT = 'https://d110hwq6svvzha.cloudfront.net/'

export function cloudFront(url) {
	if(!url || (typeof url) != 'string') return

	var S3_MATCHING_URL = S3_URL
	if(!url.split(S3_URL)[1]) {
		if(!url.split(S3_PREV_URL)[1]) {
			return url
		}
		S3_MATCHING_URL = S3_PREV_URL
	}

	const imageUrl = url.split(S3_MATCHING_URL)[1]

	return String(S3_CLOUD_FRONT + imageUrl)
}

export function request(params) {
    const instance = new ReactS3Client(Object.assign(config, params));
    return instance
    // ReactS3Client
    // .uploadFile(file, newFileName)
    // .then(data => console.log(data))
    // .catch(err => console.error(err))
} 