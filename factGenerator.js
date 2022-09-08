const {createClient} = require('pexels')
const Jimp = require('jimp')
const fs = require('fs')
const {facts} = require('./facts');
const { randomInt } = require('crypto');
const { jimpEvChange } = require('@jimp/core');


async function generateImage(imagePath) {
    let facts = randomFact();
    let photo = await getRandomImage(facts.animal)
    await editImage(photo, imagePath, facts.fact)
}


function randomFact() {
    return facts[randomInteger(0, (facts.length - 1))]
}

function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1 )) + min
}

async function getRandomImage(animal) {
    try{
        const client = createClient(process.env.PEXELS_API_KEY)
        const query = animal
        let image

        await client.photos.search({query, per_page: 10}).then(res => {
            let images = res.photos
            image = images[randomInteger(0, (images.length - 1))]
        })

        return image
    }

    catch(e){
        console.log('error download gambar', err)
        getRandomImage(animal)
    }
}


async function editImage(image, imagePath, fact) {
    try {
        let imgURL = image.src.medium
        let animalImage = await Jimp.read(imgURL).catch(error => console.log(error))
        let animalImageWidth = animalImage.bitmap.width
        let animalImageHeight = animalImage.bitmap.height
        let imgDarkener = await new Jimp(animalImageWidth, animalImageHeight, '#000000')
        imgDarkener - await imgDarkener.opacity(0.5)
        animalImage = await animalImage.composite(imgDarkener, 0, 0)

        let posX = animalImageWidth / 15
        let posY = animalImageHeight / 15
        let maxWidth = animalImageWidth - (posX * 2)
        let maxHeight = animalImageHeight - posY 
        let font = await Jimp.loadFont(Jimp.FONT_SANS_16_WHITE)
        await animalImage.print(font, posX, posY, {
            text: fact,
            alignmentX : Jimp.HORIZONTAL_ALIGN_CENTER,
            alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
        }, maxWidth, maxHeight)

        await animalImage.writeAsync(imagePath)
        console.log('Berhasil Load Gambar')

        
    }
    catch(e){
        console.log('error auditing gambar', e)
    }
}


const deleteImage = (imagePath) => {
    fs.unlink(imagePath, (err) => {
        if(err){
            return console.log(err)
        }
    console.log('file berhasil di hapus')
    })
}


module.exports = {generateImage, deleteImage}