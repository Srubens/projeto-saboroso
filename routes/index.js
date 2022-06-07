var express = require('express');
var router = express.Router();
const conn = require('../inc/db')
const menus = require('../inc/menus')
var Swal = require('sweetalert2')
var reservations = require('./../inc/reservations')
var contacts = require('../inc/contacts')

/* GET home page. */
router.get('/', function(req, res, next) {

  menus.getMenus()
    .then(results =>{
      res.render('index', { 
        title: 'Restaurante Saboroso',
        menus:results,
        isHome:true
      });
    })
  
});

router.get('/menu', (req, res) =>{

  menus.getMenus()
    .then(results =>{
      res.render('menu', { 
        title: 'Menu - Restaurante Saboroso',
        background:'images/img_bg_1.jpg',
        h1:'Nosso Menu',
        menus:results ,
    
      });
    })
})

router.get('/services', (req, res) =>{
  res.render('services',{
    title:'Serviços - Restaurante Saboroso',
    background:'images/img_bg_1.jpg',
    h1:'Serviços',

  })
})

router.get('/contact', (req, res) =>{

  contacts.render(req, res)

})

router.post('/contact', (req, res) =>{

  console.log(req.body)
  
  if(!req.body.name){
    contacts.render(req, res, "Digite seu nome")
  }else if( !req.body.email ){
    contacts.render(req, res, "Digite seu email")
  }else if( !req.body.message ){
    contacts.render(req, res, "Digite sua mensagem")
  }else{
    contacts.save(req.body)
    .then(results =>{
      req.body = {}
      reservations.render(req, res,null, "Reserva feita com sucesso!")
      
    }).catch(err =>{
      console.log(err)
      reservations.render(req, res,err.message)
    })
  }

  // res.render('contact',{
  //   title:'Contato - Restaurante Saboroso',
  //   background:'images/img_bg_3.jpg',
  //   h1:'Entre em contato',

  // })

})

router.get('/reservation', (req, res, next) =>{
  reservations.render(req, res)
})

router.post('/reservation', (req, res) =>{
  if( !req.body.name ){
    reservations.render(req, res, "Digite seu nome")
  }else if( !req.body.email ){
    reservations.render(req, res,"Digite seu email!")
  }else if( !req.body.people ){
    reservations.render(req, res,"Informe a quantidade de pessoas")
  }else if( !req.body.date ){
    reservations.render(req, res,"Informe a data")
  }else if( !req.body.time ){
    reservations.render(req, res,"Informe o horario")
  }else{
    reservations.save(req.body)
      .then(results =>{
        req.body = {}
        reservations.render(req, res,null, "Reserva feita com sucesso!")
        
      }).catch(err =>{
        console.log(err)
        reservations.render(req, res,err.message)
      })
  }
  // res.send(req.body)
})

module.exports = router;
