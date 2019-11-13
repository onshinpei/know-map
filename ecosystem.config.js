module.exports = {
    apps: [{
        name: "know-map",
        script: "./server.js",
        env: {
            "NODE_ENV": "development",
        },
        env_production: {
            "NODE_ENV": "production"
        }
    }]
}