
const startPage = (req, res) => {
    res.render('startPage',{
        pagina: 'Inicio'
    });
}

const categories = (req, res) =>{
    
}

const notFound = (req, res) =>{

}

const searchEngine = (req, res) =>{

}

export{
    startPage,
    categories,
    notFound,
    searchEngine
}