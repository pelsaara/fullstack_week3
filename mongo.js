const mongoose = require('mongoose')

// ÄLÄ LAITA SALASANAA GITHUBIIN 'mongodb://kayttaja:salasana@ds135186.mlab.com:35186/fs-phonebook'
const url = 'mongodb://kayttaja:salasana@ds135186.mlab.com:35186/fs-phonebook'

mongoose.connect(url)

const Person = mongoose.model('Person', {
    name: String,
    number: String
})

if (process.argv[2] && process.argv[3]) {
    const person = new Person({
        name: process.argv[2],
        number: process.argv[3]
    })

    person
        .save()
        .then(result => {
            console.log(`Lisätään henkilö ${process.argv[2]} numerolla ${process.argv[3]} luetteloon`);
            mongoose.connection.close()
        })
} else {
    Person
    .find({})
    .then(result => {
        console.log('Puhelinluettelo:');
        result.forEach(person => {
            console.log(person.name + ' ' + person.number)
        })
        mongoose.connection.close()

    })
}