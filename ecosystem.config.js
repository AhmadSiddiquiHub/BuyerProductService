module.exports = {
    apps: [
        {
            name: "BuyerAuthService",
            script: "npm run dev",
            automation: false,
            args: "run dev",
            env: {
                NODE_ENV: "development"
            },
            env_production: {
                NODE_ENV: "production"
            }
        }
    ]
}