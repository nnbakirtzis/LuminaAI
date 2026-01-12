import { File, Paths } from "expo-file-system";
import * as LegacyFileSystem from "expo-file-system/legacy";
import { supabase } from "../services/supabase";
import { log, error as logError } from "./logger";

const RESUME_CACHE_DIR = `${Paths.document.uri}resumes/`;

/**
 * Ensures the resume cache directory exists.
 */
async function ensureDirExists() {
    const dirInfo = await LegacyFileSystem.getInfoAsync(RESUME_CACHE_DIR);
    if (!dirInfo.exists) {
        log("ResumeManager", "Creating resume cache directory...");
        await LegacyFileSystem.makeDirectoryAsync(RESUME_CACHE_DIR, { intermediates: true });
    }
}

/**
 * Gets the local URI for a resume based on its storage path.
 */
function getLocalUri(storagePath: string) {
    const fileName = storagePath.split("/").pop();
    return `${RESUME_CACHE_DIR}${fileName}`;
}

export const ResumeManager = {
    /**
     * Saves a base64 resume string to the local cache.
     */
    async cacheResume(storagePath: string, base64: string): Promise<string> {
        await ensureDirExists();
        const localUri = getLocalUri(storagePath);
        const file = new File(localUri);
        await file.write(base64);
        log("ResumeManager", `Cached resume locally: ${localUri}`);
        return localUri;
    },

    /**
     * Resolves the base64 content of a resume.
     * Tries local cache first, then falls back to Supabase Storage.
     */
    async getResumeBase64(storagePath: string): Promise<string> {
        const localUri = getLocalUri(storagePath);
        const fileInfo = await LegacyFileSystem.getInfoAsync(localUri);

        if (fileInfo.exists) {
            log("ResumeManager", "Serving resume from local cache.");
            const file = new File(localUri);
            return await file.base64();
        }

        log("ResumeManager", `Cache miss for ${storagePath}. Downloading from Supabase...`);
        const { data, error } = await supabase.storage
            .from("resumes")
            .download(storagePath);

        if (error || !data) {
            logError("ResumeManager:downloadError", { error, storagePath });
            throw new Error(`Failed to download resume: ${error?.message || "No data"}`);
        }

        // Convert Blob to base64
        const base64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const result = reader.result as string;
                // Remove data:application/pdf;base64, prefix
                const base64Content = result.split(",")[1];
                resolve(base64Content);
            };
            reader.onerror = reject;
            reader.readAsDataURL(data);
        });

        // Cache it for next time
        await this.cacheResume(storagePath, base64);
        return base64;
    },

    /**
     * Checks if a resume exists in the local cache.
     */
    async isCached(storagePath: string): Promise<boolean> {
        const localUri = getLocalUri(storagePath);
        const fileInfo = await LegacyFileSystem.getInfoAsync(localUri);
        return fileInfo.exists;
    },

    /**
     * Clears all cached resumes.
     */
    async clearCache() {
        const dirInfo = await LegacyFileSystem.getInfoAsync(RESUME_CACHE_DIR);
        if (dirInfo.exists) {
            await LegacyFileSystem.deleteAsync(RESUME_CACHE_DIR, { idlingResource: true });
            log("ResumeManager", "Cleared resume cache.");
        }
    }
};
