const classModel = require('../models/class');

const getById = async (id) => {
    try {
        let fetchClass = await classModel.findOne({ _id: id }).populate('sections').exec();
        if (
            fetchClass !== undefined &&
            fetchClass !== null
        ) {
          return fetchClass;
        }
        return null; 
    } catch (error) {
        throw 'Get Class By Id not working';  
    }
}

module.exports = { getById };