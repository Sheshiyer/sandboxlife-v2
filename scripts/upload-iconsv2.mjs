import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = 'https://teyudjxlutkavyyigwwz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRleXVkanhsdXRrYXZ5eWlnd3d6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDYzMDQ2NjgsImV4cCI6MjAyMTg4MDY2OH0.MvaDhHKE55sSIEiasenRbR9U1LKnt7ae6dZUa89LUJg';

const supabase = createClient(supabaseUrl, supabaseKey);

const iconsDir = path.join(process.cwd(), 'src/assets/iconsv2');
const bucketName = 'new_icons';

async function uploadIcons() {
  console.log('Starting iconsv2 upload to Supabase storage...\n');

  const files = fs.readdirSync(iconsDir).filter(f => f.endsWith('.jpg'));
  console.log(`Found ${files.length} icons to upload\n`);

  const results = [];

  for (const file of files) {
    const filePath = path.join(iconsDir, file);
    const fileBuffer = fs.readFileSync(filePath);
    const fileName = `iconsv2/${file}`;

    console.log(`Uploading: ${file}...`);

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, fileBuffer, {
        contentType: 'image/jpeg',
        upsert: true
      });

    if (error) {
      console.log(`  ❌ Error: ${error.message}`);
      results.push({ file, success: false, error: error.message });
    } else {
      // Generate signed URL (1 year = 31536000 seconds)
      const { data: urlData } = await supabase.storage
        .from(bucketName)
        .createSignedUrl(fileName, 31536000);

      console.log(`  ✓ Uploaded`);
      results.push({
        file,
        success: true,
        path: data.path,
        signedUrl: urlData?.signedUrl
      });
    }
  }

  console.log('\n--- Upload Summary ---');
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);

  console.log(`✓ Successful: ${successful.length}`);
  console.log(`✗ Failed: ${failed.length}`);

  if (failed.length > 0) {
    console.log('\nFailed uploads:');
    failed.forEach(f => console.log(`  - ${f.file}: ${f.error}`));
  }

  // Output the signed URLs for questions.jsx
  console.log('\n--- Signed URLs for questions.jsx ---\n');
  successful.forEach(r => {
    const iconName = r.file.replace('.jpg', '');
    console.log(`// ${iconName}`);
    console.log(`icon: "${r.signedUrl}",\n`);
  });

  return results;
}

uploadIcons().catch(console.error);
