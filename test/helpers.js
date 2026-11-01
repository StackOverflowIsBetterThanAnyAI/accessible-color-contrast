import { spawn, spawnSync } from 'child_process'
import { stripVTControlCharacters } from 'util'

// Runs the CLI like a user would. `input` is written to stdin at once, where
// '\r' submits a prompt and '\x03' (Ctrl+C) cancels it. Only use this for a
// single prompt, as the input is consumed by the first prompt.
export const runCli = (args, input = '') => {
    const result = spawnSync('node', ['./index.js', ...args], {
        encoding: 'utf-8',
        input,
        timeout: 10000,
    })

    return {
        status: result.status,
        stdout: stripVTControlCharacters(result.stdout ?? ''),
        stderr: stripVTControlCharacters(result.stderr ?? ''),
    }
}

// Answers several prompts one after another. Each answer is written as soon
// as the next prompt has been rendered.
export const runCliWithPrompts = (args, answers) => {
    return new Promise((resolve, reject) => {
        const child = spawn('node', ['./index.js', ...args])
        let stdout = ''
        let stderr = ''
        let answered = 0

        const timer = setTimeout(() => {
            child.kill()
            reject(new Error(`CLI timed out. Output:\n${stdout}`))
        }, 10000)

        child.stdout.setEncoding('utf-8')
        child.stderr.setEncoding('utf-8')

        child.stdout.on('data', (chunk) => {
            stdout += chunk
            // every distinct active prompt (◆) gets exactly one answer
            const prompts = new Set(
                stripVTControlCharacters(stdout).match(/◆ +.+/g)
            ).size

            while (answered < prompts && answered < answers.length) {
                child.stdin.write(answers[answered++])
                if (answered === answers.length) child.stdin.end()
            }
        })
        child.stderr.on('data', (chunk) => (stderr += chunk))

        child.on('error', reject)
        child.on('close', (status) => {
            clearTimeout(timer)
            resolve({
                status,
                stdout: stripVTControlCharacters(stdout),
                stderr: stripVTControlCharacters(stderr),
            })
        })
    })
}

export const count = (text, search) => text.split(search).length - 1
