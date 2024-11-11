const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");

const { Toiawase, sequelize } = require("../models");

const BATCH_SIZE = 1000; // Batch size for database inserts

exports.importCSV = async (req, res) => {
  if (!req.file) {
    return res.status(200).json({ message: "No file uploaded." });
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
          const { name, website, address, foundedDate, founded, source } =
            results[i];

          const existingCompany = await Toiawase.findOne({
            where: { company_website: website },
            transaction,
          });

          if (!existingCompany && name) {
            batch.push({
              company_name: name,
              company_website: website,
              company_address: address,
              crawl_source: source,
              created_date,
            });
          }

          if (batch.length === BATCH_SIZE || i === results.length - 1) {
            await Toiawase.bulkCreate(batch, { transaction });
            batch = [];
          }

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
        fs.unlink(req.file.path, (err) => {
          if (err) console.error(`Failed to delete file: ${err}`);
        });
      }
    });
};
