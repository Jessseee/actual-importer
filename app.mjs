import * as dotenv from 'dotenv'
import * as api from '@actual-app/api'
import {parse} from 'csv-parse/sync'
import express from 'express'
import fileUpload from 'express-fileupload'

dotenv.config()

const header = [
    'date',
    'payee',
    'account',
    'counterparty',
    'code',
    'debit/credit',
    'amount',
    'type',
    'note',
]

function parseAmount(amount, flip) {
    amount = amount.replace(',', '.')
    amount = api.utils.amountToInteger(amount)
    amount = flip ? amount * -1 : amount
    return amount
}

function parseDate(date) {
    const year = date.slice(0, 4)
    const month = date.slice(4, 6)
    const day = date.slice(6, 8)
    return `${year}-${month}-${day}`
}

function parseRow(row) {
    row = Object.fromEntries(header.map((key, i) => [key, row[i]]))
    return {
        'payee_name': row['payee'],
        'date': parseDate(row['date']),
        'amount': row['amount'] = parseAmount(row['amount'], row['debit/credit'] === 'Debit'),
        'notes': row['note'],
    }
}

function parseFile(input) {
    const rows = parse(input,{ delimiter: ",", from_line: 2 })
    return rows.map(parseRow)
}
async function importTransactions(accountName, transactions) {
    const accounts = await api.getAccounts()
    const account = accounts.find(acc => acc.name === accountName)
    return await api.importTransactions(account.id, transactions)
}

await api.init({
    dataDir: 'data',
    serverURL: process.env.API_ENDPOINT,
    password: process.env.API_USER_PASS,
})

await api.downloadBudget(
    process.env.API_SYNC_ID,
    { password: process.env.API_ENCR_PASS }
)

const app = express()
app.set('views', './views');
app.set('view engine', 'pug');
app.use(express.static('./public'))
app.use(fileUpload());

app.get('/', (req, res) => {
    res.render('index')
})
app.post('/', async (req, res) => {
    req.files.files = !req.files.files.length
        ? [req.files.files]
        : req.files.files
    let transactions = []
    for(const file of req.files.files) {
        transactions = transactions.concat(parseFile(file.data.toString()))
    }
    console.log(transactions)
    try {
        await importTransactions("Personal Checking", transactions)
        res.status(200).end()
    } catch (e) {
        console.log(e)
        res.status(500).end()
    }
})
app.listen(parseInt(process.env.SERVER_PORT), () => {
    console.log(`Started app at http://localhost:${process.env.SERVER_PORT}`)
})

process.on('exit', async () => {
    await api.shutdown()
})