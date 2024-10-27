const { User } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Đăng ký người dùng mới

exports.getAllUsers = async (req, res) => {
  try {
    const getAll = req.query.getall === "true";

    if (getAll) {
      const users = await User.findAll();
      return res.json({ data: users });
    } else {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.pageSize) || 10;
      const offset = (page - 1) * limit;

      const { rows: users, count } = await User.findAndCountAll({
        limit,
        offset,
      });

      res.json({
        data: users,
        pagination: {
          currentPage: page,
          pageSize: limit,
          totalRecords: count,
          totalPages: Math.ceil(count / limit),
        },
      });
    }
  } catch (error) {
    res.status(500).json({ error: "Error fetching users" });
  }
};

exports.userDetail = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Error fetching user" });
  }
};

exports.register = async (req, res) => {
  try {
    const { fullName, username, email, password } = req.body;

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      fullName: fullName,
      username: username,
      email: email,
      password_hash: hashedPassword,
    });

    res.status(201).json({ id: newUser.id, username: newUser.username });
  } catch (error) {
    res.status(500).json({ error: "Error registering user" });
    throw error;
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, username, email, password } = req.body;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    user.update({
      fullName,
      email,
      username,
      hashedPassword: hashedPassword,
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: "Error registering user" });
    throw error;
  }
};

// Đăng nhập
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Tạo token
    const token = jwt.sign({ user: user }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ user: user, token: token });
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: "Error logging in" });
  }
};

// Đăng xuất
exports.logout = (req, res) => {
  res.status(200).json({ message: "Logout successful" });
};
