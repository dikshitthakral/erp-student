const { award } = require('../../models/humanResources/index');
const mongoose = require('mongoose');
const { isEmpty, sumBy } = require('lodash');

const create = async (req, res) => {
    try {
        const { employee, student, designation, name, giftItem, cashPrice, awardReason, givenDate} = req.body;

        if(isEmpty(designation) || isEmpty(name) || isEmpty(giftItem) || isEmpty(awardReason) || isEmpty(givenDate)) {
            return res.status(400).send({
                messge: "Mandatory fields missing while creating Salary Template",
                success: false,
            });
        }
        if(designation === 'Student' && isEmpty(student)) {
            return res.status(400).send({
                messge: "Please provide Student Id when designation is student",
                success: false,
            });
        }
        if(designation !== 'Student' && isEmpty(employee)) {
            return res.status(400).send({
                messge: "Please provide Employee Id when designation is not student",
                success: false,
            });
        }
        const awardObj = {
            designation,
            name,
            giftItem,
            cashPrice : isNaN(cashPrice) ? 0 : cashPrice,
            awardReason,
            givenDate,
            employee: designation !== 'Student' ? employee : undefined,
            student: designation === 'Student' ? student : undefined
        };

        const newAward= await award.create(awardObj);
        return res.status(200).json({
            award: newAward,
            message: "Added New Award Successfully",
            success: true,
        });
    }catch (err) {
        return res.status(400)
            .json([{ msg: err.message, res: "error" }]);
    }
}

const getAll = async (req, res) => {
    try {
        let allAwards = await award.find().populate('employee').populate('student');
        if (
            allAwards !== undefined &&
            allAwards.length !== 0 &&
            allAwards !== null
        ) {
          return res.status(200).send({
            awards: allAwards,
            messge: "All Awards",
            success: true,
          });
        } else {
          return res.status(200).send({
            messge: "Awards does not exist",
            success: false,
          });
        }
      } catch (error) {
        return res.status(400).send({
          messge: "Something went wrong",
          success: false,
        });
      }
}

const remove = async (req, res) => {
    try {
        const id = req.params['id'];
        if (!id) {
          return res.status(200).json({
            message: "Award Id not found",
            success: false,
          });
        } else if (id !== undefined && id !== null && id !== "") {
          const deleteAward = await award.deleteOne({ _id: id });
          if (
            deleteAward["deletedCount"] === 0 ||
            deleteAward === null ||
            deleteAward === undefined
          ) {
            return res.status(404).json({
              id,
              message: "Award Not found ",
              success: true,
            });
          } else if (
            deleteAward["deletedCount"] === 1 &&
            deleteAward !== null &&
            deleteAward !== undefined
          ) {
            return res.status(200).json({
              id,
              message: "Award Deleted Successfully !!! ",
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
    try {
        const { awardId, employee, student, designation, name, giftItem, cashPrice, awardReason, givenDate} = req.body;
        const updateObject = {}
        if(!isEmpty(designation) && designation === 'Student' && isEmpty(student)) {
            return res.status(400).send({
                messge: "Please provide Student Id when designation is student",
                success: false,
            });
        }
        if(!isEmpty(designation) && designation !== 'Student' && isEmpty(employee)) {
            return res.status(400).send({
                messge: "Please provide Employee Id when designation is not student",
                success: false,
            });
        }
        const awardRecord = await award.findOne({_id: mongoose.Types.ObjectId(awardId)});

        updateObject["designation"] = !isEmpty(designation) ? designation : awardRecord.designation;
        updateObject["name"] = !isNaN(name) ? name : awardRecord.name;
        updateObject["cashPrice"] = !isNaN(cashPrice) && cashPrice > 0 ? cashPrice: awardRecord.cashPrice;
        updateObject["giftItem"] = !isEmpty(giftItem) ? giftItem : awardRecord.giftItem;
        updateObject["awardReason"] = !isEmpty(awardReason) ? awardReason : awardRecord.awardReason;
        updateObject["givenDate"] = !isEmpty(givenDate) ? givenDate : awardRecord.givenDate;
        updateObject["employee"] = !isEmpty(designation)  && designation !== 'Student' ? employee : null;
        updateObject["student"] = !isEmpty(designation) && designation === 'Student' ? student : null;

        let updateAward = await award.findOneAndUpdate(
            { _id: awardId },
            {
                $set: updateObject
            }
        );
        if (
            updateAward.length === 0 ||
            updateAward === undefined ||
            updateAward === null ||
            updateAward === ""
        ) {
            return res.status(200)
                .json([{ msg: "Award not found!!!", res: "error", }]);
        } else {
            const awardData = await award.findOne({ _id: awardId }).populate('employee').populate('student');
            return res.status(200)
                .json([{ msg: "Award updated successflly", data: awardData, res: "success" }]);
        }
    } catch (error) {
        return res.status(400).send({
          messge: "Somethig went wrong",
          success: false,
        });
    }
}

module.exports = { create, getAll, remove, update }