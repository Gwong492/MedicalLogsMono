import { WebClient } from "@slack/web-api";
import "dotenv/config";

/**
 * Generate a PDF as a Buffer (no filesystem needed).
 * @param buffer {Buffer} - The file buffer to upload
 * @param filename {string} - The name of the file to upload
 * @param channel {string} - The Slack channel ID to upload the file to
 * @returns {Promise<void>}
 */

const slack = new WebClient(process.env.API_TEST_KEY);

const channelId = process.env.SLACK_CHANNEL_ID;

export async function uploadFileToSlack(buffer, filename, channel = channelId) {
    await slack.files.uploadV2({
    channel_id: channel,
    filename: filename,
    file: buffer,
    title: "PDF Test Upload",
    initial_comment: "Testing file upload from Node script.",
    });
}