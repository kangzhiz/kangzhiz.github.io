module.exports = {
	publicPath: process.env.NODE_ENV === 'production'
		? 'https://kangzhiz.gitlab.io/'
		: '/',
	outputDir: 'docs'
};
