// PM2 process config — used when deploying without Docker.
// Start with: pm2 start ecosystem.config.cjs --env production
// Save process list: pm2 save
// Auto-start on reboot: pm2 startup (follow the printed command)

module.exports = {
  apps: [
    {
      name: "flower-shop",
      script: ".next/standalone/server.js",
      instances: "max",          // one per CPU core
      exec_mode: "cluster",
      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
        HOSTNAME: "127.0.0.1",   // nginx proxies; no need to bind to 0.0.0.0
      },
      // Restart policy
      max_restarts: 10,
      restart_delay: 3000,
      // Log rotation (requires pm2-logrotate module)
      error_file: "./logs/err.log",
      out_file:   "./logs/out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
    },
  ],
};
