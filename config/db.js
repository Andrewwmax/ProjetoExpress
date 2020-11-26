if (process.env.NODE_ENV == 'production') {
    module.exports = { mongoURI: 'mongodb+srv://Andreww:6Gyr7YZTqP8GGl5L@sparrowcluster.onm92.mongodb.net/blogapp?retryWrites=true&w=majority'}
} else {
    module.exports = { mongoURI: 'mongodb://localhost/blogapp'}
}