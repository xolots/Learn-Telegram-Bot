const { Telegraf } = require('telegraf')
const { v4: uuidV4 } = require('uuid')
require('dotenv').config()
let factGenerator = require('./factGenerator')

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => ctx.reply('Harap Gunakan Command /fakta untuk melihat fakta baru'));

bot.command('fact', async (ctx) => {
    try {
        ctx.reply('Mengambil Gambar, Mohon Tunggu !!!')
        let imagePath = `./temp/${uuidV4()}.jpg`
        await factGenerator.generateImage(imagePath)
        await ctx.replyWithPhoto({ source: imagePath })
        factGenerator.deleteImage(imagePath)
    } catch (error) {
        console.log('error', error)
        ctx.reply('Gagal Mengirim Gambar')
    }
})

bot.command('gambar', (ctx) => {
    ctx.replyWithPhoto('https://picsum.photos/200/300/');

})



        bot.launch();



    // Enable graceful stop
    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));