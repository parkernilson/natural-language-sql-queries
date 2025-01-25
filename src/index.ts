import { Database } from "bun:sqlite";
import { getSql } from "./ai";
import { buildPrompt } from "./prompt";

type SupportedColor = 'white' | 'cyan' | 'grey';

const accentColor: SupportedColor = 'cyan';

const c = (color: SupportedColor, text: string) => {
    const resetColor = '\x1b[0m';
    return `${Bun.color(color, 'ansi')}${text}${resetColor}`;
}

const cmdlinePrompt = c("cyan", 'Type prompt') + c("grey", '> ');

async function run() {
    const db = new Database("database.db");

    const verbose = process.argv.includes('--verbose') || process.argv.includes('-v');

    console.log(c(accentColor, 'Welcome to NatLang SQL!'));
    process.stdout.write(cmdlinePrompt);
    
    try {
        for await (const line of console) {
            // Construct prompt from user's prompt
            const cleanedLine = line.trim();
            
            const userQuestion = buildPrompt(cleanedLine);
            if (verbose) {
                console.log(c("grey", userQuestion) + '\n');
                console.log(c("cyan", `Using the above prompt to generate SQL...`));
            }
            const sql = await getSql(userQuestion);
            if (verbose) {
                console.log(c("cyan", `Generated SQL:`));
                console.log(c("grey", sql));
                const userContinue = prompt(c("cyan", "Continue? (y/n) "));
                if (!userContinue || userContinue.toLowerCase() !== 'y') {
                    break;
                }
            }

            const result = await db.query(sql).get();

            console.log(c("cyan", `Result:`));
            console.log(result);

            process.stdout.write(cmdlinePrompt);
        }
    } catch(e) {
        console.error(e);
    }
}

run();