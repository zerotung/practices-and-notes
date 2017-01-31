module.exports = {
    entry: './src/main.js',
    output: {
        path: __dirname + '/dist',
        filename: 'bundle.js'
    },
    module: {
        loader: [{
            test: /\.css$/,
            loaders: ['style', 'css']
        }, {
            test: /\.js$/,
            loaders: ['babel', 'uglify'],
            query: {
                cacheDirectory: true,
                presets: ['es2015', 'stage-2']
            }
        }]
    }
};