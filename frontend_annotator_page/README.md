# AI Code Annotator

A React-based web application that allows users to upload code files and receive AI-powered annotations for each line. The annotations appear in a command window at the bottom (similar to VSCode), making it easy to review code with detailed explanations.

## Features

- **Code Upload**: Drag-and-drop or click to upload code files (.js, .ts, .py, .java, .cpp, etc.)
- **Line-by-Line Annotation**: Click any line to see its annotation
- **Resizable Panels**: Drag the divider between code and annotations to adjust panel sizes
- **Detailed Explanations**: Click "Say More" to get more detailed annotations from the AI backend
- **Live Feedback**: Loading states and error handling for smooth user experience

## Project Structure

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

## How It Works

### 1. User Uploads Code
- User drags a file onto the upload card OR clicks the upload button
- The `CodeUploader` component reads the file using JavaScript's `FileReader` API
- File content is sent to the parent component (`app/page.tsx`)

### 2. Frontend Sends to Backend
\`\`\`
Frontend sends POST to /api/annotate with the code
↓
API route processes the request
↓
Returns annotations as JSON: { "1": "annotation", "2": "annotation", ... }
\`\`\`

### 3. Display Code
- The `CodeDisplay` component splits the code into lines
- Each line gets a line number and is clickable
- Selected line is highlighted in blue

### 4. Show Annotation
- When user clicks a line, `AnnotationPanel` shows the corresponding annotation
- Annotation is retrieved from the stored `annotations` state

### 5. Get More Details
- User clicks "Say More" button
- Frontend sends POST to `/api/say-more` with the selected line and current annotation
- Backend returns a more detailed explanation
- `AnnotationPanel` displays the detailed annotation

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

#### Option A: Using shadcn CLI (Recommended)
\`\`\`bash
# Create a new Next.js project with all dependencies
npx create-next-app@latest ai-annotator --typescript --tailwind --app

cd ai-annotator

# Initialize shadcn/ui
npx shadcn-cli@latest init
\`\`\`

#### Option B: Manual Setup
\`\`\`bash
# Clone or download the project
cd ai-annotator

# Install dependencies
npm install
\`\`\`

### Running Locally

\`\`\`bash
npm run dev
\`\`\`

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## Component Breakdown

### `app/page.tsx` - Main Page (The Brain)

**What it does**: Manages all state and orchestrates data flow between components.

**Key State Variables**:
\`\`\`typescript
uploadedCode          // The code user uploaded
selectedLine          // Which line number is currently selected (null if none)
annotations           // Object with all annotations { "1": "...", "2": "...", ... }
annotationPanelHeight // Height of bottom panel in pixels (user can resize)
isLoading            // True while waiting for backend response
\`\`\`

**Key Function**:
- `handleCodeUpload(code)` - Sends code to `/api/annotate` backend endpoint

### `components/code-uploader.tsx` - File Upload

**What it does**: Handles file selection (click or drag-drop).

**Key Function**:
- `handleFileRead(file)` - Reads file as text and calls `onCodeUpload()`

**Supported File Types**:
- JavaScript: `.js`, `.jsx`
- TypeScript: `.ts`, `.tsx`
- Python: `.py`
- Java: `.java`
- C++: `.cpp`, `.c`
- Go: `.go`
- Ruby: `.rb`
- PHP: `.php`
- Swift: `.swift`
- Kotlin: `.kt`
- Rust: `.rs`

### `components/code-display.tsx` - Code Display

**What it does**: Shows code with line numbers and makes lines clickable.

**Key Function**:
- Splits code into lines using `code.split("\n")`
- Maps each line to a clickable div with line number
- Highlights selected line with blue background
- Uses `useMemo` to optimize rendering (only recalculates if code changes)

### `components/annotation-panel.tsx` - Annotation Window

**What it does**: Displays annotations like VSCode's command palette.

**States**:
1. No line selected → Shows "Click a line to see annotation"
2. Loading → Shows spinner
3. Annotation loaded → Shows annotation + "Say More" button

**Key Function**:
- `handleSayMore()` - Calls `/api/say-more` for more details

## Backend Integration

Your group handles the AI annotation logic. The frontend communicates with your backend through two API routes:

### Route 1: `/api/annotate`

**Request** (from frontend):
\`\`\`json
{
  "code": "function hello() { console.log('hi'); }"
}
\`\`\`

**Response** (from your backend):
\`\`\`json
{
  "1": "Function definition",
  "2": "Prints 'hi' to console",
  "3": "Closing brace"
}
\`\`\`

**To connect to your backend**, edit `app/api/annotate/route.ts`:

\`\`\`typescript
// Replace the mockAnnotations with:
const response = await fetch("http://YOUR_BACKEND_URL:PORT/annotate", {
  method: "POST",
  body: JSON.stringify({ code }),
})
const annotations = await response.json()
return Response.json(annotations)
\`\`\`

### Route 2: `/api/say-more`

**Request** (from frontend):
\`\`\`json
{
  "selectedItem": "Line 2",
  "currentAnnotation": "Prints 'hi' to console"
}
\`\`\`

**Response** (from your backend):
\`\`\`json
{
  "detailedAnnotation": "This line uses console.log(), which is a JavaScript function that prints text to the browser console. It's useful for debugging..."
}
\`\`\`

**To connect to your backend**, edit `app/api/say-more/route.ts`:

\`\`\`typescript
// Replace the mock response with:
const response = await fetch("http://YOUR_BACKEND_URL:PORT/say-more", {
  method: "POST",
  body: JSON.stringify({ selectedItem, currentAnnotation }),
})
const data = await response.json()
return Response.json(data)
\`\`\`

## Libraries Used

| Library | Purpose | Used In |
|---------|---------|---------|
| **React** | UI framework (state management, components) | All components |
| **Next.js** | React framework (routing, API routes) | app/ directory |
| **TypeScript** | Type safety for JavaScript | All `.ts` and `.tsx` files |
| **Tailwind CSS** | Styling (utility classes) | All components |
| **shadcn/ui** | Pre-built UI components | Button, Card, Spinner components |
| **lucide-react** | Icons (Upload, ChevronUp, etc.) | CodeUploader, AnnotationPanel |

## Testing

### Test Without Backend (Using Mock Data)

The API routes come with mock annotations for testing:

\`\`\`typescript
// In app/api/annotate/route.ts
const mockAnnotations = {
  "1": "Function definition",
  "2": "Returns sum of two numbers",
  // ... more mock data
}
\`\`\`

Upload code with lines 1, 2, 5-7, or 10-11 to see the mock annotations.

### Test With Backend

1. Update `app/api/annotate/route.ts` to call your backend
2. Update `app/api/say-more/route.ts` to call your backend
3. Make sure your backend is running
4. Upload code and test the annotation flow

## Troubleshooting

### Issue: "Tailwind CSS is not installed"

**Solution**:
\`\`\`bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
\`\`\`

### Issue: "Module not found" error

**Solution**:
\`\`\`bash
npm install
\`\`\`

### Issue: Annotations not showing

**Checks**:
1. Did you upload code? (Check if `uploadedCode` is not empty)
2. Did you click a line? (Check if `selectedLine` is not null)
3. Is the backend returning annotations? (Check browser DevTools Network tab)
4. Do the line numbers match? (Annotations are keyed by line number as strings: `"1"`, `"2"`, etc.)

### Issue: "Failed to get annotations" error

**Checks**:
1. Is your backend running?
2. Is the backend URL correct in `app/api/annotate/route.ts`?
3. Check browser console (F12 → Console tab) for error messages
4. Check network tab to see the API response

## Data Flow Diagram

\`\`\`
User uploads file (.js, .py, etc.)
         ↓
CodeUploader reads file using FileReader API
         ↓
Sends code to app/page.tsx via onCodeUpload callback
         ↓
page.tsx sends POST to /api/annotate
         ↓
route.ts calls your backend AI service
         ↓
Backend returns: { "1": "annotation", "2": "annotation", ... }
         ↓
Frontend stores in annotations state
         ↓
CodeDisplay renders code with line numbers (clickable)
         ↓
User clicks on a line
         ↓
AnnotationPanel displays the annotation for that line
         ↓
User clicks "Say More" button
         ↓
Sends POST to /api/say-more
         ↓
route.ts calls your backend
         ↓
Backend returns detailed explanation
         ↓
AnnotationPanel displays detailed annotation
\`\`\`

## Resizable Panels

The code and annotation panels can be resized by dragging the divider between them:

- Drag the divider up to make code panel smaller
- Drag the divider down to make annotation panel smaller
- Minimum annotation panel height: 100px
- Maximum annotation panel height: 80% of screen




