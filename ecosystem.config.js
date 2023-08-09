module.exports = {
    apps: [
      {
        name: "m2m-node-mqtt",
        script: "./app.js",
        max_memory_restart: "900M",
  
        // Logging
        /*
        out_file: "./out.log",
        error_file: "./error.log",
        merge_logs: true,
        log_date_format: "DD-MM HH:mm:ss Z",
        log_type: "json",
        */
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
  