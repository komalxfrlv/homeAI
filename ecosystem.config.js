module.exports = {
    apps: [
      {
        name: "m2m-node-monolith",
        script: "./app.js",
        instances: 4,
        max_memory_restart: "900M",
  
        // Logging
        out_file: "./out.log",
        error_file: "./error.log",
        merge_logs: true,
        log_date_format: "DD-MM HH:mm:ss Z",
        log_type: "json",
  
        // Env Specific Config
        env_production: {
          NODE_ENV: "production",
          PORT: 5000,
          exec_mode: "cluster_mode",
        },
        env_development: {
          NODE_ENV: "development",
          PORT: 5000,
          watch: true,
          watch_delay: 10000,
          ignore_watch: [
            "./node_modules",
            "./app/views",
            "./public",
            "./.DS_Store",
            "./package.json",
            "./yarn.lock",
            "./samples",
            "./src"
          ],
        },
      },
    ],
    deploy : {
        production : {
          user : 'SSH_USERNAME',
          host : 'SSH_HOSTMACHINE',
          ref  : 'origin/master',
          repo : 'GIT_REPOSITORY',
          path : 'DESTINATION_PATH',
          'pre-deploy-local': '',
          'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
          'pre-setup': ''
        }
      }
  };
  