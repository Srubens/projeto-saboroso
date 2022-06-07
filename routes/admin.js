var express = require("express")
var router = express.Router()
var users = require('./../inc/users')
var admin = require('./../inc/admin')
var menus = require('./../inc/menus')

/**
 * Middleware
 */
router.use((req, res, next)=>{
    console.log("Middleware: ", req.url)
    if(['/login'].indexOf(req.url) === -1 && !req.session.user ){
        res.redirect('/admin/login')
    }else{
        next()
    }

})

router.use((req, res, next) =>{
    req.menus = admin.getMenus(req)
    next()
})

router.get('/logout',(req, res) =>{

    delete req.session.user
    res.redirect("/admin")

})

router.get('/',(req, res) =>{

    admin.dashboard()
        .then(data =>{
            res.render('admin/index',admin.getParams(req,{
                data
            }))
        }).catch(err =>{
            console.log(err)
        })

})

router.get('/login',(req, res) =>{


    users.render(req, res, null)

    /**
     * PARA PEGAR A SESSAO DO USUARIO
     */
    // if( !req.session.views ) req.session.views = 0

    //console.log("Session:" + req.session.views++)

    // res.render('admin/login')
})

router.post('/login',(req, res) =>{
    if(!req.body.email){
        users.render(req, res, "Preencha o campo email!")
    }else if(!req.body.password){
        users.render(req, res, "Preencha o campo senha!")
    }else{
        users.login(req.body.email, req.body.password)
            .then(user =>{
                req.session.user = user
                res.redirect('/admin')
            }).catch(err =>{
                users.render(req, res, err.message || err)
            })
    }
})

router.get('/contacts',(req, res) =>{
    res.render('admin/contacts',admin.getParams(req))
})

router.get('/emails',(req, res) =>{
    res.render('admin/emails',admin.getParams(req))
})

router.get('/menus',(req, res) =>{

    menus.getMenus()
        .then(data=>{
            res.render("admin/menus", admin.getParams(req,{
                data
            }))
        })

})

router.post('/menus', (req, res) =>{
    console.log(req.body)
    res.send(req.body)

})

router.get('/reservations',(req, res) =>{
    res.render('admin/reservations',admin.getParams(req, {
        date:{}
    }))
})

router.get('/users',(req, res) =>{
    res.render('admin/users', admin.getParams(req))
})

module.exports = router