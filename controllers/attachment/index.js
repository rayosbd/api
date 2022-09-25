const { default: mongoose } = require("mongoose");
const Attachment = require("../../model/Attachment");
const fs = require("fs");

exports.saveAttachment = async (req, res, next) => {
  let attachmentList = req.files
    ? req.files.map((file) => {
        return {
          mimetype: file.mimetype,
          filename: file.filename,
          size: file.size,
        };
      })
    : [];

  console.log(attachmentList);

  const attachment = await Attachment.insertMany(attachmentList);

  res.status(201).json({
    success: true,
    message: "Image Uploaded Successfully",
    data: attachment,
  });
};

exports.previewAttachment = async (req, res, next) => {
  // Get Values
  const { attachment_id } = req.params;
  // mongoose.Types.ObjectId.isValid(id)
  if (!attachment_id || !mongoose.Types.ObjectId.isValid(attachment_id))
    res.status(404).send();

  try {
    const attachment = await Attachment.findById(attachment_id);

    if (!attachment) next(new ErrorResponse("No attachment found", 404));

    console.log(attachment);

    let imageBuffer = fs.readFileSync("../file_bucket/" + attachment.filename);
    res.setHeader("Content-Type", attachment.mimetype);
    res.send(imageBuffer);

    // On Error
  } catch (error) {
    // Send Error Response
    res.status(404).send();
  }
};

exports.previewAttachmentInfo = async (req, res, next) => {
  // Get Values
  const { attachment_id } = req.params;
  // mongoose.Types.ObjectId.isValid(id)
  if (!attachment_id || !mongoose.Types.ObjectId.isValid(attachment_id))
    next(new ErrorResponse("Please provide valid attachment id", 400));

  try {
    const attachment = await Attachment.findById(attachment_id);

    if (!attachment) next(new ErrorResponse("No attachment found", 404));

    res.status(200).json({
      success: true,
      data: attachment,
    });

    // On Error
  } catch (error) {
    // Send Error Response
    next(error);
  }
};

exports.previewAttachmentInfoList = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: "Attachments list fetched successfully",
      data: await Attachment.find(),
      total: await Attachment.find().count(),
    });

    // On Error
  } catch (error) {
    // Send Error Response
    next(error);
  }
};
