const router = require('express').Router()
const Post = require("../models/Post")
const User = require("../models/User")
//create a post

router.post("/", async(req, res)=>{
    const newPost = new Post(req.body)
    try {
        const savePost = await newPost.save()
        res.status(200).json(savePost)
        return
    } catch (error) {
        return res.status(500).json(error)
    }
})

//like a post
router.put("/:id/like", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        const user = await User.findOne({ _id: req.body.userId })
        console.log(user)
        if(!user || !post)
        {
            res.status(404).json("Invalid like operation")
            return
        }
        if (!post.likes.includes(req.body.userId)) {
        await post.updateOne({ $push: { likes: req.body.userId } });
        res.status(200).json("The post has been liked");
        return
        } else {
        await post.updateOne({ $pull: { likes: req.body.userId } });
        res.status(200).json("The post has been disliked");
        return

        //have to handle invalid users
        }
    } catch (err) {
        return res.status(500).json(err);
    }
});
//update a post
router.put("/:id", async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
        if(!post)
            return res.status(404).json("invalid post")
      if (post.userId === req.body.userId) {
        await post.updateOne({ $set: req.body });
        res.status(200).json("the post has been updated");
        return
      } else {
        return res.status(403).json("you can update only your post")
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  })
//delete a post
router.delete("/:id", async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if(!post)
      {
          res.status(404).json("post not found")
          return
      }
      if (post.userId === req.body.userId) {
        await post.deleteOne();
        res.status(200).json("the post has been deleted");
      } else {
        res.status(403).json("you can delete only your post");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
//get a post

router.get("/:id", async (req, res) => {
    try {
      const post = await Post.findById(req.params.id)
      if(!post) return res.status(404).json("post not found")
      res.status(200).json(post);
      return
    } catch (err) {
      res.status(500).json(err);
    }
  });

//get all timeline posts
router.get("/timeline/:userId", async (req, res) => {
    try {
      const currentUser = await User.findById(req.params.userId);
      const userPosts = await Post.find({ userId: currentUser._id });
      //have to get more understanding of Promise and map
      const friendPosts = await Promise.all(
        currentUser.followings.map((friendId) => {
          return Post.find({ userId: friendId });
        })
      );
      // ... is also known as spread syntax in javascript Spread syntax can be used when all elements from an object or array need to be included in a list of some kind.
      res.status(200).json(userPosts.concat(...friendPosts).sort((b, a) => {
          return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
        }))
    } catch (err) {
      res.status(500).json(err);
    }
  });


module.exports = router