<div align="center">
  <h1>Actual Importer</h1>
  <p>Optimized for ING bank CSV exports</p>
</div>

This is was a simple web application to help import CSV files from a ING bank account into your [actual-server](https://github.com/actualbudget/actual-server). I made this application because ING decided to have a seperate column in their CSV export that specifies whether a payment is debit or credit, which was not supported by Actual. I did not want to have to edit the CSV files from my bank every time I want to import my bankstatements to actual so here is the solution. For a more integrated solution I created [a pull-request](https://github.com/actualbudget/actual/pull/1788) on the `actualbudget/actual` repository, which has been merged.

# Usage
If for some reason you still want to use this importer, there are two options to use this importer. Either pull the docker container from `ghcr.io/jessseee/actual-importer:main` or clone this repository and run `yarn install` and `yarn start` directly.

# Env variables
This application expects a couple of configurations from environment variables. These can either be set directly or put in the `.env` file.

- `SERVER_URL`: The URL of the actual-server you want the importer to connect to.
- `SYNC_ID`: The sync ID of the file you want to import to.
- `USER_PASSWORD`: The user password of your actual-server.
- `ENCRYPTION_PASSWORD`: The encryption password of your budget file.
