const IMAGE_BASE_URL: string = process.env.NODE_ENV === 'production'
  ? 'https://s3.eu-north-1.amazonaws.com'
  : 'http://localhost:9000/insurances-img';

export default IMAGE_BASE_URL;