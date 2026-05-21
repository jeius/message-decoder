type GridPoint = {
    x: number;
    y: number;
    char: string;
};

type GridBounds = {
    maxX: number;
    maxY: number;
};

/**
 * Main function
 * Fetches a published Google Doc, parses the grid data,
 * and prints the resulting character grid.
 */
export async function printSecretMessage(docUrl: string): Promise<void> {
    const documentText = await fetchDocumentText(docUrl);
    const points = parseGridPoints(documentText);

    if (points.length === 0) {
        console.log("No grid data found.");
        return;
    }

    const bounds = getGridBounds(points);
    const grid = createEmptyGrid(bounds);

    fillGrid(grid, points);

    printGrid(grid);
}

/**
 * Fetch raw document text from a published Google Doc URL.
 */
async function fetchDocumentText(url: string): Promise<string> {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Failed to fetch document: ${response.status}`);
    }

    const html = await response.text();

    const rows: string[] = [];
    const rowRegex = /<tr\b[^>]*>([\s\S]*?)<\/tr>/gi;
    const cellRegex = /<td\b[^>]*>([\s\S]*?)<\/td>/gi;

    let firstRow = true;
    let rowMatch: RegExpExecArray | null;

    while ((rowMatch = rowRegex.exec(html)) !== null) {
        if (firstRow) {
            firstRow = false;
            continue;
        }

        const rowHtml = rowMatch[1];
        const cells: string[] = [];
        let cellMatch: RegExpExecArray | null;
        cellRegex.lastIndex = 0;

        while ((cellMatch = cellRegex.exec(rowHtml)) !== null) {
            const text = cellMatch[1].replace(/<[^>]+>/g, "").trim();
            if (text !== "") cells.push(text);
        }

        if (cells.length === 3) {
            rows.push(`${cells[0]} ${cells[1]} ${cells[2]}`);
        }
    }

    return rows.join("\n");
}

/**
 * Extract character coordinates from document text.
 *
 * Expected format per line:
 * <x> <character> <y>
 *
 * Example:
 * 0 █ 0
 * 1 ▀ 0
 */
function parseGridPoints(text: string): GridPoint[] {
    const lines = text.split("\n");

    const points: GridPoint[] = [];

    for (const line of lines) {
        const trimmed = line.trim();

        if (!trimmed) {
            continue;
        }

        const match = trimmed.match(/^(\d+)\s+(.+)\s+(\d+)$/);

        if (!match) {
            continue;
        }

        const [, x, char, y] = match;

        points.push({
            char,
            x: Number(x),
            y: Number(y),
        });
    }

    return points;
}

/**
 * Determine maximum grid dimensions.
 */
function getGridBounds(points: GridPoint[]): GridBounds {
    let maxX = 0;
    let maxY = 0;

    for (const point of points) {
        maxX = Math.max(maxX, point.x);
        maxY = Math.max(maxY, point.y);
    }

    return { maxX, maxY };
}

/**
 * Create empty grid filled with spaces.
 */
function createEmptyGrid(bounds: GridBounds): string[][] {
    return Array.from(
        { length: bounds.maxY + 1 },
        () => Array(bounds.maxX + 1).fill(" ")
    );
}

/**
 * Place characters into the grid.
 */
function fillGrid(grid: string[][], points: GridPoint[]): void {
    for (const point of points) {
        grid[point.y][point.x] = point.char;
    }
}

/**
 * Print the final grid.
 */
function printGrid(grid: string[][]): void {
    for (const row of grid) {
        console.log(row.join(""));
    }
}

/**
 * Return the decoded secret message as a string.
 */
export async function getSecretMessage(docUrl: string): Promise<string> {
    const documentText = await fetchDocumentText(docUrl);
    const points = parseGridPoints(documentText);

    if (points.length === 0) {
        return "";
    }

    const bounds = getGridBounds(points);
    const grid = createEmptyGrid(bounds);

    fillGrid(grid, points);

    return grid.map((row) => row.join("")).join("\n");
}