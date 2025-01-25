import { Database } from "bun:sqlite";
import { getAnswer } from "./ai";
import { buildExplainResultsPrompt, buildSQLPrompt } from "./prompt";

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
            
            const sqlPrompt = buildSQLPrompt(cleanedLine);
            if (verbose) {
                console.log(c("grey", sqlPrompt) + '\n');
                console.log(c("cyan", `Using the above prompt to generate SQL...`));
            }
            const sql = await getAnswer(sqlPrompt);
            if (verbose) {
                console.log(c("cyan", `Generated SQL:`));
                console.log(c("grey", sql));
                const userContinue = prompt(c("cyan", "Continue? (y/n) "));
                if (!userContinue || userContinue.toLowerCase() !== 'y') {
                    break;
                }
            }

            const result = await db.query(sql).get();
            if (verbose) {
                console.log(c("cyan", `Result:`));
                console.log(result);
                const userContinue = prompt(c("cyan", "Continue? (y/n) "));
            }

            const explainAnswerPrompt = buildExplainResultsPrompt(sqlPrompt, JSON.stringify(result));
            const explanation = await getAnswer(explainAnswerPrompt);

            console.log(c("cyan", `Answer:`));
            console.log(c("grey", explanation));

            process.stdout.write(cmdlinePrompt);
        }
    } catch(e) {
        console.error(e);
    }
}

run();