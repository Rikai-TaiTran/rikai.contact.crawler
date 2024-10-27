const express = require("express");
const app = express();
const bodyParser = require("body-parser");
require("dotenv").config();
const leadRoutes = require("./routes/leadRoutes");
const toiawaseRoutes = require("./routes/toiawaseRoutes");
const fileRoutes = require("./routes/fileRoutes");
const leadSourceRoutes = require("./routes/leadSourceRoutes");
const leadStatusRoutes = require("./routes/leadStatusRoutes");
const leadTypeRoutes = require("./routes/leadTypeRoutes");
const contactChannelRoutes = require("./routes/contactChannelRoutes");
const leadHistoryRoutes = require("./routes/leadHistoryRoutes");
const toiawaseHistoryRoutes = require("./routes/toiawaseHistoryRoutes");

var cors = require("cors");
const auth = require("./middleware/auth"); // Import middleware auth

app.use(bodyParser.json());
app.use(cors());

// Các route không yêu cầu xác thực
app.use("/api/users", require("./routes/userRoutes")); // Route cho user (đăng ký, đăng nhập, đăng xuất)

// Các route yêu cầu xác thực
app.use("/api/leads", auth, leadRoutes);
app.use("/api/toiawase", auth, toiawaseRoutes);
app.use("/api/files", auth, fileRoutes);
app.use("/api/lead_sources", auth, leadSourceRoutes);
app.use("/api/lead_statuses", auth, leadStatusRoutes);
app.use("/api/lead_types", auth, leadTypeRoutes);
app.use("/api/contact_channels", auth, contactChannelRoutes);
app.use("/api/lead_histories", auth, leadHistoryRoutes);
app.use("/api/toiawase_histories", auth, toiawaseHistoryRoutes);
app.use("/", require("./routes/dowloadFileRouters"));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
