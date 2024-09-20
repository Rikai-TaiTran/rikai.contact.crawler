const express = require("express");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const { Op } = require("sequelize");
const { Company, sequelize } = require("./Company");
const path = require("path");
const { Parser } = require("json2csv"); // For CSV export
const { Readable } = require("stream");

const app = express();
const upload = multer({ dest: "uploads/" });

// Middleware for parsing JSON
app.use(express.json());
// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

app.post("/import", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", async () => {
      const transaction = await sequelize.transaction();

      try {
        for (let record of results) {
          const created_date = new Date();
          const { name, website, address, foundedDate, founded, source } =
            record;
          // Use `website` if that's what your model expects
          const existingCompany = await Company.findOne({
            where: { website },
            transaction,
          });

          if (!existingCompany) {
            await Company.create(
              {
                name,
                website,
                address,
                foundedDate,
                founded,
                source,
                created_date,
              },
              { transaction }
            );
          }
        }

        await transaction.commit();
        res.send("CSV file imported successfully");
      } catch (error) {
        await transaction.rollback();
        res.status(500).send(`Error processing CSV file: ${error.message}`);
      } finally {
        // Clean up the uploaded file
        fs.unlink(req.file.path, (err) => {
          if (err) console.error(`Failed to delete file: ${err}`);
        });
      }
    });
});

app.get("/companies", async (req, res) => {
  const {
    page = 1,
    pageSize = 10,
    search = "",
    startDate,
    endDate,
  } = req.query;

  // Create the where clause with optional search and date range
  const whereClause = {
    [Op.and]: [
      search ? { name: { [Op.like]: `%${search}%` } } : null, // For MySQL, use Op.like
      startDate && endDate
        ? {
            created_date: {
              [Op.between]: [new Date(startDate), new Date(endDate)],
            },
          }
        : null,
    ].filter(Boolean), // Remove null values
  };

  try {
    // Get total count for pagination
    const total = await Company.count({ where: whereClause });

    // Fetch paginated results
    const companies = await Company.findAll({
      where: whereClause,
      limit: parseInt(pageSize),
      offset: (page - 1) * pageSize,
      order: [["created_date", "DESC"]], // Offset for pagination
    });

    // Send the data back with total, current page, and total pages
    res.json({
      data: companies,
      total,
      pages: Math.ceil(total / pageSize),
      currentPage: parseInt(page),
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Hàm tạo stream từ mảng dữ liệu
function arrayToCSVStream(data, fields) {
  const json2csvParser = new Parser({ fields });
  const csv = json2csvParser.parse(data);

  // Thêm BOM để hỗ trợ ký tự Unicode (như tiếng Nhật)
  const csvWithBOM = "\uFEFF" + csv;

  // Tạo stream từ chuỗi CSV
  const stream = new Readable();
  stream.push(csvWithBOM);
  stream.push(null); // Kết thúc stream
  return stream;
}

// Export filtered companies to CSV
app.get("/export", async (req, res) => {
  const { search = "", startDate, endDate } = req.query;
  const ids = req.query.ids ? req.query.ids.split(",") : [];
  let companies;
  if (ids && ids.length > 0) {
    // If IDs are provided, fetch companies by IDs
    companies = await Company.findAll({
      where: {
        id: {
          [Op.in]: ids, // Use Op.in to match any of the provided IDs
        },
      },
      order: [["created_date", "DESC"]],
    });
  } else {
    const whereClause = {
      [Op.and]: [
        search ? { name: { [Op.like]: `%${search}%` } } : null,
        startDate && endDate
          ? {
              created_date: {
                [Op.between]: [new Date(startDate), new Date(endDate)],
              },
            }
          : null,
      ].filter(Boolean),
    };
    companies = await Company.findAll({
      where: whereClause,
      order: [["created_date", "DESC"]],
    });
  }

  try {
    const fields = [
      "name",
      "website",
      "address",
      "foundedDate",
      "founded",
      "source",
      "created_date",
    ]; // Các cột CSV

    const today = new Date();
    const formattedDate = `${String(today.getMonth() + 1).padStart(
      2,
      "0"
    )}${String(today.getDate()).padStart(2, "0")}${today.getFullYear()}`;

    const filename = `company_${formattedDate}.csv`;
    // Thiết lập header để trả về file CSV
    res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
    res.setHeader("Content-Type", "text/csv; charset=utf-8");

    // Tạo stream CSV từ dữ liệu
    const csvStream = arrayToCSVStream(companies, fields);
    // Trả về CSV dưới dạng stream
    csvStream.pipe(res);
  } catch (error) {
    //throw error;
    res.status(500).send(`Error exporting CSV: ${error.message}`);
  }
});

// Start server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
