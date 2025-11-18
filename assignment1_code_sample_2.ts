import * as readline from "readline";
import * as mysql from "mysql";
import { exec } from "child_process";
import * as http from "http";
import * as process from "process";

const dbConfig = {
    // Vulnerability: same as first sample, hard coded credentials (OWASP A03 Sensitive Data Exposure)
    // change to envirnment variables
    host: process.env.DB_HOST || "placeholder_host",
    user: process.env.DB_USER || "placeholder_user",
    password: process.env.DB_PASSWORD || "placeholder_password",
    database: "mydb",
};

function getUserInput(): Promise<string> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise((resolve) => {
        rl.question("Enter your name: ", (answer) => {
            rl.close();
            resolve(answer.trim());
        });
    });
}

function sendEmail(to: string, subject: string, body: string) {
    // Vulnerability:should not exeute it when there contain untrusted input (OWASP A01 Injection)
    // simply add explanation about it
}

function getData(): Promise<string> {
    return new Promise((resolve, reject) => {
        // Vulnerability: using insecure http (OWASP A03)
        // change to HTTPS
        https
            .get("https://insecure-api.com/get-data", (res) => {
                let data = "";
                res.on("data", (chunk) => (data += chunk));
                res.on("end", () => resolve(data));
            })
            .on("error", reject);
    });
}

function saveToDb(data: string) {
    const connection = mysql.createConnection(dbConfig);
    // Vulnerability: should not concatenated SQL qurey
    // use parametric
    const query = "INSERT INTO mytable (column1, column2) VALUES (?, ?)";
    connection.connect();
    connection.query(query, [data, "Another Value"], (error) => {
        if (error) console.error("Error executing query:", error);
        connection.end();
    });
}

(async () => {
    const userInput = await getUserInput();
    const data = await getData();
    saveToDb(data);
    sendEmail("admin@example.com", "User Input", userInput);
})();
