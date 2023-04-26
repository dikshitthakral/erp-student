const sectionModel = require('../models/section');

const getById = async (id) => {
    try {
        let fetchSection = await sectionModel.findOne({ _id: id });
        if (
            fetchSection !== undefined &&
            fetchSection.length !== 0 &&
            fetchSection !== null
        ) {
          return fetchSection;
        } 
        return null;
    } catch (error) {
        return res.status(400).send({
          messge: "Something went wrong",
          success: false,
        });
    }
}

module.exports = { getById };