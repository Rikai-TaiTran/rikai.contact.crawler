const { Toiawase, ToiawaseHistory } = require("../models");
const { Op } = require("sequelize");

const stringToBool = (str) => str.toLowerCase() === "true";

// Lấy danh sách tất cả Toiawase
exports.getAllToiawase = async (req, res) => {
  try {
    const {
      page = 1, // mặc định là trang đầu tiên
      pageSize = 10, // mặc định 10 bản ghi mỗi trang
      createdDateFrom,
      createdDateTo,
      crawlSource,
      isBlackList,
    } = req.query;

    // Cài đặt offset và limit cho phân trang
    const offset = (page - 1) * pageSize;
    const limit = parseInt(pageSize);

    // Xây dựng điều kiện lọc
    const whereClause = {};

    if (createdDateFrom && createdDateTo) {
      whereClause.createdAt = {
        [Op.between]: [new Date(createdDateFrom), new Date(createdDateTo)],
      };
    } else if (createdDateFrom) {
      whereClause.createdAt = {
        [Op.gte]: new Date(createdDateFrom),
      };
    } else if (createdDateTo) {
      whereClause.createdAt = {
        [Op.lte]: new Date(createdDateTo),
      };
    }

    if (crawlSource) {
      whereClause.crawlSource = crawlSource;
    }

    if (isBlackList !== undefined) {
      whereClause.isBlacklist = stringToBool(isBlackList);
    }

    // Tìm kiếm Toiawase với các điều kiện lọc, phân trang và bao gồm lịch sử liên quan
    const { count, rows: toiawases } = await Toiawase.findAndCountAll({
      where: whereClause,
      include: [{ model: ToiawaseHistory, as: "toiawaseHistories" }],
      limit,
      offset,
    });

    // Trả về dữ liệu với thông tin phân trang
    res.json({
      data: toiawases,
      pagination: {
        currentPage: parseInt(page),
        pageSize: limit,
        totalRecords: count,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error fetching toiawase" });
  }
};

exports.detailToiawase = async (req, res) => {
  const { id } = req.params;
  try {
    const toiawase = await Toiawase.findByPk(id, {
      include: [{ model: ToiawaseHistory, as: "toiawaseHistories" }],
    });
    if (!toiawase) {
      return res.status(404).json({ error: "Toiawase not found" });
    }
    res.json(toiawase);
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: "Error deleting Toiawase" });
  }
};

// Tạo Toiawase mới
exports.createToiawase = async (req, res) => {
  try {
    const {
      businessActivities,
      companyAddress,
      companyName,
      companySize,
      companyWebsite,
      crawlSource,
      isBlackList,
    } = req.body;
    const newToiawase = await Toiawase.create({
      businessActivities,
      companyAddress,
      companyName,
      companySize,
      companyWebsite,
      crawlSource,
      isBlackList,
    });
    res.status(201).json(newToiawase);
  } catch (error) {
    res.status(500).json({ error: "Error creating toiawase" });
  }
};

// Cập nhật Toiawase
exports.updateToiawase = async (req, res) => {
  const { id } = req.params;
  const {
    businessActivities,
    companyAddress,
    companyName,
    companySize,
    companyWebsite,
    crawlSource,
    isBlackList,
  } = req.body;
  try {
    const toiawase = await Toiawase.findByPk(id);
    if (!toiawase) {
      return res.status(404).json({ error: "Toiawase not found" });
    }
    await toiawase.update({
      businessActivities,
      companyAddress,
      companyName,
      companySize,
      companyWebsite,
      crawlSource,
      isBlackList,
    });
    res.json(toiawase);
  } catch (error) {
    res.status(500).json({ error: "Error updating toiawase" });
  }
};

// Xóa Toiawase
exports.deleteToiawase = async (req, res) => {
  const { id } = req.params;
  try {
    const toiawase = await Toiawase.findByPk(id);
    if (!toiawase) {
      return res.status(404).json({ error: "Toiawase not found" });
    }
    await toiawase.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Error deleting toiawase" });
  }
};
