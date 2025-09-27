// src/lib/dynamic/getMarkdownFiles.ts
// This utility dynamically imports all markdown files from a given context (Vite/webpack)

export function getMarkdownFiles(context: any) {
    // For Vite: import.meta.glob returns an object with keys as paths
    // For webpack: require.context returns a function with keys()
    if (typeof context === "function" && context.keys) {
        // webpack
        return context.keys().map((key: string) => ({
            path: key,
            importFn: () => context(key),
        }));
    } else {
        // Vite
        return Object.keys(context).map((key) => ({
            path: key,
            importFn: context[key],
        }));
    }
}
