const express = require('express')
const nunjucks = require('nunjucks')

const meuapp = express()

/* Configurar o nunjucks para sempre que o servidor for restartado pelo
nodemon, configurar automaticamente essa propriedades */
nunjucks.configure('views', {
  autoescape: true, // faz um autoescape no parâmetros automaticamente
  express: meuapp, // armazenar o servidor express
  watch: true // atualiza automaticamente um arquivo sempre que ele for alterado
})

// para o express saber lidar com dados que são provenientes de formulários
meuapp.use(express.urlencoded({ extended: true }))

// setar configuração global para a extensão dos arquivos nunjucks
meuapp.set('view engine', 'njk')

/* Verifica se Query Params age está presente ou não na requisição, caso esteja,
prossegue com o fluxo normalmente, em caso contrário redireiciona para a
rota inicial da aplicação. */
const logMiddleware = (req, res, next) => {
  if (req.query.hasOwnProperty('age')) return next()
  else {
    console.log('O campo age não está presente na requisição')
    res.redirect('/')
  }
}

meuapp.get('/', (req, res) => {
  return res.render('idade')
})

meuapp.get('/major', logMiddleware, (req, res) => {
  return res.render('major', req.query)
})

meuapp.get('/minor', logMiddleware, (req, res) => {
  return res.render('minor', req.query)
})

meuapp.post('/check', (req, res) => {
  const idade = req.body.age
  const url = require('url')

  if (idade >= 18) return res.redirect(configurarDados('/major'))
  else if (idade < 18) return res.redirect(configurarDados('/minor'))

  function configurarDados (path) {
    return url.format({
      pathname: path,
      query: {
        age: idade
      }
    })
  }
})

meuapp.listen(3002)
