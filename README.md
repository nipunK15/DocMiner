# DocuMiner 

DocuMiner is an intelligent web application designed to help users analyze and extract key information from multiple PDF documents simultaneously. By leveraging the power of generative AI, users can define a specific persona and "job-to-be-done" to receive highly relevant, context-aware insights from their documents.

## Key Features

- **Multi-Document Upload**: Upload between 3 and 10 PDF documents for analysis.
- **AI-Powered Analysis**: Utilizes generative AI to analyze document content based on user-defined context.
- **Persona and Job-to-be-Done**: Define a persona (e.g., "AI Researcher") and a goal (e.g., "Summarize topics") to tailor the analysis.
- **Tone Control**: Choose the tone of the extracted content, with options like "Professional," "Casual," "Academic," and more.
- **Contextual Tags**: Optionally enable "smart tags" like "Key Takeaway," "Action Item," or "Insider Tip" for deeper insights.
- **Interactive Results**: View extracted sections sorted by importance, complete with source document and page number.
- **Section-Specific Chatbot**: Dive deeper into any extracted section by chatting with an AI assistant that answers questions based on the section's content.
- **Downloadable Reports**: Export the complete analysis as a formatted PDF document.
- **Theming**: Switch between light and dark modes for comfortable viewing.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **AI Integration**: [Genkit](https://firebase.google.com/docs/genkit)
- **UI**: [React](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN/UI](https://ui.shadcn.com/)
- **Form Management**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (version 20 or later recommended)
- [npm](https://www.npmjs.com/get-npm) or a compatible package manager
- A Google AI API key.

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project and add your Google AI API key:
    ```
    GEMINI_API_KEY=your_google_ai_api_key_here
    ```

4.  **Run the development server:**
    The application requires two development servers to run concurrently: one for the Next.js frontend and one for the Genkit AI flows.

    -   **Start the Next.js server:**
        ```bash
        npm run dev
        ```
        The frontend will be available at `http://localhost:9002`.

    -   **Start the Genkit server (in a separate terminal):**
        ```bash
        npm run genkit:dev
        ```
        This starts the Genkit development environment, which the Next.js app will communicate with.

### How to Use

1.  **Upload Documents**: Drag and drop between 3 and 10 PDF files into the "Documents" panel, or click to browse your local files.
2.  **Set Analysis Context**:
    -   **Persona**: Enter the role or perspective the AI should adopt (e.g., "Financial Analyst," "Student").
    -   **Job to be done**: Describe the primary goal of your analysis (e.g., "Identify key risks," "Find all mentions of machine learning").
    -   **Tone**: Select the desired writing style for the results from the dropdown.
    -   **Contextual Tags**: Toggle the switch to enable or disable AI-generated tags.
3.  **Analyze**: Click the "Analyze" button to start the process.
4.  **Review Results**: The "Analysis Results" panel will populate with cards for each extracted section, sorted by importance.
5.  **Chat with AI**: Click the "Chat about this section" button on any card to open a dialog and ask specific questions about that section's content.
6.  **Download**: Click the "Download as PDF" button to save the analysis results.
