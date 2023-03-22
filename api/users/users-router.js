const express = require('express');

// `users-model.js` ve `posts-model.js` sayfalarına ihtiyacınız var
const UsersModel= require("./users-model");
const PostsModel=require("../posts/posts-model");
// ara yazılım fonksiyonları da gereklidir
const {
  validateUserId,
  validateUser,
  validatePost}=require("../middleware/middleware")

const router = express.Router();

router.get('/', async (req, res) => {
  // TÜM KULLANICILARI İÇEREN DİZİYİ DÖNDÜRÜN
  try {
    let allUsers = await UsersModel.get()
    res.json(allUsers)
  } catch(error){
    res.status(500).json({message:"Hata oluştu"})
  }
  
});

router.get('/:id', validateUserId, async (req, res) => {
  // USER NESNESİNİ DÖNDÜRÜN
  // user id yi getirmek için bir ara yazılım gereklidir
  res.json(req.user)
});

router.post('/', validateUser, async (req, res, next) => {
  // YENİ OLUŞTURULAN USER NESNESİNİ DÖNDÜRÜN
  // istek gövdesini doğrulamak için ara yazılım gereklidir.
  try {
    const instertedUser =await UsersModel.insert({name:req.name})
    res.status(201).json(instertedUser);
    next();
  }catch(error){
    next(error);
  }
});

router.put('/:id', validateUserId,validateUser, async (req, res, next) => {
  // YENİ GÜNCELLENEN USER NESNESİNİ DÖNDÜRÜN
  // user id yi doğrulayan ara yazılım gereklidir
  // ve istek gövdesini doğrulayan bir ara yazılım gereklidir.
  try{
    await UsersModel.update(req.params.id, {name:req.name})
    const updatedUser =await UsersModel.getById(req.params.id)
    res.status(201).json(updatedUser);
    next()
  }catch(error){
    next(error)
  }
});

router.delete('/:id', validateUserId, async (req, res, next) => {
  // SON SİLİNEN USER NESNESİ DÖNDÜRÜN
  // user id yi doğrulayan bir ara yazılım gereklidir.
try {
  await UsersModel.remove(req.params.id);
  res.json(req.user)
  next();
} catch(error){
  next(error) //hata yönetimini node.js'e bırakıyoruz. next yapmazsak kendimiz mesaj gircez
}
});

router.get('/:id/posts', validateUserId, async(req, res, next) => {
  // USER POSTLARINI İÇEREN BİR DİZİ DÖNDÜRÜN
  // user id yi doğrulayan bir ara yazılım gereklidir.
  try{
    const userPost = await UsersModel.getUserPosts(req.params.id)
    res.json(userPost);
  }catch(error){
    next(error)
  }
});

router.post('/:id/posts', validateUserId, validatePost, async(req, res, next) => {
  // YENİ OLUŞTURULAN KULLANICI NESNESİNİ DÖNDÜRÜN
  // user id yi doğrulayan bir ara yazılım gereklidir.
  // ve istek gövdesini doğrulayan bir ara yazılım gereklidir.
  try{
    const result=await PostsModel.insert({
      user_id:req.params.id,
      text:req.text
    })
    res.json(result)
  }catch(error){
    next(error)
  }
});

// routerı dışa aktarmayı unutmayın
module.exports=router;
