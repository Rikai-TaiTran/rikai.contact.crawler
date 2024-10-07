const express = require("express");
const multer = require("multer");
const cors = require("cors");
const csv = require("csv-parser");
const fs = require("fs");
const { Op } = require("sequelize");
const { Company, sequelize } = require("./Company");
const { Parser } = require("json2csv");
const { Readable } = require("stream");

const app = express();
const upload = multer({ dest: "uploads/" });

const BATCH_SIZE = 1000; // Batch size for database inserts

// Middleware for parsing JSON
app.use(express.json(), cors());

app.post("/api/import", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }

  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", async () => {
      const transaction = await sequelize.transaction();

      try {
        const created_date = new Date();
        let batch = [];

        for (let i = 0; i < results.length; i++) {
          const { name, website, address, foundedDate, source } = results[i];

          // Check for existing companies
          const existingCompany = await Company.findOne({
            where: { website },
            transaction,
          });

          if (!existingCompany) {
            batch.push({
              name,
              website,
              address,
              foundedDate,
              source,
              created_date,
            });
          }

          // If batch size is reached, insert into database
          if (batch.length === BATCH_SIZE || i === results.length - 1) {
            await Company.bulkCreate(batch, { transaction });
            batch = [];
          }

          // Log progress
          if (i % 10000 === 0) {
            console.log(`Processed ${i} records`);
          }
        }

        await transaction.commit();
        res.json({ message: "CSV file imported successfully" });
      } catch (error) {
        await transaction.rollback();
        res
          .status(500)
          .json({ message: `Error processing CSV file: ${error.message}` });
      } finally {
        // Delete the uploaded file after processing
        fs.unlink(req.file.path, (err) => {
          if (err) console.error(`Failed to delete file: ${err}`);
        });
      }
    });
});

app.get("/api/companies", async (req, res) => {
  const {
    page = 1,
    pageSize = 100,
    search = "",
    startDate,
    endDate,
  } = req.query;

  // Create the where clause with optional search and date range
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

  try {
    // Get total count for pagination
    const total = await Company.count({ where: whereClause });

    // Fetch paginated results
    const companies = await Company.findAll({
      where: whereClause,
      limit: parseInt(pageSize),
      offset: (page - 1) * pageSize,
      order: [["created_date", "DESC"]],
    });

    res.json({
      data: companies,
      total,
      pages: Math.ceil(total / pageSize),
      currentPage: parseInt(page),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Helper function to create CSV stream from data
function arrayToCSVStream(data, fields) {
  const json2csvParser = new Parser({ fields });
  const csv = json2csvParser.parse(data);

  // Add BOM for Unicode support (e.g., Japanese characters)
  const csvWithBOM = "\uFEFF" + csv;

  // Create stream from the CSV string
  const stream = new Readable();
  stream.push(csvWithBOM);
  stream.push(null); // End stream
  return stream;
}

app.get("/api/export", async (req, res) => {
  const { search = "", startDate, endDate } = req.query;
  const ids = req.query.ids ? req.query.ids.split(",") : [];
  let companies;

  if (ids && ids.length > 0) {
    // If IDs are provided, fetch companies by IDs
    companies = await Company.findAll({
      where: { id: { [Op.in]: ids } },
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
      "source",
      "created_date",
    ];

    const today = new Date();
    const formattedDate = `${String(today.getMonth() + 1).padStart(
      2,
      "0"
    )}${String(today.getDate()).padStart(2, "0")}${today.getFullYear()}`;
    const filename = `company_${formattedDate}.csv`;

    res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
    res.setHeader("Content-Type", "text/csv; charset=utf-8");

    const csvStream = arrayToCSVStream(companies, fields);
    csvStream.pipe(res);
  } catch (error) {
    res.status(500).json({ message: `Error exporting CSV: ${error.message}` });
  }
});

// Start the server
app.listen(3000, () => {
  console.log("API is running on port 3000");
});
