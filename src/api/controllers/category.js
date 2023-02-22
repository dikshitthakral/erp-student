const category = require('../models/category');
const mongoose = require('mongoose');

const save = async (req, res) => {
    try {
        const { categoryName, branch, description } = req.body;
        if(categoryName === null || categoryName === '' || categoryName === undefined) {
            return res.status(400).json({
                message: "Empty Fields found. Branch name is missing",
                success: false,
            });
        }
        let categoryObject = {
            categoryName
        }
        if(branch !== null && branch !== '' && branch !== undefined){
            categoryObject['branch'] = branch;
        }
        if(description !== null && description !== '' && description !== undefined){
            categoryObject['description'] = description;
        }
        let categoryResponse = await category.create(categoryObject);
        return res.status(200).json({
            category: categoryResponse,
            message: "Added New Category Successfully",
            success: true,
        });
    }catch(err) {
        return res.status(500).json({ message: err.message, success: false });
    }
};

const getAll = async (req, res) => {
    try {
        let categories = await category.find();
        if (
            categories !== undefined &&
            categories.length !== 0 &&
            categories !== null
        ) {
          return res.status(200).send({
            categories ,
            messge: "All Categories",
            success: true,
          });
        } else {
          return res.status(200).send({
            messge: "Categories does not exist",
            success: false,
          });
        }
      } catch (error) {
        return res.status(400).send({
          messge: "Somethig went wrong",
          success: false,
        });
      }
}

const remove = async (req, res) => {
    try {
        const id = req.params['id'];
        if (!id) {
          return res.status(200).json({
            message: "Category Id Not found",
            success: false,
          });
        } else if (id !== undefined && id !== null && id !== "") {
          let deleteCategory = await category.deleteOne({ _id: id });
          if (
            deleteCategory["deletedCount"] === 0 ||
            deleteCategory === null ||
            deleteCategory === undefined
          ) {
            return res.status(404).json({
              id,
              message: "Category Not found ",
              success: true,
            });
          } else if (
            deleteCategory["deletedCount"] === 1 ||
            deleteCategory !== null ||
            deleteCategory !== undefined
          ) {
            return res.status(200).json({
              id,
              message: "Category Deleted Successfully !!! ",
              success: true,
            });
          }
        }
      } catch (error) {
        return res.status(500).json({
          message: "Something went wrong",
          success: false,
        });
      }
}

const update = async (req, res) => {
    try{
      const { id, categoryName, branch, description } = req.body;
      if (
        id !== "" &&
        id !== undefined &&
        id !== null 
      ){
        const categoryObj = await category.findById({ _id: mongoose.Types.ObjectId(id) });
        if(categoryObj === null || categoryObj === undefined || categoryObj === '') {
            return res.status(400).json({
                message: "Category not found in system",
                success: true,
              });
        }
        const updateCategoryObj = {};
        updateCategoryObj.categoryName = categoryName !== null && categoryName !== undefined && categoryName !== '' ? categoryName : categoryObj.categoryName;
        updateCategoryObj.branch = branch !== null && branch !== undefined && branch !== '' ? branch : categoryObj.branch;
        updateCategoryObj.description = description !== null && description !== undefined && description !== '' ? description : categoryObj.description;
        let updateCategory = await category.findOneAndUpdate(
            { _id: id },
            updateCategoryObj
        );
        if (
            updateCategory.length === 0 ||
            updateCategory === undefined ||
            updateCategory === null ||
            updateCategory === ""
          ) {
              return res.status(200)
                  .json([{ msg: "Category not found!!!", res: "error", }]);
          }
          return res.status(200).json({
            message: "Category updated Successfully",
            success: true,
          });
      
      } else {
        return res.status(200).json({
          message: "Empty Field found. All field are required !!!",
          success: false,
        });
      }
  
    }catch(err){
      return res.status(500).json({
        message: "Something went wrong",
        success: false,
      });
    }
}

module.exports = { save, getAll, remove, update };