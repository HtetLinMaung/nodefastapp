import path from "path";
import moment from "moment";
import fs from "fs";

const root = path.join(__dirname, "..", "..");

const writeLogToFile = (message: string, level: string) => {
  const logsFolder = path.join(root, "logs");
  if (!fs.existsSync(logsFolder)) {
    fs.mkdirSync(logsFolder);
  }
  const filePath = path.join(
    logsFolder,
    `${moment().format("YYYY-MM-DD")}.txt`
  );
  if (fs.existsSync(filePath)) {
    fs.appendFileSync(
      filePath,
      `[${moment().format("HH:mm:ss")}] [${level}] ${message}\n`
    );
  } else {
    fs.writeFileSync(
      filePath,
      `[${moment().format("HH:mm:ss")}] [${level}] ${message}\n`
    );
  }
};

const logger = {
  info: (message: string) => {
    console.log(message);
    writeLogToFile(message, "INFO");
  },
  error: (message: string) => {
    console.error(message);
    writeLogToFile(message, "ERROR");
  },
};

export default logger;
