\`\`\`
ai-annotator/
├── app/
│   ├── page.tsx                 # Main page - orchestrates everything
│   ├── layout.tsx               # Next.js layout (auto-generated)
│   ├── globals.css              # Global styles
│   └── api/
│       ├── annotate/route.ts    # Backend endpoint for getting annotations
│       └── say-more/route.ts    # Backend endpoint for detailed explanations
├── components/
│   ├── code-uploader.tsx        # File upload component
│   ├── code-display.tsx         # Shows code with line numbers
│   ├── annotation-panel.tsx     # Shows annotations (bottom panel)
│   └── ui/                      # shadcn/ui pre-built components
├── README.md                    # This file
└── package.json                 # Project dependencies
\`\`\`

## Installation
### Insatll dependencies
```
npm install
```
___

## Usage
### Run server
```
npm run dev
```
The page available at `http://localhost:3000`



