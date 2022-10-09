import { readFileSync } from "fs";
import { marked } from "marked";
import { sanitizeHtml } from "./sanitizer";
import { ParsedRequest } from "./types";
const twemoji = require("twemoji");
const twOptions = { folder: "svg", ext: ".svg" };
const emojify = (text: string) => twemoji.parse(text, twOptions);

const rglr = readFileSync(
    `${__dirname}/../_fonts/Inter-Regular.woff2`
).toString("base64");
const bold = readFileSync(`${__dirname}/../_fonts/Inter-Bold.woff2`).toString(
    "base64"
);
const mono = readFileSync(`${__dirname}/../_fonts/Vera-Mono.woff2`).toString(
    "base64"
);

function getCss(theme: string, fontSize: string) {
    let background = "white";
    let foreground = "black";
    let radial = "lightgray";

    if (theme === "dark") {
        background = "black";
        foreground = "white";
        radial = "dimgray";
    }
    return `
    @font-face {
        font-family: 'Inter';
        font-style:  normal;
        font-weight: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${rglr}) format('woff2');
    }

    @font-face {
        font-family: 'Inter';
        font-style:  normal;
        font-weight: bold;
        src: url(data:font/woff2;charset=utf-8;base64,${bold}) format('woff2');
    }

    @font-face {
        font-family: 'Vera';
        font-style: normal;
        font-weight: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${mono})  format("woff2");
      }

    body {
        background: ${background};
        background-image: radial-gradient(circle at 25px 25px, ${radial} 2%, transparent 0%), radial-gradient(circle at 75px 75px, ${radial} 2%, transparent 0%);
        background-size: 100px 100px;
        height: 100vh;
        display: flex;
        text-align: center;
        align-items: center;
        justify-content: center;
    }

    code {
        color: #D400FF;
        font-family: 'Vera';
        white-space: pre-wrap;
        letter-spacing: -5px;
    }

    code:before, code:after {
        content: '\`';
    }

    .logo-wrapper {
        display: flex;
        align-items: center;
        align-content: center;
        justify-content: center;
        justify-items: center;
    }

    .logo {
        object-fit: cover;
        margin: 0 26px;
        border-radius: 50%;
        border: 4px solid #1498D5;
    }

    .plus {
        color: #BBB;
        font-family: Times New Roman, Verdana;
        font-size: 100px;
    }

    // .spacer {
    //     margin: 150px;
    // }

    .emoji {
        height: 1em;
        width: 1em;
        margin: 0 .05em 0 .1em;
        vertical-align: -0.1em;
    }
    
    .title {
        font-family: 'Inter', sans-serif;
        font-size: ${sanitizeHtml(fontSize)};
        font-style: bold;
        color: ${foreground};
    }

    .display-full {
        width: 100vw;
        height: 100vh;
    }

    .flex {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .flex-row {
        flex-direction: row;
    }

    .flex-column {
        flex-direction: column;
    }
    
    .odds-logo {
        top: 4em;
        right: 4em;
        position: absolute;
    }`;
}

export function getHtml(parsedReq: ParsedRequest) {
    const { text, theme, md, fontSize, images, widths, heights } = parsedReq;
    return `<!DOCTYPE html>
    <html>
        <meta charset="utf-8">
        <title>Generated Image</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
            ${getCss(theme, fontSize)}
        </style>
        <body>
            <div class="flex flex-column display-full">
                <div class="logo-wrapper">
                    ${images
                        .map(
                            (img, i) =>
                                getPlusSign(i) +
                                getImage(img, widths[i], heights[i])
                        )
                        .join("")}
                </div>
                <div class="title">
                    ${emojify(md ? marked(text) : sanitizeHtml(text))}
                </div>
            </div>
            <div class="odds-logo">
                <img alt="Generated Image" src="https://phanx-web-dev.web.app/asset/Odds-Logo.svg" width="auto" height="120" />
            </div>
        </body>
    </html>`;
}

function getImage(src: string, width = "400", height = "400") {
    return `<img
        class="logo"
        alt="Generated Image"
        src="${sanitizeHtml(src)}"
        width="${sanitizeHtml(width)}"n
        height="${sanitizeHtml(height)}"
    />`;
}

function getPlusSign(i: number) {
    return i === 0 ? "" : '<div class="plus">X</div>';
}
