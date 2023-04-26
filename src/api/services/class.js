const classModel = require('../models/class');

const getById = async (id) => {
    try {
        let fetchClass = await classModel.findOne({ _id: id }).populate('sections').exec();
        if (
            fetchClass !== undefined &&
            fetchClass.length !== 0 &&
            fetchClass !== null
        ) {
          return fetchClass;
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