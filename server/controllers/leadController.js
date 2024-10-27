const {
  Lead,
  LeadSource,
  LeadStatus,
  ContactChannel,
  User,
  LeadType,
} = require("../models");
const { Op } = require("sequelize");

// Lấy danh sách tất cả Leads
exports.getAllLeads = async (req, res) => {
  try {
    const {
      page = 1, // mặc định trang đầu tiên
      pageSize = 10, // mặc định 10 bản ghi mỗi trang
      search,
      leadClassification,
      leadStatus,
      leadSource,
    } = req.query;

    // Cài đặt offset và limit cho phân trang
    const offset = (page - 1) * pageSize;
    const limit = parseInt(pageSize);

    // Xây dựng điều kiện lọc
    const whereClause = {};

    if (search) {
      whereClause.fullName = { [Op.like]: `%${search}%` };
    }
    if (leadClassification) {
      whereClause.leadTypeId = leadClassification;
    }
    if (leadStatus) {
      whereClause.leadStatusId = leadStatus;
    }
    if (leadSource) {
      whereClause.leadSourceId = leadSource;
    }

    // Tìm kiếm Leads với các điều kiện lọc, phân trang và bao gồm các bảng liên kết
    const { count, rows: leads } = await Lead.findAndCountAll({
      where: whereClause,
      include: [
        { model: LeadSource, as: "leadSource" },
        { model: LeadStatus, as: "leadStatus" },
        { model: ContactChannel, as: "contactChannel" },
        { model: User, as: "user" },
        { model: LeadType, as: "leadType" },
      ],
      limit,
      offset,
    });

    // Trả về dữ liệu với thông tin phân trang
    res.json({
      data: leads,
      pagination: {
        currentPage: parseInt(page),
        pageSize: limit,
        totalRecords: count,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error fetching leads" });
  }
};

exports.detailLead = async (req, res) => {
  const { id } = req.params;
  try {
    const lead = await Lead.findByPk(id, {
      include: [
        { model: LeadSource, as: "leadSource" },
        { model: LeadStatus, as: "leadStatus" },
        { model: ContactChannel, as: "contactChannel" },
        { model: User, as: "user" },
        { model: LeadType, as: "leadType" },
      ],
    });
    if (!lead) {
      return res.status(404).json({ error: "Lead not found" });
    }
    res.json(lead);
  } catch (error) {
    res.status(500).json({ error: "Error detail lead" });
  }
};

// Tạo Lead mới
exports.createLead = async (req, res) => {
  try {
    const {
      fullName,
      initialContactChannel,
      position,
      phone,
      notes,
      leadStatus,
      leadSource,
      leadOwner,
      lastContactDate,
      email,
      countryRegion,
      companyWebsite,
      companyName,
      companyAddress,
      leadClassification,
    } = req.body;
    const newLead = await Lead.create({
      fullName,
      email,
      phoneNumber: phone,
      companyName,
      position,
      company_website: companyWebsite,
      company_address: companyAddress,
      country: countryRegion,
      leadSourceId: leadSource,
      leadStatusId: leadStatus,
      contactChannelId: initialContactChannel,
      note: notes,
      assignedUserId: leadOwner,
      leadTypeId: leadClassification,
      lastContactDate: lastContactDate,
    });
    res.status(201).json(newLead);
  } catch (error) {
    res.status(500).json({ error: "Error creating lead" });
  }
};

// Cập nhật Lead
exports.updateLead = async (req, res) => {
  const { id } = req.params;
  try {
    const lead = await Lead.findByPk(id);
    if (!lead) {
      return res.status(404).json({ error: "Lead not found" });
    }
    const {
      fullName,
      initialContactChannel,
      position,
      phone,
      notes,
      leadStatus,
      leadSource,
      leadOwner,
      lastContactDate,
      email,
      countryRegion,
      companyWebsite,
      companyName,
      companyAddress,
      leadClassification,
    } = req.body;
    await lead.update({
      fullName,
      email,
      phoneNumber: phone,
      companyName,
      position,
      company_website: companyWebsite,
      company_address: companyAddress,
      country: countryRegion,
      leadSourceId: leadSource,
      leadStatusId: leadStatus,
      contactChannelId: initialContactChannel,
      note: notes,
      assignedUserId: leadOwner,
      leadTypeId: leadClassification,
      lastContactDate: lastContactDate,
    });
    res.json(lead);
  } catch (error) {
    res.status(500).json({ error: "Error updating lead" });
  }
};

// Xóa Lead
exports.deleteLead = async (req, res) => {
  const { id } = req.params;
  try {
    const lead = await Lead.findByPk(id);
    if (!lead) {
      return res.status(404).json({ error: "Lead not found" });
    }
    await lead.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Error deleting lead" });
  }
};

exports.getLeadStatisticsByStatus = async (req, res) => {
  try {
    // Lấy tất cả các trạng thái của lead
    const leadStatuses = await LeadStatus.findAll({
      order: [["id", "ASC"]], // Sắp xếp theo ID (hoặc có thể theo thuộc tính khác nếu cần)
    });

    // Tạo một mảng để lưu trữ số lượng lead theo trạng thái
    const statistics = [];

    // Duyệt qua từng trạng thái và đếm số lượng lead tương ứng
    for (const status of leadStatuses) {
      const count = await Lead.count({
        where: {
          leadStatusId: status.id,
        },
      });
      statistics.push({
        name: status.name, // Lấy tên trạng thái
        count: count.toString(), // Chuyển số lượng thành chuỗi
      });
    }

    // Trả về kết quả theo định dạng mong muốn
    res.json({ data: statistics });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error fetching lead statistics" });
  }
};

exports.getLeadStatisticsByType = async (req, res) => {
  try {
    // Lấy tất cả các loại lead
    const leadTypes = await LeadType.findAll({
      order: [["id", "ASC"]], // Sắp xếp theo ID (hoặc có thể theo thuộc tính khác nếu cần)
    });

    // Tạo một mảng để lưu trữ số lượng lead theo loại
    const statistics = [];

    // Duyệt qua từng loại và đếm số lượng lead tương ứng
    for (const type of leadTypes) {
      const count = await Lead.count({
        where: {
          leadTypeId: type.id,
        },
      });
      statistics.push({
        name: type.name, // Lấy tên loại lead
        count: count.toString(), // Chuyển số lượng thành chuỗi
      });
    }

    // Trả về kết quả theo định dạng mong muốn
    res.json({ data: statistics });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error fetching lead type statistics" });
  }
};

exports.getLeadStatisticsByOwner = async (req, res) => {
  const { period } = req.query; // Nhận tham số khoảng thời gian từ query

  try {
    // Định nghĩa khoảng thời gian dựa trên tham số
    let startDate, endDate;
    const today = new Date();

    switch (period) {
      case "this_month":
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = new Date(
          today.getFullYear(),
          today.getMonth() + 1,
          0,
          23,
          59,
          59
        );
        break;

      case "last_month":
        startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        endDate = new Date(
          today.getFullYear(),
          today.getMonth(),
          0,
          23,
          59,
          59
        );
        break;

      case "last_quarter":
        const lastQuarter = Math.floor((today.getMonth() - 1) / 3);
        const lastQuarterMonth = lastQuarter * 3 + 1; // Bắt đầu tháng của quý trước
        startDate = new Date(today.getFullYear(), lastQuarterMonth - 1, 1);
        endDate = new Date(
          today.getFullYear(),
          lastQuarterMonth + 2,
          0,
          23,
          59,
          59
        );
        break;

      default:
        return res.status(400).json({ error: "Invalid period parameter" });
    }

    // Tìm tất cả người phụ trách
    const users = await User.findAll();

    // Tạo một mảng để lưu trữ số lượng lead theo người phụ trách
    const statistics = [];

    // Duyệt qua từng người phụ trách và đếm số lượng lead tương ứng
    for (const user of users) {
      const count = await Lead.count({
        where: {
          assignedUserId: user.id,
          createdAt: {
            [Op.between]: [startDate, endDate],
          },
        },
      });
      statistics.push({
        name: user.fullName, // Lấy tên người phụ trách
        count: count.toString(), // Chuyển số lượng thành chuỗi
      });
    }

    // Trả về kết quả theo định dạng mong muốn
    res.json({ data: statistics });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error fetching lead owner statistics" });
  }
};
